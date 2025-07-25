# Script de déploiement PowerShell pour corriger les problèmes CORS
Write-Host "🚀 Déploiement des corrections CORS pour OpenCommunityManager2" -ForegroundColor Green

# Vérifier si nous sommes dans un repository git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erreur: Ce n'est pas un repository Git" -ForegroundColor Red
    exit 1
}

# Ajouter tous les fichiers modifiés
Write-Host "📁 Ajout des fichiers modifiés..." -ForegroundColor Yellow
git add .

# Créer un commit avec les corrections
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
git commit -m "fix: Correction des routes CORS pour événements

- Ajout des routes OPTIONS manquantes pour /api/events/<id>/
- Amélioration de la gestion CORS preflight
- Correction des problèmes de mise à jour/suppression d'événements
- Ajout de scripts de test et diagnostic"

# Pousser vers le repository
Write-Host "🔄 Push vers le repository..." -ForegroundColor Yellow
try {
    git push origin main
} catch {
    git push origin master
}

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Vérifier que Railway détecte et déploie automatiquement"
Write-Host "2. Attendre quelques minutes pour le déploiement"
Write-Host "3. Tester à nouveau les fonctionnalités dans l'application"
Write-Host ""
Write-Host "🔗 Liens utiles:" -ForegroundColor Cyan
Write-Host "- Frontend: https://opencommunitymanager2.netlify.app/"
Write-Host "- Backend: https://opencommunitymanager2.up.railway.app/"
Write-Host "- Railway Dashboard: https://railway.app/"

Write-Host ""
Write-Host "🧪 Pour tester après déploiement, exécuter:" -ForegroundColor Yellow
Write-Host "C:/Users/toshiba/Downloads/OpenCommunityManager2/backend/venv/Scripts/python.exe test_cors_production.py"
