/my_project
│
├── /backend
│   ├── main.py          # Punkt wejścia (inicjalizacja FastAPI)
│   ├── database.py      # Konfiguracja SQLAlchemy i połączenia z MySQL
│   ├── models.py        # KLASY bazy danych (SQLAlchemy)
│   ├── schemas.py       # KLASY walidacji (Pydantic) - Twoja walidacja serwera!
│   ├── auth.py          # Logika logowania, JWT i ról
│   ├── /routers         # Folder z podziałem na endpointy (API)
│       ├── users.py
│       ├── projects.py
│
├── /frontend            # Tutaj Twoje SPA (np. Vue.js lub React)
│
├── scripts_db.sql       # Skrypt tworzenia bazy i przykładowych danych
└── requirements.txt     # Lista bibliotek