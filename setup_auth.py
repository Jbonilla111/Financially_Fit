#!/usr/bin/env python3

import logging
import os
import sys
from typing import Any, Dict, Iterable, List, Optional
from urllib.parse import quote, urljoin

import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("setup_auth")


AUTHENTIK_URL = os.getenv("AUTHENTIK_URL", "https://auth.brain-server.com").rstrip("/")
AUTHENTIK_API_TOKEN = os.getenv("AUTHENTIK_API_TOKEN")
APP_NAME = os.getenv("APP_NAME", "financiallyfit")
BASE_DOMAIN = os.getenv("BASE_DOMAIN", "brain-server.com")
APP_HOSTNAME = os.getenv("APP_HOSTNAME", f"{APP_NAME}.{BASE_DOMAIN}")
APP_INTERNAL_HOST = os.getenv("APP_INTERNAL_HOST", "http://financiallyfit-backend:8000")
GROUP_NAME = os.getenv("AUTHENTIK_GROUP_NAME", f"{APP_NAME}-users")
POLICY_NAME = os.getenv("AUTHENTIK_POLICY_NAME", f"{APP_NAME}-access-policy")
POLICY_EXPRESSION = os.getenv(
    "AUTHENTIK_POLICY_EXPRESSION",
    f"return request.user.groups.filter(name=\"{GROUP_NAME}\").exists()",
)
AUTHENTIK_AUTHORIZATION_FLOW = os.getenv("AUTHENTIK_AUTHORIZATION_FLOW")
AUTHENTIK_INVALIDATION_FLOW = os.getenv("AUTHENTIK_INVALIDATION_FLOW")

if not AUTHENTIK_API_TOKEN:
    logger.error("AUTHENTIK_API_TOKEN must be set")
    sys.exit(1)


