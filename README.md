To-Do Full Stack App (FastAPI + Next.js)

Это тестовое задание для позиции Junior Full Stack Developer. Приложение позволяет пользователям регистрироваться, входить в систему и управлять своими задачами (To-Do).

🚀 Технологии
Frontend: Next.js, TypeScript, Mantine, Axios
Backend: FastAPI, SQLite, SQLAlchemy, JWT, Pydantic

🧑‍💻 Как запустить проект локально
1. Клонирование репозитория
git clone https://github.com/your-username/todo-app-test.git
cd todo-app-test

2. Установка и активация виртуального окружения (для backend)
python -m venv venv
./venv/Scripts/activate    # Windows
source venv/bin/activate  # Linux/Mac

3. Установка зависимостей backend
pip install -r requirements.txt

4. Установка зависимостей frontend
cd frontend
npm install
cd ..

5. Запуск backend и frontend одновременно одной командой
npm run dev

🔗 Откройте приложение в браузере по адресу:
http://localhost:3000/sign-in

📫 Примеры запросов
🔐 Регистрация
POST http://127.0.0.1:8000/signup
Content-Type: application/json

{
  "username": "Altynai",
  "password": "mypassword"
}

🔑 Авторизация
POST http://127.0.0.1:8000/token
Content-Type: application/x-www-form-urlencoded

username=Altynai&password=mypassword

Ответ:
{
  "access_token": "<JWT-токен>",
  "token_type": "bearer"
}

📋 Получение задач
GET http://127.0.0.1:8000/todos
Authorization: Bearer <JWT-токен>

➕ Создание задачи
POST http://127.0.0.1:8000/todos
Authorization: Bearer <JWT-токен>
Content-Type: application/json

{
  "title": "Закончить проект",
  "description": "Сдать в срок задание и оформить README."
}

✏️ Обновление задачи
PUT http://127.0.0.1:8000/todos/1
Authorization: Bearer <JWT-токен>
Content-Type: application/json

{
  "title": "Обновлённое задание",
  "description": "Новые детали задачи."
}

❌ Удаление задачи
DELETE http://127.0.0.1:8000/todos/1
Authorization: Bearer <JWT-токен>

🗂️ Структура проекта
todo-app-test/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   ├── auth.py
│   └── database.py
├── frontend/
│   ├── pages/
│   ├── styles/
│   └── public/
├── venv/
├── requirements.txt
├── package.json
└── README.md

✅ Готовые функции
Регистрация и вход пользователя с JWT
Защищённый доступ к API
CRUD-операции с задачами
UI с использованием Mantine
Интерактивный frontend с TypeScript и Next.js

