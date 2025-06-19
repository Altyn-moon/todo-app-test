from pydantic import BaseModel
from typing import Optional

# ===== Пользователь =====

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True


# ===== Задача (ToDo) =====

class ToDoCreate(BaseModel):
    title: str
    description: Optional[str] = None

class ToDoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class ToDoOut(ToDoCreate):
    id: int
    completed: bool

    class Config:
        orm_mode = True
