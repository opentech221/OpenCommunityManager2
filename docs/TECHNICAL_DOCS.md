# Documentation technique - Open Community Manager

## 🏗️ Architecture du projet

### Structure générale

```
OpenCommunityManager2/
├── frontend/                 # Application React TypeScript
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── types/          # Types TypeScript
│   │   ├── utils/          # Utilitaires
│   │   └── constants/      # Constantes
│   ├── public/             # Assets statiques
│   └── dist/               # Build de production
├── backend/                 # API Flask Python
│   ├── app/
│   │   ├── models/         # Modèles de données
│   │   ├── routes/         # Routes API
│   │   └── utils/          # Utilitaires backend
│   ├── migrations/         # Migrations base de données
│   └── uploads/            # Fichiers uploadés
└── docs/                   # Documentation
```

### Technologies utilisées

#### Frontend

- **React 18** : Framework principal
- **TypeScript** : Typage statique
- **Vite** : Build tool et dev server
- **Tailwind CSS** : Framework CSS utilitaire
- **React Router DOM** : Routing
- **Lucide React** : Icônes

#### Backend

- **Flask** : Framework web Python
- **SQLAlchemy** : ORM
- **Flask-Migrate** : Gestion des migrations
- **Flask-CORS** : Gestion CORS
- **SQLite/PostgreSQL** : Base de données

## 🚀 Installation et configuration

### Prérequis

- Node.js 18+ et npm
- Python 3.9+
- Git

### Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/yourusername/OpenCommunityManager2.git
   cd OpenCommunityManager2
   ```

2. **Configuration du frontend**

   ```bash
   npm install
   ```

3. **Configuration du backend**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Base de données**

   ```bash
   # Depuis le dossier backend
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

### Lancement en développement

1. **Backend (Port 5000)**

   ```bash
   cd backend
   python run.py
   ```

2. **Frontend (Port 5173)**

   ```bash
   npm run dev
   ```

3. **Système complet**

   ```bash
   # Windows
   ./launch-full-system.bat
   
   # Ou manuellement
   npm run dev
   ```

## 🏛️ Architecture frontend

### Composants principaux

#### Layouts

- `PublicLayout` : Layout pour les pages publiques
- `AppLayout` : Layout pour les pages authentifiées

#### Composants réutilisables

- `Header` : Barre de navigation authentifiée
- `PublicHeader` : Barre de navigation publique
- `Sidebar` : Menu latéral
- `Footer` : Pied de page
- `MemberForm` : Formulaire de gestion des membres

#### Pages

- **Publiques** : Landing, Login, Register, Legal, etc.
- **Authentifiées** : Dashboard, Members, Events, etc.

### Hooks personnalisés

```typescript
// useAuth.ts - Gestion de l'authentification
const useAuth = () => {
  const login = async (email: string, password: string) => {...}
  const logout = () => {...}
  const register = async (data: RegisterData) => {...}
  return { login, logout, register, isAuthenticated }
}

// useMembers.ts - Gestion des membres
const useMembers = () => {
  const members = useMemo(() => [...], [])
  const addMember = (member: Member) => {...}
  const updateMember = (id: string, data: Partial<Member>) => {...}
  const deleteMember = (id: string) => {...}
  return { members, addMember, updateMember, deleteMember }
}
```

### Gestion d'état

- **Context API** : AuthContext pour l'authentification
- **Hooks locaux** : État local avec useState/useEffect
- **Props drilling** : Évité grâce aux contextes

### Routing

```typescript
// App.tsx - Configuration des routes
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* ... autres routes publiques */}
      </Route>
      
      <Route path="/dashboard" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/events" element={<EventsPage />} />
        {/* ... autres routes authentifiées */}
      </Route>
    </Routes>
  </BrowserRouter>
)
```

## 🔧 Architecture backend

### Modèles de données

#### Association

