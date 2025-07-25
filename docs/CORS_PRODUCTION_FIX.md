# Guide de résolution - Problème CORS événements en production

## 🚨 Problème identifié

La suppression et modification d'événements échoue en production avec l'erreur :
```
Request URL: https://opencommunitymanager2.up.railway.app/api/events/5/
Request Method: OPTIONS  
Status Code: 404 Not Found
Error: "Endpoint non trouvé"
```

## 🔍 Diagnostic

Le test automatisé révèle que :
- ✅ `OPTIONS /api/events/` fonctionne (collection)
- ❌ `OPTIONS /api/events/<id>/` échoue (ressource spécifique)
- ✅ `GET /api/events/` fonctionne
- ❌ `DELETE /api/events/<id>/` échoue

## 🎯 Cause racine

Le backend déployé sur Railway ne contient pas les routes OPTIONS pour les opérations sur les événements spécifiques. Les corrections ont été appliquées localement mais pas déployées.

## ✅ Corrections appliquées

### 1. Routes OPTIONS ajoutées dans `backend/app/routes/events.py`

```python
# Route OPTIONS pour la collection d'événements
@events_bp.route('/', methods=['OPTIONS'])
def handle_preflight_collection():
    """Handle CORS preflight requests for events collection"""
    response = jsonify({
        'message': 'CORS preflight OK for events collection',
        'allowed_methods': ['GET', 'POST', 'OPTIONS'],
        'status': 'success'
    })
    return response, 200

# Route OPTIONS pour les opérations sur un événement spécifique
@events_bp.route('/<int:event_id>/', methods=['OPTIONS'])
@events_bp.route('/<int:event_id>', methods=['OPTIONS'])
def handle_preflight(event_id):
    """Handle CORS preflight requests explicitly for event operations"""
    try:
        response = jsonify({
            'message': 'CORS preflight OK for event operations', 
            'event_id': event_id,
            'allowed_methods': ['GET', 'PUT', 'DELETE', 'OPTIONS'],
            'status': 'success'
        })
        return response, 200
    except Exception as e:
        error_response = {
            'error': f'CORS preflight error: {str(e)}',
            'event_id': event_id,
            'status': 'error'
        }
        return jsonify(error_response), 200
```

### 2. Améliorations frontend

- Confirmation avant suppression
- Meilleure gestion des erreurs
- Conversion correcte des données pour l'API

## 🚀 Déploiement requis

Pour appliquer ces corrections en production :

### Option 1: Script automatique
```bash
# Bash (Linux/Mac)
./deploy_cors_fixes.sh

# PowerShell (Windows)
.\deploy_cors_fixes.ps1
```

### Option 2: Commandes manuelles
```bash
git add .
git commit -m "fix: Correction des routes CORS pour événements"
git push origin main  # ou master selon votre branche par défaut
```

## 🧪 Validation post-déploiement

Après le déploiement, exécuter le test :
```bash
python test_cors_production.py
```

Le résultat attendu :
```
🎯 Résultat: 5/5 tests réussis
```

## 🔗 Vérification manuelle

1. Aller sur https://opencommunitymanager2.netlify.app/
2. Se connecter à l'application
3. Aller dans la section "Événements"
4. Essayer de modifier un événement existant
5. Essayer de supprimer un événement (avec confirmation)

## ⏱️ Temps estimé

- Déploiement : 2-5 minutes sur Railway
- Propagation : 1-2 minutes
- Test : 1 minute

Total : ~5-10 minutes

## 🔧 Monitoring

Après déploiement, surveiller :
- Logs Railway pour erreurs de déploiement
- Console navigateur pour erreurs CORS
- Comportement de l'application en production

## 📋 Checklist de validation

- [ ] Routes OPTIONS ajoutées dans le code
- [ ] Code commité et pushé
- [ ] Railway a détecté et déployé les changements
- [ ] Test automatisé passe (5/5)
- [ ] Test manuel de modification d'événement réussi
- [ ] Test manuel de suppression d'événement réussi
- [ ] Aucune erreur CORS dans la console

## 💡 Prévention future

1. **Tests systématiques** : Toujours tester en production après déploiement
2. **CI/CD** : Mettre en place des tests automatiques CORS
3. **Documentation** : Maintenir à jour la liste des routes OPTIONS requises
4. **Monitoring** : Alertes sur erreurs CORS en production
