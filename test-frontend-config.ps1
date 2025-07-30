#!/usr/bin/env powershell
# Test des variables d'environnement Vite

Write-Host "🔍 Test de Configuration Frontend" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan

Write-Host "`n📋 Vérification du fichier .env..."
if (Test-Path ".env") {
    Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
    Write-Host "📄 Contenu:"
    Get-Content ".env" | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
} else {
    Write-Host "❌ Fichier .env non trouvé" -ForegroundColor Red
}

Write-Host "`n🔧 Instructions pour tester:"
Write-Host "1. Arrêter le serveur frontend (Ctrl+C)"
Write-Host "2. Relancer avec: npm run dev"
Write-Host "3. Ouvrir la console du navigateur (F12)"
Write-Host "4. Naviguer vers /finances"
Write-Host "5. Vérifier les logs de debug"

Write-Host "`n🎯 Logs attendus dans la console:"
Write-Host "   🔧 [useFinances] Configuration API: { VITE_BACKEND_URL: 'http://localhost:5000/api', ... }"
Write-Host "   🚀 [useFinances] Requête GET vers: http://localhost:5000/api/finances"
Write-Host "   🚀 [useFinances] Requête POST vers: http://localhost:5000/api/finances"

Write-Host "`n📝 Si les URLs pointent encore vers localhost:5173:"
Write-Host "   ❌ Le .env n'est pas chargé correctement"
Write-Host "   🔧 Redémarrer le serveur frontend est nécessaire"
