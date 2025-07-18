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
## 📡 Endpoints publics de l’API backend

L’API Flask expose plusieurs routes publiques pour l’intégration, la supervision et la documentation :

| Endpoint             | Description                                      |
|----------------------|-------------------------------------------------|
| `/`                  | Message d’accueil API contextualisé             |
| `/api/ping`          | Test de vie (pong)                              |
| `/api/health`        | Statut de santé de l’API                        |
| `/api/version`       | Version, backend, base de données               |
| `/api/features`      | Liste des fonctionnalités principales           |
| `/api/docs`          | Liens vers la documentation et le guide         |
| `/api/time`          | Heure serveur                                   |
| `/api/roadmap`       | Roadmap synthétique du projet                   |
| `/api/author`        | Auteur et contact                               |
| `/api/status`        | Statut, environnement, debug, DB                |
| `/api/config`        | Infos config API (uploads, CORS, JWT…)          |
| `/api/endpoints`     | Liste des endpoints publics                     |
| `/api/uptime`        | Uptime (statique)                               |
| `/api/contact`       | Email, GitHub, site OpenTech221                 |
| `/api/license`       | Licence du projet                               |
| `/api/stack`         | Stack technique (backend, frontend, cloud)      |
| `/api/sample`        | Exemples de données membre/association          |
| `/api/links`         | Liens utiles (frontend, backend, docs, GitHub)  |

Ces routes facilitent l’intégration, le monitoring, la démo et la documentation de l’API.


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
  - Backend : Modèles, routes API (GET, POST, PUT, DELETE), gestion des rôles
  - Frontend : Page liste, formulaire ajout/édition, suppression, attribution de rôles
  - Tests : Création, modification, suppression, filtrage par rôle
- [ ] Système de cotisations (suivi, rapports)
  - Backend : Modèle Cotisation, routes API (paiement, historique, rapport)
  - Frontend : Page cotisations, formulaire paiement, affichage historique, génération rapport PDF/Excel
  - Tests : Paiement, génération rapport, export

### Phase 2 - Fonctionnalités avancées
- [ ] Gestion des événements (planning, inscriptions)
  - Backend : Modèle Event, routes API (création, inscription, liste)
  - Frontend : Calendrier, formulaire événement, gestion des inscriptions
  - Tests : Création, inscription, annulation
- [ ] Module financier (entrées/sorties, bilans)
  - Backend : Modèle Transaction, routes API (entrées, sorties, bilans)
  - Frontend : Page finances, formulaire transaction, affichage bilans
  - Tests : Ajout, édition, calcul bilans
- [ ] Système documentaire (upload, archivage)
  - Backend : Upload sécurisé, routes API (upload, liste, suppression)
  - Frontend : Page documents, upload, visualisation, suppression
  - Tests : Upload, accès, suppression
- [ ] Messagerie interne
  - Backend : Modèle Message, routes API (envoi, réception, historique)
  - Frontend : Page messagerie, interface chat
  - Tests : Envoi, réception, notifications
- [ ] Profil public association
  - Backend : Route API profil public
  - Frontend : Page vitrine publique, affichage infos association
  - Tests : Affichage, mise à jour

### Phase 3 - Optimisations & Production
- [ ] API REST backend (Flask, déploiement cloud)
  - Dockerisation, CI/CD, monitoring, documentation Swagger/OpenAPI
- [ ] Tests automatisés (unitaires, e2e)
  - Unitaires (backend, frontend), end-to-end (Cypress, Playwright)
- [ ] Accessibilité (WCAG, navigation clavier)
  - Audit WCAG, navigation clavier, contrastes, ARIA
- [ ] Optimisation performance (lazy loading, audits)
  - Lazy loading, audits Lighthouse, cache, bundle splitting
- [ ] Déploiement production (frontend + backend)
  - Netlify (frontend), Railway/Render/Heroku (backend), backups, monitoring

### Intégration fonctionnelle, partenariats et accompagnement

#### 1. Intégration de services tiers

- **Connecteurs API** : Intégration de services publics (BEL, 3FPT, ONFP...) pour l’accès automatisé aux offres de formation, financement, ou labellisation.
- **Interopérabilité** : Prévoir des endpoints REST pour synchroniser les données avec d’autres plateformes associatives ou institutionnelles.
- **Webhooks & automatisation** : Déclencheurs pour notifier ou synchroniser des actions (ex : inscription à une formation, validation d’un financement).

#### 2. Accompagnement technique et fonctionnel

- **Onboarding** : Parcours guidé pour la prise en main de l’outil (tutoriels, documentation interactive).
- **Support & formation** : Modules de formation intégrés, FAQ, et support technique pour les administrateurs d’associations.
- **Formalisation** : Génération automatisée de documents types (statuts, PV, demandes de subvention) et accompagnement à la conformité réglementaire.
- **Financement** : Mise en relation avec des partenaires financiers via des modules de candidature ou d’appel à projets intégrés.

#### 3. Partenariats et écosystème

- **Partenaires publics** : Modules d’intégration pour la diffusion d’offres, la collecte de données d’impact, et le reporting réglementaire.
- **Partenaires techniques** : API ouvertes pour permettre à des entreprises ou startups d’enrichir l’écosystème (plugins, extensions, services complémentaires).
- **Partenaires financiers** : Suivi des financements, reporting d’utilisation des fonds, et interface de gestion des subventions.

#### 4. Gouvernance et adaptation

- **Prise en compte des parties prenantes** :
  - **Utilisateurs finaux** : Analyse des besoins, ergonomie adaptée, modules personnalisables.
  - **État & collectivités** : Respect des cadres légaux, adaptation aux politiques publiques, conformité RGPD.
  - **Investisseurs & bailleurs** : Transparence, traçabilité des flux, indicateurs d’impact.
  - **Partenaires techniques** : Documentation API, guides d’intégration, support développeur.

## 👥 Cibles

- Associations communautaires et socioculturelles
- Organisations de jeunesse et de femmes
- Collectifs de quartier et mutuelles
- Fédérations et unions associatives

## 📞 Contact

Développé par **OpenTech221 Impact** pour la digitalisation des associations sénégalaises.

## 📄 Licence

Ce projet est sous licence MIT.
