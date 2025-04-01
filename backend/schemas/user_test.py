from pydantic import BaseModel, EmailStr

class UserTestBase(BaseModel):
    clerk_user_id: str
    username: str
    email: EmailStr

class UserTestCreate(UserTestBase):
    pass

class UserTestResponse(UserTestBase):
    id: int

    class Config:
        from_attributes = True 