# 🐍 ARURA Backend & Django REST Framework Setup Guide

The Arura backend is built with Python 3.11, Django REST Framework, PostgreSQL 16, Redis 7, and Celery.

---

## 1. System Requirements
* Python 3.11+
* PostgreSQL 16
* Redis 7
* Pipenv or Poetry / Virtualenv

---

## 2. Local Environment Setup

### Step 1: Create and Activate Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 2: Install Python Dependencies
```bash
pip install --upgrade pip
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt \
            psycopg2-binary redis celery drf-spectacular pillow
```

### Step 3: Configure Environment Variables (`.env`)
Create a `.env` file in the root directory:
```env
DEBUG=True
SECRET_KEY="arura_dev_secret_key_change_in_production"
ALLOWED_HOSTS="localhost,127.0.0.1"

# Database
DATABASE_URL="postgresql://arura_admin:arura_secure_password_2026@localhost:5432/arura_db"

# Redis & Celery
REDIS_URL="redis://localhost:6379/0"
CELERY_BROKER_URL="redis://localhost:6379/1"
CELERY_RESULT_BACKEND="redis://localhost:6379/2"

# Gemini AI Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### Step 4: Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 5: Seed Sample Content & Create Superuser
```bash
python manage.py createsuperuser
# Seed catalog
python manage.py loaddata backend/fixtures/initial_catalog.json
```

### Step 6: Start Celery Worker & Beat Scheduler
In a separate terminal:
```bash
celery -A config worker --loglevel=info
```
And for periodic tasks (EPG fetch, recommendations cache):
```bash
celery -A config beat --loglevel=info
```

### Step 7: Launch Django Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```
Open `http://localhost:8000/api/v1/openapi.json` or `http://localhost:8000/api/schema/swagger-ui/`.
