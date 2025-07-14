# Open Community Manager

Une application web moderne de gestion d'associations qui permet aux organisations communautaires de digitaliser leur gestion administrative, financière et opérationnelle.

## 🎯 Fonctionnalités principales

- **Gestion des membres** : Administration des membres avec rôles et statuts
- **Suivi des cotisations** : Gestion des paiements et génération de rapports
- **Événements** : Planification et gestion des activités associatives
- **Finances** : Suivi des entrées et sorties, bilans automatisés
- **Documents** : Archivage sécurisé des PV, rapports et documents officiels
- **Communication** : Messagerie interne entre membres
- **Profil public** : Vitrine associative visible en ligne

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS (palette personnalisée)
- **Routing** : React Router DOM
- **Icons** : Lucide React
- **Typographie** : Montserrat (titres) + Poppins (corps)
- **Backend** : Flask (Python) + SQLite/PostgreSQL
- **API REST** : Flask RESTful
- **CI/CD** : Netlify (frontend) + GitHub Actions (build, tests, déploiement)
- **Documentation** : Markdown (docs/)

## 🎨 Design System

### Couleurs
- Violet principal : `#6600cc`
- Orange secondaire : `#FF6600`
- Interface moderne avec approche mobile-first

### Typographie
- **Titres** : Montserrat (Bold/Semibold)
- **Corps** : Poppins (Regular/Medium)

## 🚀 Installation et développement

### Prérequis

- Node.js (v18+) et npm ou yarn (pour le frontend)
- Python 3.10+ et pip (pour le backend)
- SQLite (par défaut) ou PostgreSQL (optionnel)

### Variables d'environnement

- Créez un fichier `.env` à la racine du frontend (`src/` ou projet) et du backend (`backend/`).
- Exemple frontend :
  ```env
  VITE_BACKEND_URL=http://localhost:5000/api
  ```
- Exemple backend :
  ```env
  FLASK_ENV=development
  DATABASE_URL=sqlite:///instance/app.db
  SECRET_KEY=change-me
  ```

### Installation du frontend

```bash
# À la racine du projet
npm install
npm run dev
```

### Installation du backend

```bash
# Dans le dossier backend/
pip install -r requirements.txt
python run.py
```

### Scripts disponibles

- `npm run dev` : Lance le serveur de développement React/Vite (http://localhost:5173)
- `npm run build` : Build de production frontend
- `npm run lint` : Vérification du code avec ESLint
- `npm run preview` : Prévisualisation du build
- `python run.py` : Lance le backend Flask (http://localhost:5000)
- `flask db upgrade` : Applique les migrations DB

### Accès à l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:5000/api

---

Pour le déploiement, suivez les instructions dans `docs/DEPLOYMENT.md` (Netlify pour le frontend, Render/Railway/Heroku pour le backend).

## 📱 Responsive Design

L'application est conçue avec une approche **mobile-first** :
- **Smartphone** : Interface optimisée pour les associations de quartier
- **Desktop** : Version étendue pour fédérations et municipalités
- **Tablette** : Adaptation fluide entre les deux formats

## 🏗️ Architecture du projet

```
OpenCommunityManager2/
├── backend/           # Backend Flask (API, modèles, migrations)
│   ├── app/           # Code principal Flask
│   ├── migrations/    # Migrations DB
│   ├── instance/      # Base SQLite
│   └── requirements.txt
├── src/               # Frontend React
│   ├── components/    # Composants réutilisables
│   ├── pages/         # Pages principales
│   ├── types/         # Types TypeScript
│   ├── constants/     # Constantes
│   ├── hooks/         # Hooks personnalisés
│   ├── utils/         # Fonctions utilitaires
│   └── styles/        # Styles globaux
├── public/            # Assets publics
├── uploads/           # Fichiers uploadés
├── docs/              # Documentation projet
│   ├── USER_GUIDE.md
│   ├── TECHNICAL_DOCS.md
│   ├── DEPLOYMENT.md
│   └── screenshots/
├── .github/workflows/ # CI/CD GitHub Actions
├── .env               # Variables d'environnement
└── README.md
```

## 🎯 Objectifs UX

- **Simplicité** : Interface intuitive pour utilisateurs non-techniques
- **Efficacité** : Workflow optimisé pour la gestion quotidienne
- **Accessibilité** : Conforme aux standards d'accessibilité web
- **Performance** : Chargement rapide et navigation fluide

## 📋 Roadmap

### Phase 1 - MVP (En cours)
- [x] Structure du projet et design system
- [x] Mobile-first et responsive sur toutes les pages principales
- [x] Intégration CI/CD Netlify + GitHub
- [x] Documentation complète
- [x] Page d'accueil et authentification
- [x] Dashboard principal
- [x] Sidebar, header, footer, navigation
- [ ] Gestion des membres (CRUD, rôles)
- [ ] Système de cotisations (suivi, rapports)

### Phase 2 - Fonctionnalités avancées
- [ ] Gestion des événements (planning, inscriptions)
- [ ] Module financier (entrées/sorties, bilans)
- [ ] Système documentaire (upload, archivage)
- [ ] Messagerie interne
- [ ] Profil public association

### Phase 3 - Optimisations & Production
- [ ] API REST backend (Flask, déploiement cloud)
- [ ] Tests automatisés (unitaires, e2e)
- [ ] Accessibilité (WCAG, navigation clavier)
- [ ] Optimisation performance (lazy loading, audits)
- [ ] Déploiement production (frontend + backend)

## 👥 Cibles

- Associations communautaires et socioculturelles
- Organisations de jeunesse et de femmes
- Collectifs de quartier et mutuelles
- Fédérations et unions associatives

## 📞 Contact

Développé par **OpenTech221 Impact** pour la digitalisation des associations sénégalaises.

## 📄 Licence

Ce projet est sous licence MIT.
