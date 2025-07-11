# Copilot Instructions pour Open Community Manager

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## 📋 Contexte du projet

Open Community Manager est une application web de gestion d'associations qui permet aux organisations communautaires de digitaliser leur gestion administrative, financière et opérationnelle.

## 🎯 Technologies utilisées

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS avec palette personnalisée (violet #6600cc, orange #FF6600)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Typographie**: Montserrat (titres) + Poppins (corps)

## 📱 Principes de design

- **Mobile-first**: Priorité aux smartphones pour les associations de quartier
- **Responsive**: Version desktop pour fédérations et municipalités
- **Accessible**: Interface simple et intuitive
- **Moderne**: UI clean avec couleurs OpenTech221

## 🏗️ Architecture des modules

### Modules principaux à implémenter :
1. **Authentification** - Inscription/Connexion associations
2. **Dashboard** - Vue d'ensemble avec KPI
3. **Gestion membres** - CRUD avec rôles (Président, Trésorier, etc.)
4. **Cotisations** - Suivi paiements et génération rapports
5. **Événements** - Planification et gestion inscriptions
6. **Finances** - Entrées/sorties et bilans
7. **Documents** - Upload/archivage sécurisé
8. **Messagerie** - Communication interne
9. **Profil public** - Vitrine association

## 🎨 Conventions de code

- Composants en PascalCase
- Hooks personnalisés avec préfixe "use"
- Types TypeScript avec suffixe "Type" ou "Interface"
- Constantes en UPPER_SNAKE_CASE
- CSS classes avec convention Tailwind

## 📋 Structure suggérée

```
src/
├── components/          # Composants réutilisables
├── pages/              # Pages principales
├── hooks/              # Hooks personnalisés  
├── types/              # Définitions TypeScript
├── utils/              # Fonctions utilitaires
├── constants/          # Constantes
└── styles/             # Styles globaux
```

## 🚀 Objectifs UX

- Interface intuitive pour utilisateurs non-techniques
- Workflow optimisé pour gestion quotidienne associations
- Expérience cohérente mobile/desktop
- Performance et accessibilité prioritaires