```python
class Association(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    siret = db.Column(db.String(14), unique=True)
    address = db.Column(db.Text)
    phone = db.Column(db.String(20))
    website = db.Column(db.String(200))
    description = db.Column(db.Text)
    logo_url = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    members = db.relationship('Member', backref='association', lazy=True)
    events = db.relationship('Event', backref='association', lazy=True)
    cotisations = db.relationship('Cotisation', backref='association', lazy=True)
```

#### Member

```python
class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    association_id = db.Column(db.Integer, db.ForeignKey('association.id'), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    birth_date = db.Column(db.Date)
    join_date = db.Column(db.Date, default=date.today)
    role = db.Column(db.String(20), default='member')  # president, treasurer, secretary, member
    status = db.Column(db.String(20), default='active')  # active, inactive, pending
    membership_fee_paid = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

### Routes API

#### Authentification

```python
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    # Logique d'authentification
    return jsonify({'token': token, 'user': user_data})

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    # Logique d'inscription
    return jsonify({'message': 'Association créée avec succès'})
```

#### Gestion des membres

```python
@members_bp.route('/', methods=['GET'])
def get_members():
    # Récupération des membres
    return jsonify(members)

@members_bp.route('/', methods=['POST'])
def create_member():
    # Création d'un membre
    return jsonify(member)

@members_bp.route('/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    # Mise à jour d'un membre
    return jsonify(member)

@members_bp.route('/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    # Suppression d'un membre
    return jsonify({'message': 'Membre supprimé'})
```

### Configuration

```python
# config.py
import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
```

## 🎨 Système de design

### Palette de couleurs

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Couleurs principales OpenTech221
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#6600cc',  // Couleur principale
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3c1361',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#FF6600',  // Couleur secondaire
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      }
    }
  }
}
```

### Typographie

```css
/* index.css */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

:root {
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Poppins', sans-serif;
}

.font-heading {
  font-family: var(--font-heading);
}

.font-body {
  font-family: var(--font-body);
}
```

### Composants UI

#### Boutons

```typescript
// Types de boutons standardisés
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

const buttonClasses = {
  primary: 'bg-purple-600 hover:bg-purple-700 text-white',
  secondary: 'bg-orange-600 hover:bg-orange-700 text-white',
  outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
  ghost: 'text-purple-600 hover:bg-purple-50',
  danger: 'bg-red-600 hover:bg-red-700 text-white'
}
```

#### Formulaires

```typescript
// Classes standardisées pour les formulaires
const inputClasses = `
  w-full px-4 py-3 border border-gray-300 rounded-lg 
  focus:ring-2 focus:ring-purple-500 focus:border-purple-500
  placeholder:text-gray-400
`

const labelClasses = `
  block text-sm font-medium text-gray-700 mb-2
`
```

## 📱 Responsivité

### Breakpoints Tailwind

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large
    }
  }
}
```

### Stratégie Mobile-First

```typescript
// Exemple d'implémentation responsive
const ResponsiveComponent = () => (
  <div className="
    grid grid-cols-1 gap-4
    md:grid-cols-2 md:gap-6
    lg:grid-cols-3 lg:gap-8
    xl:grid-cols-4
  ">
    {/* Contenu adaptatif */}
  </div>
)
```

## 🔒 Sécurité

### Authentification

```python
# JWT Token management
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

@auth_bp.route('/login', methods=['POST'])
def login():
    # Validation des credentials
    if validate_credentials(email, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)
    return jsonify({'message': 'Invalid credentials'}), 401

@members_bp.route('/', methods=['GET'])
@jwt_required()
def get_members():
    current_user_id = get_jwt_identity()
    # Vérification des permissions
    return jsonify(members)
```

### Validation des données

```python
# Validation côté backend
from marshmallow import Schema, fields, validate

