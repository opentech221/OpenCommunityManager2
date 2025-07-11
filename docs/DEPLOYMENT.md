# Guide de déploiement - Open Community Manager

## 🚀 Déploiement sur GitHub Pages (Frontend seulement)

### Étape 1 : Préparation du build

```bash
# Créer un build de production
npm run build

# Vérifier le contenu du dossier dist
ls -la dist/
```

### Étape 2 : Configuration GitHub Pages

1. Dans votre repository GitHub, allez dans **Settings** → **Pages**
2. Sélectionnez **GitHub Actions** comme source
3. Créez le fichier `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🌐 Déploiement complet (Frontend + Backend)

### Option 1 : Vercel (Frontend) + Railway (Backend)

#### Frontend sur Vercel

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement :
   ```
   VITE_API_URL=https://votre-backend-url.railway.app
   VITE_APP_NAME=Open Community Manager
   ```

#### Backend sur Railway

1. Connectez votre repository à Railway
2. Configurez les variables d'environnement :
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=votre-secret-key-production
   JWT_SECRET_KEY=votre-jwt-secret
   FLASK_ENV=production
   ```

3. Ajoutez un `Procfile` :
   ```
   web: gunicorn run:app
   ```

### Option 2 : Netlify (Frontend) + Heroku (Backend)

#### Frontend sur Netlify

1. Connectez votre repository GitHub à Netlify
2. Configurez les paramètres de build :
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. Variables d'environnement :
   ```
   VITE_API_URL=https://votre-app.herokuapp.com
   ```

#### Backend sur Heroku

1. Créez une app Heroku
2. Configurez les variables d'environnement via le dashboard
3. Ajoutez l'addon PostgreSQL

### Option 3 : Docker (Complet)

#### Dockerfile Frontend

```dockerfile
# Dockerfile.frontend
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerfile Backend

```dockerfile
# Dockerfile.backend
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:app"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:5000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/opencommunity
      - SECRET_KEY=your-secret-key
      - JWT_SECRET_KEY=your-jwt-secret

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=opencommunity
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 📋 Checklist de déploiement

### Avant le déploiement

- [ ] Tests passent en local
- [ ] Build sans erreurs
- [ ] Variables d'environnement configurées
- [ ] Base de données de production configurée
- [ ] Domaine et SSL configurés
- [ ] Sauvegardes configurées

### Sécurité

- [ ] Secrets de production générés
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] Logs de sécurité configurés
- [ ] Certificats SSL valides

### Performance

- [ ] Cache configuré
- [ ] CDN configuré si nécessaire
- [ ] Compression activée
- [ ] Images optimisées
- [ ] Base de données optimisée

### Monitoring

- [ ] Logs centralisés
- [ ] Métriques de performance
- [ ] Alertes configurées
- [ ] Surveillance uptime

## 🔧 Configuration production

### Variables d'environnement

#### Frontend (.env.production)
```
VITE_API_URL=https://api.votredomaine.com
VITE_APP_NAME=Open Community Manager
VITE_SENTRY_DSN=https://...
VITE_ANALYTICS_ID=G-...
```

#### Backend (.env.production)
```
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=super-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production
FLASK_ENV=production
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Configuration Nginx

```nginx
server {
    listen 80;
    server_name votredomaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name votredomaine.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        try_files $uri $uri/ /index.html;
        root /usr/share/nginx/html;
    }
    
    location /api/ {
        proxy_pass http://backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔄 Automatisation CI/CD

### GitHub Actions complète

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build frontend
      run: npm run build
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: frontend-build
        path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: frontend-build
        path: dist/
    
    - name: Deploy to production
      # Configuration selon votre plateforme
      run: echo "Deploying to production..."
```

## 🔍 Surveillance et maintenance

### Monitoring avec Sentry

```javascript
// src/main.tsx
import * as Sentry from '@sentry/react'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 1.0,
  })
}
```

### Logs backend

```python
# backend/run.py
import logging
from logging.handlers import RotatingFileHandler

if app.config['ENV'] == 'production':
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
```

### Sauvegardes automatiques

```bash
#!/bin/bash
# scripts/backup.sh

# Sauvegarde base de données
pg_dump $DATABASE_URL > backups/db_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarde fichiers
tar -czf backups/files_$(date +%Y%m%d_%H%M%S).tar.gz uploads/

# Nettoyage anciennes sauvegardes (garder 30 jours)
find backups/ -name "*.sql" -mtime +30 -delete
find backups/ -name "*.tar.gz" -mtime +30 -delete
```

## 🆘 Résolution de problèmes

### Problèmes courants

1. **Build qui échoue**
   - Vérifiez les dépendances
   - Nettoyez le cache : `npm clean-install`

2. **Erreurs CORS**
   - Configurez correctement les origins dans Flask-CORS
   - Vérifiez les URLs dans les variables d'environnement

3. **Base de données inaccessible**
   - Vérifiez la chaîne de connexion
   - Assurez-vous que le service est démarré

4. **Certificats SSL**
   - Utilisez Let's Encrypt pour des certificats gratuits
   - Configurez le renouvellement automatique

### Rollback

```bash
# Rollback vers la version précédente
git checkout HEAD~1
npm run build
# Redéployer
```

---

**Open Community Manager** - Guide de déploiement
Version 1.0 | Dernière mise à jour : Décembre 2024
