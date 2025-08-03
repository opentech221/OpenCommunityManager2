@echo off
echo 🚀 Demarrage d'Open Community Manager avec Monitoring
echo ================================================

echo.
echo 📋 Verification des prerequis...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker n'est pas installe ou non demarré
    echo    Installez Docker Desktop et demarrez-le
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose n'est pas installe
    pause
    exit /b 1
)

echo ✅ Docker et Docker Compose detectes

echo.
echo 🏗️ Construction et demarrage des services...
docker-compose up -d --build

echo.
echo ⏱️ Attente du demarrage des services (30 secondes)...
timeout /t 30 /nobreak >nul

echo.
echo 🔍 Verification du statut des services...
docker-compose ps

echo.
echo 🎉 SERVICES DEMARRES AVEC SUCCES !
echo ================================
echo.
echo 📊 ACCES AUX TABLEAUX DE BORD :
echo ├── 🎯 Application principale : http://localhost
echo ├── 📊 Grafana (Dashboards)   : http://localhost:3001
echo ├── 🔍 Prometheus (Metrics)  : http://localhost:9090
echo ├── 🐍 API Backend           : http://localhost:5000
echo └── 📈 Statut services       : docker-compose ps
echo.
echo 🔑 IDENTIFIANTS GRAFANA :
echo ├── Username : admin
echo └── Password : admin (a changer lors de la premiere connexion)
echo.
echo 💡 CONSEILS :
echo ├── Naviguez sur http://localhost pour generer du trafic
echo ├── Surveillez les metriques en temps reel sur Grafana
echo └── Utilisez 'docker-compose logs -f' pour voir les logs
echo.
echo 🛑 Pour arreter tous les services : docker-compose down
echo.
pause
