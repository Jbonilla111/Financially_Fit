from pydantic import BaseModel, Field, ValidationError
class UserLogin(BaseModel):
    email: str
    password: str = Field(min_length=6)

try:
    UserLogin(email="luke.macvicar@gmail.com", password="password")
    print("Success")
except ValidationError as e:
    print(e.json())
