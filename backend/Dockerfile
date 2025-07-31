# 🐳 Dockerfile pour Backend Flask
FROM python:3.11-slim

# 📁 Définir le répertoire de travail
WORKDIR /app

# 🔧 Installer les dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# 📦 Copier requirements.txt
COPY requirements.txt .

# 📥 Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# 📂 Copier le code source
COPY . .

# 👤 Créer un utilisateur non-root
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

# 🔧 Exposer le port
EXPOSE 5000

# 🌍 Variables d'environnement
ENV FLASK_APP=run.py
ENV FLASK_ENV=production

# 🏃 Commande de démarrage
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "run:app"]
