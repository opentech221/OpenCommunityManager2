#!/usr/bin/env powershell
# Test de l'API Backend avec PowerShell

Write-Host "🔍 Test de l'API Backend Flask" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Cyan

try {
    # Test 1: Santé de l'API
    Write-Host "`n📡 Test 1: Santé de l'API..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/finances" -Method GET -Headers @{"Accept"="application/json"} -TimeoutSec 5
    Write-Host "✅ API répond avec le statut: $($response.StatusCode)" -ForegroundColor Green
    
    # Test 2: Stats financières
    Write-Host "`n📊 Test 2: Statistiques financières..." -ForegroundColor Yellow
    $statsResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/finances/stats" -Method GET -Headers @{"Accept"="application/json"} -TimeoutSec 5
    Write-Host "✅ Stats API répond avec le statut: $($statsResponse.StatusCode)" -ForegroundColor Green
    
    # Test 3: Catégories
    Write-Host "`n📂 Test 3: Catégories..." -ForegroundColor Yellow
    $categoriesResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/finances/categories" -Method GET -Headers @{"Accept"="application/json"} -TimeoutSec 5
    Write-Host "✅ Categories API répond avec le statut: $($categoriesResponse.StatusCode)" -ForegroundColor Green
    
    Write-Host "`n🎉 Backend opérationnel !" -ForegroundColor Green
    Write-Host "✅ L'erreur 404 devrait maintenant être résolue dans le frontend" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ Erreur lors du test: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "🔧 Vérifiez que le serveur backend est bien démarré sur le port 5000" -ForegroundColor Yellow
}