class MemberSchema(Schema):
    first_name = fields.Str(required=True, validate=validate.Length(min=2, max=50))
    last_name = fields.Str(required=True, validate=validate.Length(min=2, max=50))
    email = fields.Email(required=True)
    phone = fields.Str(validate=validate.Regexp(r'^[+]?[\d\s\-\(\)]{8,20}$'))
    role = fields.Str(validate=validate.OneOf(['president', 'treasurer', 'secretary', 'member']))
```

### CORS Configuration

```python
# Configuration CORS
from flask_cors import CORS

CORS(app, origins=['http://localhost:5173', 'https://yourdomain.com'])
```

## 📊 Performance

### Optimisations frontend

```typescript
// Lazy loading des composants
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const MembersPage = lazy(() => import('./pages/MembersPage'))

// Memoization pour éviter les re-renders
const MembersList = memo(({ members, onEdit, onDelete }) => {
  return (
    <div>
      {members.map(member => (
        <MemberCard key={member.id} member={member} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
})
```

### Optimisations backend

```python
# Pagination des résultats
@members_bp.route('/', methods=['GET'])
def get_members():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    members = Member.query.paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    return jsonify({
        'members': [member.to_dict() for member in members.items],
        'total': members.total,
        'pages': members.pages,
        'current_page': page
    })
```

## 🧪 Tests

### Tests frontend (Jest + React Testing Library)

```typescript
// __tests__/components/MemberForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemberForm } from '../components/MemberForm'

describe('MemberForm', () => {
  test('renders form fields', () => {
    render(<MemberForm onSubmit={jest.fn()} />)
    
    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  test('submits form with valid data', () => {
    const mockSubmit = jest.fn()
    render(<MemberForm onSubmit={mockSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/prénom/i), {
      target: { value: 'Jean' }
    })
    fireEvent.change(screen.getByLabelText(/nom/i), {
      target: { value: 'Dupont' }
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'jean.dupont@example.com' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /ajouter/i }))
    
    expect(mockSubmit).toHaveBeenCalledWith({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@example.com'
    })
  })
})
```

### Tests backend (pytest)

```python
# tests/test_members.py
import pytest
from app import create_app, db
from app.models import Member, Association

@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_create_member(client):
    # Créer une association de test
    association = Association(name='Test Association', email='test@example.com')
    db.session.add(association)
    db.session.commit()
    
    # Test création membre
    response = client.post('/api/members/', json={
        'first_name': 'Jean',
        'last_name': 'Dupont',
        'email': 'jean.dupont@example.com',
        'association_id': association.id
    })
    
    assert response.status_code == 201
    assert 'Jean' in response.get_json()['first_name']
```

## 🚀 Déploiement

### Frontend (Vercel/Netlify)

```bash
# Build de production
npm run build

# Variables d'environnement
VITE_API_URL=https://api.yourdomain.com
VITE_APP_NAME=Open Community Manager
```

### Backend (Heroku/Railway)

```python
# Procfile
web: gunicorn run:app

# requirements.txt
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-Migrate==4.0.5
Flask-CORS==4.0.0
Flask-JWT-Extended==4.5.2
gunicorn==21.2.0
psycopg2-binary==2.9.7
```

### Base de données (PostgreSQL)

```python
# Migration vers PostgreSQL
# config.py
import os

class ProductionConfig:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    # Autres configurations production
```

## 🔍 Monitoring et logs

### Logs backend

```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
```

### Monitoring frontend

```typescript
// Sentry pour le monitoring d'erreurs
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})

// Analytics
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <BrowserRouter>
        {/* App content */}
      </BrowserRouter>
      <Analytics />
    </>
  )
}
```

## 📝 Contribution

### Standards de code

```json
// .eslintrc.js
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

### Workflow Git

```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Commits conventionnels
git commit -m "feat: ajout de la gestion des événements"
git commit -m "fix: correction du formulaire de connexion"
git commit -m "docs: mise à jour de la documentation"

# Push et Pull Request
git push origin feature/nouvelle-fonctionnalite
```

---

**Open Community Manager** - Documentation technique
Version 1.0 | Dernière mise à jour : Décembre 2024
