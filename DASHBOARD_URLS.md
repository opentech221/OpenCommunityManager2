# 📊 Guide d'Accès aux Tableaux de Bord - Open Community Manager

## 🚀 **ÉTAPES POUR VOIR VOS TABLEAUX DE BORD**

### **Étape 1 : Démarrer tous les services**
```bash
# Dans le dossier du projet
cd c:\Users\toshiba\Downloads\zzz\OpenCommunityManager2

# Démarrer avec monitoring
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

### **Étape 2 : Accéder aux interfaces web**

## 🌐 **URLS D'ACCÈS DIRECT**

| Service | URL | Identifiants | Description |
|---------|-----|-------------|-------------|
| **🎯 Application Principal** | http://localhost | - | Votre app OpenCommunityManager |
| **📊 Grafana (Tableaux de bord)** | http://localhost:3001 | admin / admin | Dashboards visuels |
| **🔍 Prometheus (Métriques)** | http://localhost:9090 | - | Métriques brutes |
| **🐍 API Backend** | http://localhost:5000 | - | API Flask |
| **🗄️ Base de données** | localhost:5432 | ocm_user / secure_password | PostgreSQL |
| **🔄 Redis Cache** | localhost:6379 | - | Cache Redis |

## 📊 **TABLEAUX DE BORD GRAFANA - MODE D'EMPLOI**

### **1. Première connexion à Grafana :**
1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:3001**
3. Connectez-vous avec :
   - **Username :** `admin`
   - **Password :** `admin` (changez lors de la première connexion)

### **2. Que verrez-vous ?**

#### 📈 **Dashboard "Application Overview"**
```
🎯 MÉTRIQUES CLÉS :
├── Utilisateurs connectés en temps réel
├── Requêtes API par minute  
├── Temps de réponse moyen
├── Erreurs HTTP (404, 500, etc.)
├── Utilisation CPU/RAM
└── Statut des services
```

#### 💾 **Dashboard "Base de Données"**
```
🗄️ MÉTRIQUES BDD :
├── Connexions actives
├── Requêtes lentes (> 1s)
├── Taille de la base
├── Tables les plus utilisées
└── Index manquants
```

#### 🚀 **Dashboard "Performance Frontend"**
```
⚡ MÉTRIQUES FRONTEND :
├── Temps de chargement des pages
├── Bundle size en temps réel
├── Erreurs JavaScript
├── Core Web Vitals
└── Navigateurs utilisés
```

## 🔍 **PROMETHEUS - EXPLORER LES MÉTRIQUES**

### **Accès :** http://localhost:9090

### **Requêtes utiles à tester :**
```promql
# Nombre de requêtes HTTP
http_requests_total

# Utilisation CPU
cpu_usage_percent

# Temps de réponse API
api_response_time_seconds

# Erreurs par minute
rate(http_errors_total[1m])

# Utilisateurs actifs
active_users_gauge
```

## 🛠️ **DÉPANNAGE RAPIDE**

### **Services ne démarrent pas ?**
```bash
# Vérifier les logs
docker-compose logs grafana
docker-compose logs prometheus

# Redémarrer un service spécifique
docker-compose restart grafana
```

### **Grafana inaccessible ?**
```bash
# Vérifier le port
docker-compose ps grafana

# Si le port est différent, modifier dans docker-compose.yml
```

### **Pas de données dans Grafana ?**
1. Vérifiez que Prometheus fonctionne : http://localhost:9090
2. Vérifiez que votre app génère du trafic
3. Actualisez les dashboards Grafana

## 📱 **UTILISATION PRATIQUE**

### **Scénario 1 : Surveiller votre app en développement**
1. Démarrez : `docker-compose up -d`
2. Ouvrez votre app : http://localhost
3. Surveillez Grafana : http://localhost:3001
4. Générez du trafic (naviguez, créez des comptes, etc.)
5. Observez les métriques en temps réel !

### **Scénario 2 : Diagnostiquer un problème**
1. App lente ? → Grafana dashboard "Performance"
2. Erreurs ? → Prometheus requête "http_errors_total"
3. Base de données ? → Dashboard "Database"
4. Serveur surchargé ? → Métriques système

### **Scénario 3 : Présenter à un client/investisseur**
1. Lancez tout avec : `docker-compose up -d`
2. Ouvrez Grafana en plein écran
3. Montrez les dashboards temps réel
4. Démontrez la surveillance proactive

## 🎯 **PROCHAINES ÉTAPES**

### **Configuration avancée :**
1. **Alertes Slack/Email** quand problème détecté
2. **Dashboards personnalisés** pour votre business
3. **Métriques métier** (nouveaux utilisateurs, revenus, etc.)
4. **Rapports automatiques** PDF/Excel

### **Commandes utiles :**
```bash
# Voir tous les services
docker-compose ps

# Logs en temps réel
docker-compose logs -f

# Arrêter proprement
docker-compose down

# Redémarrer avec dernières modifs
docker-compose up -d --build
```

---

## 🎉 **FÉLICITATIONS !**

Vous avez maintenant :
✅ **Surveillance 24/7** de votre application  
✅ **Tableaux de bord professionnels**  
✅ **Métriques en temps réel**  
✅ **Diagnostics automatiques**  

**🌟 Votre OpenCommunityManager a désormais une infrastructure de monitoring digne des plus grandes entreprises tech !**