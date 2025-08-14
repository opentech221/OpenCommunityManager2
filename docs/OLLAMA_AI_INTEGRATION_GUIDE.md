# 🤖 Assistant IA Organisationnel - Guide d'Intégration Ollama

## 🎯 Vue d'ensemble

L'assistant IA d'OpenCommunityManager2 utilise **Ollama** en local pour fournir des conseils personnalisés en gouvernance associative. Cette solution garantit la confidentialité des données et une réponse rapide.

## 🏗️ Architecture

```
Frontend (React)
    ↓
guidanceAPI.queryAI()
    ↓
Backend Flask (/ai/query)
    ↓
OllamaService
    ↓
Ollama Local (llama2)
```

## 🚀 Démarrage Rapide

### 1. **Vérifier Ollama**
```powershell
ollama --version
ollama list
```

### 2. **Installer un Modèle** (si pas déjà fait)
```powershell
ollama pull llama2
# ou pour un modèle plus léger
ollama pull phi
```

### 3. **Démarrer Ollama** (si nécessaire)
```powershell
ollama serve
```

### 4. **Installer les Dépendances Backend**
```powershell
cd backend
pip install -r requirements.txt
```

### 5. **Démarrer l'Application**
```powershell
# Backend
cd backend
python run.py

# Frontend
npm run dev
```

## 🎨 Fonctionnalités de l'Assistant IA

### **Interface Utilisateur**
- 💬 **Chat interactif** avec l'IA
- 🧠 **Réponses contextualisées** selon la page courante
- 💡 **Suggestions d'actions** personnalisées
- 📚 **Ressources liées** recommandées
- ❓ **Questions de suivi** intelligentes
- 📊 **Score de confiance** des réponses

### **Spécialisations**
- 📋 **Diagnostic organisationnel**
- 🎯 **Recommandations stratégiques**
- ⚖️ **Conformité réglementaire**
- 💰 **Gestion financière**
- 🏛️ **Gouvernance associative**
- 📄 **Génération de documents**

## 🔧 Configuration Avancée

### **Personnalisation des Modèles**

1. **Modèles Recommandés**
```powershell
# Modèle général (recommandé)
ollama pull llama2

# Modèle léger et rapide
ollama pull phi

# Modèle pour le code (si nécessaire)
ollama pull codellama
```

2. **Configuration dans OllamaService**
```python
# Modifier dans backend/app/services/ollama_service.py
def generate_response(self, query: str, context: Dict[str, Any], model: str = "llama2"):
    # Changer le modèle par défaut ici
```

### **Optimisation des Prompts**

Le système utilise des prompts contextuels spécialisés :

```python
# Exemple de personnalisation
def get_organizational_prompt(self, context):
    # Personnaliser selon votre association
    base_prompt = f"""Tu es un expert consultant spécialisé dans les {context.get('sector', 'associations')}.
    
EXPERTISE PARTICULIÈRE:
- Associations de type: {context.get('organizationType', 'générale')}
- Secteur: {context.get('sector', 'général')}
- Taille: {context.get('size', 'moyenne')}
...
```

## 📊 Monitoring et Analytics

### **Historique des Requêtes**
Toutes les interactions sont sauvegardées dans la base de données :

```sql
SELECT * FROM ai_queries 
WHERE association_id = 'votre-id'
ORDER BY created_at DESC;
```

### **Métriques de Performance**
- ⏱️ **Temps de réponse moyen**
- 📈 **Score de confiance moyen**
- 🎯 **Types de questions les plus fréquentes**
- 📊 **Satisfaction utilisateur**

## 🛠️ Dépannage

### **Problème : Ollama non accessible**
```powershell
# Vérifier le statut
ollama serve

# Vérifier les processus
Get-Process | Where-Object { $_.ProcessName -like "*ollama*" }

# Redémarrer si nécessaire
Stop-Process -Name "ollama" -Force
ollama serve
```

### **Problème : Modèle non trouvé**
```powershell
# Lister les modèles disponibles
ollama list

# Télécharger le modèle manquant
ollama pull llama2
```

### **Problème : Réponses lentes**
1. **Utiliser un modèle plus léger :**
```powershell
ollama pull phi
```

2. **Optimiser les paramètres :**
```python
"options": {
    "temperature": 0.7,  # Moins créatif = plus rapide
    "max_tokens": 300,   # Réponses plus courtes
    "top_p": 0.8        # Focalisation accrue
}
```

### **Problème : Réponses non pertinentes**
1. **Améliorer le contexte :**
```typescript
// Dans le frontend
const context = {
    currentPage: window.location.pathname,
    userRole: user.role,
    maturityLevel: organization.maturityLevel,
    sector: organization.sector,        // Ajouter
    organizationType: organization.type // Ajouter
};
```

## 🎯 Cas d'Usage Concrets

### **1. Assistant Diagnostic**
```javascript
// Exemple de requête
"Peux-tu m'aider à évaluer la maturité de notre gouvernance ?"

// L'IA analyse le contexte et propose :
// - Questionnaire personnalisé
// - Points d'évaluation prioritaires
// - Actions d'amélioration
```

### **2. Guide Conformité**
```javascript
"Quelles sont nos obligations légales pour cette année ?"

// L'IA fournit :
// - Calendrier des échéances
// - Documents requis
// - Procédures à suivre
```

### **3. Conseiller Financier**
```javascript
"Comment améliorer notre gestion budgétaire ?"

// L'IA recommande :
// - Outils de suivi
// - Ratios financiers clés
// - Stratégies d'optimisation
```

## 🔒 Sécurité et Confidentialité

### **Avantages d'Ollama Local**
- ✅ **Données privées** restent sur votre serveur
- ✅ **Aucune transmission** vers des services externes
- ✅ **Contrôle total** sur les modèles utilisés
- ✅ **Conformité RGPD** garantie

### **Bonnes Pratiques**
- 🔐 Chiffrer la base de données
- 🛡️ Limiter l'accès aux endpoints IA
- 📝 Logger les requêtes pour audit
- 🔄 Sauvegarder régulièrement l'historique

## 📈 Évolutions Futures

### **Version 2.0 Prévue**
- 🎙️ **Interface vocale** pour l'accessibilité
- 📊 **Analyses prédictives** avancées
- 🤖 **Agents IA spécialisés** par domaine
- 🔗 **Intégration** avec outils externes
- 📱 **Application mobile** dédiée

### **Modèles Spécialisés**
- 📚 Modèle spécialisé droit associatif français
- 💼 Modèle gestion organisationnelle
- 📊 Modèle analyse financière

---

## 💡 Conseils d'Utilisation

### **Pour l'Utilisateur Final**
1. **Soyez spécifiques** dans vos questions
2. **Mentionnez le contexte** de votre association
3. **Utilisez les suggestions** proposées par l'IA
4. **Explorez les ressources** recommandées

### **Pour l'Administrateur**
1. **Surveillez les performances** régulièrement
2. **Collectez les retours** utilisateurs
3. **Adaptez les prompts** selon les besoins
4. **Maintenez les modèles** à jour

---

*L'assistant IA d'OpenCommunityManager2 transforme la gestion associative en offrant un guide intelligent, personnalisé et respectueux de la confidentialité.*
