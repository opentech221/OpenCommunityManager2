# 🚀 CI/CD & Déploiement - Open Community Manager

Guide complet pour le déploiement et l'intégration continue du projet OpenCommunityManager.

## 📋 Table des Matières

- [🎯 Aperçu](#-aperçu)
- [🔧 Configuration](#-configuration)
- [🚀 Déploiement Local](#-déploiement-local)
- [☁️ Déploiement Cloud](#️-déploiement-cloud)
- [🧪 Tests et Qualité](#-tests-et-qualité)
- [📊 Monitoring](#-monitoring)
- [🛠️ Maintenance](#️-maintenance)

## 🎯 Aperçu

Notre pipeline CI/CD utilise **GitHub Actions** pour automatiser:
- ✅ Tests frontend et backend
- 🔍 Analyse de sécurité (CodeQL, npm audit)
- 🏗️ Build optimisé avec code splitting
- 🐳 Containerisation Docker
- 🚀 Déploiement automatique
- 📊 Monitoring et métriques

### 📊 État du Projet

| Métrique | Valeur | Status |
|----------|--------|--------|
| **Tests** | 56/56 (100%) | ✅ |
| **Bundle** | 236KB (vs 705KB) | ✅ |
| **Coverage** | 98.2% | ✅ |
| **Security** | 0 vulnérabilités | ✅ |
| **Build** | 19.48s | ✅ |

## 🔧 Configuration

### 1. Variables d'Environnement

Copiez et configurez le fichier d'environnement :

```bash
cp .env.production .env
# Editez .env avec vos valeurs
```

### 2. Secrets GitHub

Configurez ces secrets dans votre repository GitHub :

```yaml
# Docker Hub
DOCKER_USERNAME: votre_username_docker
DOCKER_PASSWORD: votre_password_docker

# Base de données
POSTGRES_PASSWORD: mot_de_passe_securise

# JWT & Sécurité
SECRET_KEY: cle_secrete_256_bits
JWT_SECRET_KEY: cle_jwt_256_bits

# Déploiement
RAILWAY_TOKEN: token_railway  # ou autre plateforme

# Monitoring (optionnel)
CODECOV_TOKEN: token_codecov
SNYK_TOKEN: token_snyk
SLACK_WEBHOOK: webhook_slack
```

## 🚀 Déploiement Local

### Option 1: Docker Compose (Recommandé)

```bash
# 🚀 Déploiement complet automatique
chmod +x deploy.sh
./deploy.sh

# Ou manuellement:
docker-compose up -d --build
```

### Option 2: Développement

```bash
# Frontend
npm install
npm run dev

# Backend (terminal séparé)
cd backend
pip install -r requirements.txt
python run.py
```

### 🔍 Vérification

```bash
# Frontend: http://localhost:3000
curl http://localhost:3000

# Backend: http://localhost:5000
curl http://localhost:5000/api/health

# Base de données
docker-compose exec database psql -U postgres -d opencommunity
```

## ☁️ Déploiement Cloud

### Railway (Recommandé)

1. **Connectez votre repository GitHub**
2. **Configurez les variables d'environnement**
3. **Le déploiement se fait automatiquement**

```bash
# CLI Railway (optionnel)
npm install -g @railway/cli
railway login
railway deploy
```

### Render

1. **Créez un nouveau service Web**
2. **Connectez GitHub**
3. **Configurez build:** `npm run build`
4. **Configurez start:** `npm start`

### Vercel (Frontend uniquement)

```bash
npm install -g vercel
vercel --prod
```

### Docker Hub

Les images sont automatiquement publiées sur Docker Hub via GitHub Actions :

```bash
# Pull les images
docker pull yourusername/opencommunity-frontend:latest
docker pull yourusername/opencommunity-backend:latest

# Run
docker-compose up -d
```

## 🧪 Tests et Qualité

### Tests Locaux

```bash
# Tests complets
npm test

# Tests avec coverage
npm run test:coverage

# Tests backend
cd backend && pytest --cov=app

# Tests E2E (si configurés)
npm run test:e2e
```

### Analyse de Qualité

```bash
# Lint
npm run lint

# Audit sécurité
npm audit

# Analyse bundle
npm run build
npx bundlesize
```

### Pipeline CI/CD

Le pipeline GitHub Actions s'exécute automatiquement sur :
- ✅ Push sur `main`, `master`, `develop`
- ✅ Pull Requests
- ✅ Manuellement via `workflow_dispatch`

**Phases du pipeline:**
1. 🔍 Analyse code & sécurité
2. 🧪 Tests frontend/backend
3. 🏗️ Build & analyse bundle
4. 🐳 Build images Docker
5. 🚀 Déploiement staging/production
6. ⚡ Tests performance

## 📊 Monitoring

### Métriques Disponibles

```bash
# Logs application
docker-compose logs -f backend
docker-compose logs -f frontend

# Métriques système
docker stats

# Santé des services
curl http://localhost:5000/api/health
curl http://localhost:3000
```

### Prometheus + Grafana (Optionnel)

```bash
# Démarrer avec monitoring
docker-compose --profile monitoring up -d

# Accès interfaces:
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin123)
```

### Alertes Slack

Configurez `SLACK_WEBHOOK` pour recevoir des notifications :
- ✅ Déploiements réussis
- ❌ Échecs de build
- 📊 Métriques de performance

## 🛠️ Maintenance

### Sauvegardes

```bash
# Sauvegarde automatique (via deploy.sh)
./deploy.sh backup

# Sauvegarde manuelle base de données
docker-compose exec database pg_dump -U postgres opencommunity > backup.sql

# Sauvegarde fichiers uploads
tar -czf uploads-backup.tar.gz uploads/
```

### Restauration

```bash
# Restaurer base de données
docker-compose exec -T database psql -U postgres opencommunity < backup.sql

# Restaurer fichiers
tar -xzf uploads-backup.tar.gz
```

### Mise à jour

```bash
# Mise à jour dépendances
npm update
cd backend && pip install -r requirements.txt --upgrade

# Rebuild images
docker-compose build --no-cache
docker-compose up -d
```

### Nettoyage

```bash
# Nettoyage Docker
docker system prune -a -f

# Nettoyage logs
docker-compose logs --since 24h > recent-logs.txt
docker-compose down && docker-compose up -d
```

## 🔧 Dépannage

### Problèmes Fréquents

**1. Échec de build frontend**
```bash
# Nettoyer cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

**2. Problème base de données**
```bash
# Réinitialiser base de données
docker-compose down -v
docker-compose up -d database
# Attendre puis relancer backend
```

**3. Port déjà utilisé**
```bash
# Trouver et tuer le processus
lsof -i :3000
kill -9 <PID>
```

**4. Problème permissions Docker**
```bash
# Ajouter utilisateur au groupe docker
sudo usermod -aG docker $USER
# Redémarrer session
```

### Logs Utiles

```bash
# Logs détaillés
docker-compose logs -f --tail=100

# Logs spécifiques
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database

# Logs système
journalctl -u docker.service
```

## 🎯 Optimisations Performance

### Frontend
- ✅ Code splitting implémenté
- ✅ Lazy loading des composants
- ✅ Bundle optimisé (236KB)
- ✅ Compression gzip
- ✅ Cache browser optimisé

### Backend
- ✅ Connexions database pooling
- ✅ Cache Redis (optionnel)
- ✅ Compression responses
- ✅ Logs structurés

### Infrastructure
- ✅ Health checks automatiques
- ✅ Auto-restart services
- ✅ Monitoring ressources
- ✅ Sauvegardes automatiques

## 📚 Ressources

- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

---

**✨ Projet maintenu avec ❤️ par l'équipe OpenTech**

*Dernière mise à jour: Août 2025*
