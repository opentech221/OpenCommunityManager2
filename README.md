# Open Community Manager

Open Community Manager est le cœur de l'écosystème numérique Opentech221 : une API centralisée et mutualisée qui propulse la digitalisation des organisations communautaires(gestion administrative, 
financière et opérationnelle.). Elle permet à chaque association ou fédération de bénéficier d'un site web personnalisé (vitrine, portail membres, etc.) dont toutes les fonctionnalités (adhésion, gestion documentaire, finances, communication...) sont directement connectées à l'API opencommunitymanager. Ce modèle garantit une gestion moderne, sécurisée et évolutive, tout en mutualisant les ressources et en facilitant l'accès à des services numériques adaptés aux besoins de chaque organisation.

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

- `npm run lint` : Vérification du code avec ESLint
- `npm run preview` : Prévisualisation du build
- `python run.py` : Lance le backend Flask (http://localhost:5000)

### Accès à l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:5000/api
---
## 📡 Endpoints publics de l’API backend
L’API Flask expose plusieurs routes publiques pour l’intégration, la supervision et la documentation :

| Endpoint             | Description                                      |
| `/`                  | Message d’accueil API contextualisé             |
| `/api/ping`          | Test de vie (pong)                              |
| `/api/health`        | Statut de santé de l’API                        |
| `/api/features`      | Liste des fonctionnalités principales           |
| `/api/docs`          | Liens vers la documentation et le guide         |
| `/api/time`          | Heure serveur                                   |
| `/api/author`        | Auteur et contact                               |
| `/api/status`        | Statut, environnement, debug, DB                |
| `/api/config`        | Infos config API (uploads, CORS, JWT…)          |
| `/api/endpoints`     | Liste des endpoints publics                     |
| `/api/uptime`        | Uptime (statique)                               |
| `/api/license`       | Licence du projet                               |
| `/api/stack`         | Stack technique (backend, frontend, cloud)      |
| `/api/links`         | Liens utiles (frontend, backend, docs, GitHub)  |
Ces routes facilitent l’intégration, le monitoring, la démo et la documentation de l’API.

Pour le déploiement, suivez les instructions dans `docs/DEPLOYMENT.md` (Netlify pour le frontend, Render/Railway/Heroku pour le backend).

## 📱 Responsive Design

L'application est conçue avec une approche **mobile-first** :
- **Smartphone** : Interface optimisée pour les associations de quartier
- **Desktop** : Version étendue pour fédérations et municipalités
- **Tablette** : Adaptation fluide entre les deux formats

## 🏗️ Architecture du projet

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
├── .github/workflows/ # CI/CD GitHub Actions
├── .env               # Variables d'environnement
└── README.md

## 🌐 Architecture de l'écosystème numérique Opentech221

L'écosystème numérique Opentech221 repose sur une architecture centralisée et mutualisée :

- **Backend unique** : L'API `opencommunitymanager` sert de socle technique et de serveur principal pour tous les sites web clients (vitrines) que nous créons pour les organisations clientes.
- **Multi-frontends** : Chaque site client dispose de ses propres fonctionnalités (adhésion, inscription/connexion, accès aux documents et données financières, etc.), toutes directement connectées à l'API `opencommunitymanager` pour récupérer et afficher dynamiquement les données de l'organisation concernée.
- **Connexion directe** : Les modules d'adhésion, d'accès sécurisé, de gestion documentaire ou financière de chaque site sont synchronisés en temps réel avec l'API, garantissant une expérience fluide et centralisée.
- **Scalabilité** : Cette approche permet de gérer plusieurs sites (frontends) pour différentes organisations, tout en maintenant un seul backend robuste, sécurisé et évolutif.
- **Offre globale** : Au-delà de la plateforme logicielle, nous accompagnons nos organisations clientes avec une gamme de produits (création de supports, impression numérique, communication digitale, gestion de réseaux) et de services (aide à la formalisation, formation aux outils et compétences numériques, accompagnement à l'accès aux financements) adaptés à leurs besoins spécifiques.

Cette architecture favorise la mutualisation des ressources, la rapidité de déploiement, la sécurité des données et l'accès à des services numériques de pointe pour toutes les organisations accompagnées par Opentech221.

## 🎯 Objectifs UX

- **Simplicité** : Interface intuitive pour utilisateurs non-techniques
- **Efficacité** : Workflow optimisé pour la gestion quotidienne
- **Accessibilité** : Conforme aux standards d'accessibilité web
- **Performance** : Chargement rapide et navigation fluide

## 📋 Roadmap


- [x] Structure du projet et design system
- [x] Intégration CI/CD Netlify + GitHub
- [x] Page d'accueil et authentification
- [x] Sidebar, header, footer, navigation
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


## 📈 Stratégie d'évolution et segmentation ciblée

Afin de viser une clientèle à **fort pouvoir d'achat** et de structurer une montée en gamme progressive de nos offres, nous adoptons la stratégie suivante :

### 🔹 Phase de Lancement – Créer une communauté restreinte de forte valeur

* Identifier et engager des profils **modèles de succès, de valeur, de crédibilité et d’influence** au sein de notre cible.
* Établir avec eux un **partenariat gagnant-gagnant** dès le départ : ils bénéficient de nos services et nous tirons parti de leur **réseau, notoriété et capital confiance**.
* Objectif : amorcer un **effet de levier** et de **transfert de potentiel** pour attirer de nouveaux utilisateurs en confiance.

---

### 🔹 Phase 1 – Prestations de service sur mesure

> Construire notre expertise terrain

* Fournir des services personnalisés à haute valeur ajoutée pour affiner nos compétences, comprendre les attentes du marché premium et maîtriser les problématiques réelles du terrain.

### 🔹 Phase 2 – Coaching ciblé

> Valoriser l’expertise acquise

* Proposer un **accompagnement individuel ou en petits groupes** basé sur notre retour d’expérience.
* Viser les débutants et profils en reconversion cherchant à accéder à un haut niveau de compétence.

### 🔹 Phase 3 – Formations structurées

> Industrialiser le savoir-faire

* Créer des **parcours de formation complets** (autonomes ou accompagnés), capitalisant à la fois sur notre **expérience pratique** (prestations) et sur notre **maturité pédagogique** (coaching).

---

## 🧩 Fonctionnalités futures à intégrer dans la plateforme

* **📰 Page Blog**
  Proposer des articles réguliers sur les thématiques clés de notre secteur d’intervention afin de renforcer notre position d’expert, booster notre SEO et entretenir l’engagement de la communauté.

* **📊 Page Open Data**
  Rendre accessibles certaines données issues des associations (anonymisées) pour un usage **académique, institutionnel ou sectoriel** : ONG, cabinets d’étude, chercheurs, étudiants, etc.
  *Avantages : marketing d’influence, crédibilité scientifique, visibilité institutionnelle.*

## 👥 Cibles

- Associations communautaires et socioculturelles
- Organisations de jeunesse et de femmes
- Collectifs de quartier et mutuelles
- Fédérations et unions associatives

## 📞 Contact

Développé par **OpenTech221 Impact** pour la digitalisation des associations sénégalaises.

## 📄 Licence

Ce projet est sous licence MIT.
