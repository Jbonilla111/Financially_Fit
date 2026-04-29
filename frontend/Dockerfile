FROM alpine:3.20 AS base

RUN apk update && apk upgrade && apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund


FROM base AS dev

ENV NODE_ENV=development

COPY . .

EXPOSE 3000

CMD ["npm", "start"]


FROM base AS build

COPY . .

ARG REACT_APP_API_URL=
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build


FROM nginx:1.27-alpine AS prod

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
