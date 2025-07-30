# Script pour redémarrer les serveurs de développement
Write-Host "Redémarrage des serveurs de développement..." -ForegroundColor Green

# Démarrer le backend dans un nouveau terminal
Write-Host "Démarrage du backend Flask..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python run.py"

# Attendre un moment pour que le backend démarre
Start-Sleep -Seconds 3

# Démarrer le frontend dans un nouveau terminal
Write-Host "Démarrage du frontend Vite..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host "Les deux serveurs sont en cours de démarrage..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
