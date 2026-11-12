# 🚢 ARURA Production Deployment Guide

This guide describes deploying Arura to Cloud Run, Kubernetes, or standard Linux VMs using Docker.

---

## 1. Environment Configurations

All production deployments require the following environment variables:

| Variable | Required | Description | Example |
|---|---|---|---|
| `NODE_ENV` | Yes | Node environment | `production` |
| `PORT` | Yes | HTTP listening port | `3000` |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/arura_db` |
| `REDIS_URL` | Yes | Redis connection string | `redis://:pass@host:6379/0` |
| `GEMINI_API_KEY` | Yes | Google GenAI API key for mood AI | `AIzaSy...` |
| `JWT_SECRET` | Yes | Cryptographic secret for signing tokens | `32+ characters random string` |
| `APP_URL` | Yes | Public domain URL | `https://arura.tv` |

---

## 2. Deploying with Docker & Docker Compose

### Step 1: Provision Server (Ubuntu 22.04 LTS / Debian 12)
Install Docker and Docker Compose plugin:
```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
```

### Step 2: Clone & Deploy
```bash
git clone https://github.com/ayanislam/arura-streaming.git
cd arura-streaming
cp .env.example .env

# Edit .env with your real credentials
nano .env

# Build and start services in background
docker compose up -d --build
```

### Step 3: Run Database Migrations
```bash
docker compose exec web npx tsx server/seed.ts
```

---

## 3. Kubernetes (K8s) Deployment Manifests

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arura-streaming-web
  labels:
    app: arura
spec:
  replicas: 3
  selector:
    matchLabels:
      app: arura
  template:
    metadata:
      labels:
        app: arura
    spec:
      containers:
      - name: web
        image: gcr.io/arura-streaming/web:latest
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          limits:
            cpu: "1000m"
            memory: "1024Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"
```

---

## 4. Health Check Observability

* **Live Check**: `GET http://localhost:3000/health/live` (Returns HTTP 200 `{"status": "ALIVE"}`)
* **Ready Check**: `GET http://localhost:3000/health/ready` (Returns HTTP 200 when DB and Redis are reachable)
* **Comprehensive Metrics**: `GET http://localhost:3000/health` (Reports uptime, memory usage, and load)
