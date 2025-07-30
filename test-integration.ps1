# Script de test pour vérifier l'intégration frontend/backend
Write-Host "=== TEST DE L'INTÉGRATION FRONTEND/BACKEND ===" -ForegroundColor Magenta

# Fonction pour attendre qu'un port soit actif
function Wait-ForPort {
    param([int]$Port, [string]$Service)
    
    Write-Host "Attente du démarrage de $Service sur le port $Port..." -ForegroundColor Yellow
    $timeout = 30  # 30 secondes
    $elapsed = 0
    
    do {
        try {
            $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
            if ($connection.TcpTestSucceeded) {
                Write-Host "✅ $Service est prêt sur le port $Port" -ForegroundColor Green
                return $true
            }
        } catch {
            # Ignorer les erreurs et continuer
        }
        Start-Sleep -Seconds 1
        $elapsed++
    } while ($elapsed -lt $timeout)
    
    Write-Host "❌ Timeout: $Service n'a pas démarré dans les $timeout secondes" -ForegroundColor Red
    return $false
}

# Tester le backend
Write-Host "1. Test du backend Flask..." -ForegroundColor Cyan
if (Wait-ForPort -Port 5000 -Service "Backend Flask") {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/finances" -Method GET -TimeoutSec 10
        Write-Host "✅ Backend accessible - Réponse reçue avec $($response.Count) transactions" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de l'accès au backend: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Backend non accessible" -ForegroundColor Red
}

# Tester le frontend
Write-Host "`n2. Test du frontend Vite..." -ForegroundColor Cyan
if (Wait-ForPort -Port 5173 -Service "Frontend Vite") {
    Write-Host "✅ Frontend accessible sur http://localhost:5173" -ForegroundColor Green
    Write-Host "📋 Ouvrez votre navigateur et allez à: http://localhost:5173/finances" -ForegroundColor Yellow
} else {
    Write-Host "❌ Frontend non accessible" -ForegroundColor Red
}

# Instructions pour l'utilisateur
Write-Host "`n=== INSTRUCTIONS ===" -ForegroundColor Magenta
Write-Host "1. Assurez-vous que les deux serveurs sont démarrés" -ForegroundColor White
Write-Host "2. Ouvrez votre navigateur à: http://localhost:5173/finances" -ForegroundColor White
Write-Host "3. Testez l'ajout d'une transaction pour vérifier l'intégration" -ForegroundColor White
Write-Host "4. Vérifiez les logs de debug dans la console du navigateur (F12)" -ForegroundColor White

Write-Host "`n=== VARIABLES D'ENVIRONNEMENT ===" -ForegroundColor Magenta
if (Test-Path ".env") {
    Write-Host "✅ Fichier .env trouvé:" -ForegroundColor Green
    Get-Content ".env" | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Fichier .env non trouvé" -ForegroundColor Red
}

Write-Host "`nTest terminé!" -ForegroundColor Green
