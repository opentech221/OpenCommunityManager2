#!/bin/bash
# Script de déploiement pour corriger les problèmes CORS

echo "🚀 Déploiement des corrections CORS pour OpenCommunityManager2"

# Vérifier si nous sommes dans un repository git
if [ ! -d ".git" ]; then
    echo "❌ Erreur: Ce n'est pas un repository Git"
    exit 1
fi

# Ajouter tous les fichiers modifiés
echo "📁 Ajout des fichiers modifiés..."
git add .

# Créer un commit avec les corrections
echo "💾 Création du commit..."
git commit -m "fix: Correction des routes CORS pour événements

- Ajout des routes OPTIONS manquantes pour /api/events/<id>/
- Amélioration de la gestion CORS preflight
- Correction des problèmes de mise à jour/suppression d'événements
- Ajout de scripts de test et diagnostic"

# Pousser vers le repository
echo "🔄 Push vers le repository..."
git push origin main || git push origin master

echo "✅ Déploiement terminé!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Vérifier que Railway détecte et déploie automatiquement"
echo "2. Attendre quelques minutes pour le déploiement"
echo "3. Tester à nouveau les fonctionnalités dans l'application"
echo ""
echo "🔗 Liens utiles:"
echo "- Frontend: https://opencommunitymanager2.netlify.app/"
echo "- Backend: https://opencommunitymanager2.up.railway.app/"
echo "- Railway Dashboard: https://railway.app/"
