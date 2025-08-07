# Guide d'utilisation - Système de messagerie WhatsApp

## 🎯 Présentation

Le système de messagerie d'Open Community Manager s'inspire de WhatsApp pour offrir une expérience moderne et intuitive de communication interne aux associations.

## 📱 Interface responsive

### Mode mobile
- **Liste des conversations** : Vue principale avec recherche et filtres
- **Conversation active** : Écran plein avec bouton retour
- **Navigation** : Basculement fluide entre liste et chat

### Mode desktop  
- **Vue split-panel** : Liste à gauche, conversation à droite
- **Écran de bienvenue** : Affiché quand aucune conversation n'est sélectionnée
- **Statistiques** : Compteurs de conversations et membres actifs

## 💬 Fonctionnalités principales

### 🗨️ ChatList (Liste des conversations)
- **Recherche** : Filtre en temps réel par nom ou message
- **Badges non lus** : Compteur visible des nouveaux messages
- **Statut en ligne** : Indicateur de présence des membres
- **Avatars colorés** : Identité visuelle basée sur les initiales
- **Tri automatique** : Messages récents en premier
- **État vide** : Message d'accueil pour nouvelles installations

### 💭 ChatConversation (Interface de chat)
- **Bulles de messages** : Style WhatsApp avec couleurs distinctes
  - Messages envoyés : Fond vert (droite)
  - Messages reçus : Fond gris (gauche)
- **Horodatage** : Timestamps formatés en français
- **Accusés de lecture** : Icônes Check/CheckCheck
- **Séparateurs de date** : Organisation chronologique claire
- **Auto-scroll** : Défilement automatique vers nouveaux messages
- **Saisie responsive** : Zone d'input avec boutons d'action

## 🛠️ Composants utilitaires disponibles

### 📊 MessageStatus
- **États supportés** : sending, sent, delivered, read
- **Icônes visuelles** : Clock, Check, CheckCheck
- **Codes couleur** : Gris → Bleu → Vert selon statut

### ⌨️ TypingIndicator  
- **Animation fluide** : Points qui clignotent
- **Support multi-utilisateurs** : "Alice et Bob tapent..."
- **Intégration seamless** : Apparition/disparition naturelle

### 🟢 OnlineStatus
- **Indicateurs présence** : En ligne, Absent, Hors ligne
- **Dernière connexion** : "Vu il y a 5 minutes"
- **Codes couleur** : Vert, Orange, Gris

### 😀 EmojiPicker
- **Palette complète** : Emojis organisés par catégories
- **Recherche rapide** : Sélection intuitive
- **Interface popup** : S'ouvre au-dessus du clavier

### 📎 FileAttachment
- **Glisser-déposer** : Upload par drag & drop
- **Types supportés** : Images, vidéos, audio, documents
- **Aperçu média** : Prévisualisation intégrée
- **Validation** : Contrôle taille et format
- **Barre de progression** : Feedback upload en temps réel

### 🔍 MessageSearch
- **Recherche textuelle** : Dans tous les messages
- **Filtres avancés** : Par date et expéditeur
- **Navigation résultats** : Défilement dans les matches
- **Surlignage** : Mise en évidence des termes trouvés
- **Interface overlay** : Au-dessus de la conversation

## 🎨 Design system

### Couleurs principales
- **Orange** : #FF6600 (boutons, accents, messages envoyés en mode alternatif)
- **Vert** : Messages envoyés, statuts positifs
- **Gris** : Messages reçus, éléments neutres
- **Violet** : #6600cc (identité OpenTech221)

### Typographie
- **Montserrat** : Titres et éléments importants
- **Poppins** : Corps de texte et messages
- **Tailles responsive** : Adaptation mobile/desktop

### Espacements
- **Padding messages** : 12px horizontal, 8px vertical
- **Margin bulles** : 8px entre messages
- **Border radius** : 16px pour bulles, 8px éléments UI

## 🔄 États et interactions

### Messages
1. **Envoi** : Bulle grise avec icône horloge
2. **Transmis** : Bulle colorée avec Check simple
3. **Livré** : Bulle colorée avec CheckCheck gris
4. **Lu** : Bulle colorée avec CheckCheck bleu

### Conversations
1. **Non lue** : Badge rouge avec compteur
2. **Active** : Highlight orange/violet
3. **Archivée** : Grisée avec icône spéciale
4. **Tapant** : Indicateur animé sous le nom

## 📱 Responsive breakpoints

### Mobile (< 768px)
- Navigation par écrans pleins
- Boutons tactiles optimisés
- Clavier virtuel friendly
- Swipe gestures (futur)

### Tablet (768px - 1024px)
- Adaptation du split-panel
- Tailles intermédiaires
- Touch + souris supportés

### Desktop (> 1024px)
- Deux panneaux fixes
- Raccourcis clavier (futur)
- Hover states complets

## 🚀 Performance

### Optimisations
- **Virtualisation** : Liste longue de conversations
- **Lazy loading** : Chargement messages anciens
- **Debounce** : Recherche et frappe
- **Memoization** : Composants statiques

### Mise en cache
- **LocalStorage** : Conversations récentes
- **SessionStorage** : État temporaire
- **Service Worker** : Cache hors ligne (futur)

## 🔐 Sécurité et confidentialité

### Données sensibles
- **Chiffrement** : Messages en transit (HTTPS)
- **Suppression** : Historique configurable
- **Backup** : Sauvegarde périodique
- **RGPD** : Contrôle données personnelles

## 🎯 Roadmap fonctionnalités

### Phase 1 (Actuelle) ✅
- Interface WhatsApp-style
- Messages texte
- Statuts de lecture
- Recherche basique
- Responsive design

### Phase 2 (Prochaine) 🔄
- Partage fichiers/médias
- Réactions emojis
- Messages vocaux
- Notifications push

### Phase 3 (Future) 📋
- Appels audio/vidéo
- Messages temporaires
- Groupes et canaux
- Intégration calendrier

## 🛟 Support et dépannage

### Problèmes courants
1. **Messages non affichés** : Vérifier connexion réseau
2. **Recherche lente** : Réduire historique ou optimiser
3. **Upload échoué** : Contrôler taille/format fichier
4. **Interface décalée** : Rafraîchir ou vider cache

### Logs et debug
- Console navigateur : Erreurs JavaScript
- Network tab : Problèmes API
- LocalStorage : État persistant
- Service logs : Côté serveur

---

*Guide créé pour Open Community Manager v2.0 - Système de messagerie WhatsApp*