class AuthentikAPI:
    def __init__(self, base_url: str, token: str):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update(
            {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            }
        )

    def _request(self, method: str, endpoint: str, json: Optional[Dict[str, Any]] = None) -> requests.Response:
        url = urljoin(self.base_url + "/", endpoint.lstrip("/"))
        response = self.session.request(method=method, url=url, json=json, timeout=30)
        if response.status_code >= 400:
            logger.error("%s %s -> %s %s", method, endpoint, response.status_code, response.text)
        return response

    def get_json(self, endpoint: str) -> Dict[str, Any]:
        resp = self._request("GET", endpoint)
        resp.raise_for_status()
        return resp.json()

    def post_json(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        resp = self._request("POST", endpoint, payload)
        resp.raise_for_status()
        return resp.json()

    def patch_json(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        resp = self._request("PATCH", endpoint, payload)
        resp.raise_for_status()
        return resp.json()

    def first_success_get(self, endpoints: Iterable[str]) -> Dict[str, Any]:
        last_error: Optional[Exception] = None
        for endpoint in endpoints:
            try:
                return self.get_json(endpoint)
            except Exception as exc:
                last_error = exc
        if last_error:
            raise last_error
        raise RuntimeError("No endpoints provided")

    def first_success_post(self, endpoints: Iterable[str], payload: Dict[str, Any]) -> Dict[str, Any]:
        last_error: Optional[Exception] = None
        for endpoint in endpoints:
            try:
                return self.post_json(endpoint, payload)
            except Exception as exc:
                last_error = exc
        if last_error:
            raise last_error
        raise RuntimeError("No endpoints provided")


def _first(results: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    items = results.get("results", [])
    return items[0] if items else None


def _list_all_applications(api: AuthentikAPI) -> List[Dict[str, Any]]:
    # Keep pagination simple and deterministic for current instance size.
    data = api.get_json("/api/v3/core/applications/?page_size=200")
    return data.get("results", [])


def _list_all_groups(api: AuthentikAPI) -> List[Dict[str, Any]]:
    data = api.get_json("/api/v3/core/groups/?page_size=200")
    return data.get("results", [])


def _list_all_proxy_providers(api: AuthentikAPI) -> List[Dict[str, Any]]:
    data = api.first_success_get(["/api/v3/providers/proxy/?page_size=200", "/api/v3/proxyProviders/?page_size=200"])
    return data.get("results", [])


def get_or_create_group(api: AuthentikAPI, name: str) -> Dict[str, Any]:
    found = next((group for group in _list_all_groups(api) if group.get("name") == name), None)
    if found:
        logger.info("Group exists: %s (%s)", name, found["pk"])
        return found

    created = api.post_json("/api/v3/core/groups/", {"name": name, "parent": None})
    logger.info("Group created: %s (%s)", name, created["pk"])
    return created


def get_or_create_proxy_provider(api: AuthentikAPI, app_name: str, internal_host: str, external_host: str) -> Dict[str, Any]:
    providers = _list_all_proxy_providers(api)
    applications = _list_all_applications(api)
    default_authorization_flow = AUTHENTIK_AUTHORIZATION_FLOW or (providers[0].get("authorization_flow") if providers else None)
    default_invalidation_flow = AUTHENTIK_INVALIDATION_FLOW or (providers[0].get("invalidation_flow") if providers else None)

    def _find_provider(name: str) -> Optional[Dict[str, Any]]:
        return next((provider for provider in providers if provider.get("name") == name), None)

    candidate_names = [
        f"{app_name}-proxy",
        f"{app_name}-proxy-dedicated",
        f"{app_name}-proxy-2",
    ]

    for provider_name in candidate_names:
        existing = _find_provider(provider_name)
        if existing:
            provider_pk = existing.get("pk")
            apps_using_provider = [app for app in applications if app.get("provider") == provider_pk]
            conflict = any(app.get("name") != app_name and app.get("slug") != app_name for app in apps_using_provider)
            if conflict:
                continue
            logger.info("Proxy provider exists: %s (%s)", provider_name, provider_pk)
            return existing

        payload = {
            "name": provider_name,
            "mode": "forward_single",
            "internal_host": internal_host,
            "external_host": external_host,
            "cookie_domain": BASE_DOMAIN,
            "authorization_flow": default_authorization_flow,
            "invalidation_flow": default_invalidation_flow,
        }
        created = api.first_success_post(["/api/v3/providers/proxy/", "/api/v3/proxyProviders/"], payload)
        logger.info("Proxy provider created: %s (%s)", provider_name, created["pk"])
        return created

    raise RuntimeError("Unable to find or create a usable proxy provider")


def get_or_create_application(api: AuthentikAPI, app_name: str, provider_id: int, group_id: int) -> Dict[str, Any]:
    found = None
    applications = _list_all_applications(api)
    for app in applications:
        if app.get("name") == app_name or app.get("slug") == app_name:
            found = app
            break
    if not found:
        # Some setups already have an app bound to this provider under a different name.
        for app in applications:
            if app.get("provider") == provider_id:
                found = app
                break
    payload = {
        "name": app_name,
        "slug": app_name,
        "provider": provider_id,
        "group": group_id,
        "policy_engine_mode": "all",
    }

    if found:
        app_ref = found.get("slug") or found.get("pk")
        updated = api.patch_json(f"/api/v3/core/applications/{app_ref}/", payload)
        logger.info("Application updated: %s (%s)", app_name, updated["pk"])
        return updated

    created = api.post_json("/api/v3/core/applications/", payload)
    logger.info("Application created: %s (%s)", app_name, created["pk"])
    return created


def get_or_create_expression_policy(api: AuthentikAPI, policy_name: str, expression: str) -> Dict[str, Any]:
    found = _first(api.get_json(f"/api/v3/policies/expression/?name={quote(policy_name)}"))
    payload = {"name": policy_name, "expression": expression}

    if found:
        updated = api.patch_json(f"/api/v3/policies/expression/{found['pk']}/", payload)
        logger.info("Expression policy updated: %s (%s)", policy_name, updated["pk"])
        return updated

    created = api.post_json("/api/v3/policies/expression/", payload)
    logger.info("Expression policy created: %s (%s)", policy_name, created["pk"])
    return created


def ensure_policy_binding(api: AuthentikAPI, app_pk: int, policy_pk: int) -> Dict[str, Any]:
    bindings = api.get_json(f"/api/v3/policies/bindings/?target={app_pk}").get("results", [])
    for binding in bindings:
        if binding.get("policy") == policy_pk:
            logger.info("Policy binding exists: app=%s policy=%s", app_pk, policy_pk)
            return binding

    created = api.post_json(
        "/api/v3/policies/bindings/",
        {
            "target": app_pk,
            "policy": policy_pk,
            "order": 0,
            "enabled": True,
            "negate": False,
            "failure_result": False,
            "timeout": 30,
        },
    )
    logger.info("Policy binding created: app=%s policy=%s", app_pk, policy_pk)
    return created


def main() -> int:
    logger.info("Configuring Authentik for %s on %s", APP_NAME, APP_HOSTNAME)
    api = AuthentikAPI(AUTHENTIK_URL, AUTHENTIK_API_TOKEN)

    # Use a stable list endpoint for connectivity because some Authentik builds do not expose core/version.
    api.get_json("/api/v3/core/groups/?page=1")

    group = get_or_create_group(api, GROUP_NAME)
    provider = get_or_create_proxy_provider(
        api,
        APP_NAME,
        APP_INTERNAL_HOST,
        f"https://{APP_HOSTNAME}",
    )
    app = get_or_create_application(api, APP_NAME, provider["pk"], group["pk"])
    policy = get_or_create_expression_policy(api, POLICY_NAME, POLICY_EXPRESSION)
    ensure_policy_binding(api, app["pk"], policy["pk"])

    logger.info("Done")
    logger.info("Group=%s Provider=%s App=%s Policy=%s", group["pk"], provider["pk"], app["pk"], policy["pk"])
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except requests.HTTPError as exc:
        logger.error("Authentik API error: %s", exc)
        raise
