from sqlalchemy.orm import Session
import models, schemas, auth

# ➕ Регистрация пользователя
def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 🔑 Аутентификация пользователя
def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not auth.verify_password(password, user.password):
        return False
    return user

# ➕ Создание задачи
def create_todo(db: Session, todo: schemas.ToDoCreate, user_id: int):
    db_todo = models.ToDo(**todo.dict(), owner_id=user_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

# 📥 Получение всех задач пользователя
def get_todos(db: Session, user_id: int):
    return db.query(models.ToDo).filter(models.ToDo.owner_id == user_id).all()

# 🔁 Обновление задачи
def update_todo(db: Session, todo_id: int, todo: schemas.ToDoUpdate, user_id: int):
    db_todo = db.query(models.ToDo).filter(models.ToDo.id == todo_id, models.ToDo.owner_id == user_id).first()
    if db_todo:
        for key, value in todo.dict(exclude_unset=True).items():
            setattr(db_todo, key, value)
        db.commit()
        db.refresh(db_todo)
    return db_todo

# ❌ Удаление задачи
def delete_todo(db: Session, todo_id: int, user_id: int):
    db_todo = db.query(models.ToDo).filter(models.ToDo.id == todo_id, models.ToDo.owner_id == user_id).first()
    if db_todo:
        db.delete(db_todo)
        db.commit()
    return db_todo
