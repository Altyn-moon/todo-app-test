from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from fastapi.middleware.cors import CORSMiddleware

import models, schemas, crud, auth
from database import SessionLocal, engine
from models import Base

# 📦 Создаём таблицы в БД
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔑 Точка получения токена
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# 📥 Подключение к БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 👤 Получение текущего пользователя по токену
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# 🔐 Регистрация
@app.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

# 🔐 Авторизация + выдача токена
@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

# 📥 Получение задач текущего пользователя
@app.get("/todos", response_model=list[schemas.ToDoOut])
def read_todos(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.get_todos(db, current_user.id)

# ➕ Создание задачи
@app.post("/todos", response_model=schemas.ToDoOut)
def create_todo(todo: schemas.ToDoCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_todo(db, todo, current_user.id)

# 🔁 Обновление задачи
@app.put("/todos/{todo_id}", response_model=schemas.ToDoOut)
def update_todo(todo_id: int, todo: schemas.ToDoUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated = crud.update_todo(db, todo_id, todo, current_user.id)
    if not updated:
        raise HTTPException(status_code=404, detail="ToDo not found")
    return updated

# ❌ Удаление задачи
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = crud.delete_todo(db, todo_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="ToDo not found")
    return {"message": "Deleted"}
