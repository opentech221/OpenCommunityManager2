@echo off
chcp 65001 >nul
echo.
echo ════════════════════════════════════════════════════════════════
echo  🧪 TEST RAPIDE - Vérification Tableaux de Bord
echo ════════════════════════════════════════════════════════════════
echo.

cd /d "c:\Users\toshiba\Downloads\zzz\OpenCommunityManager2"

echo 📊 Vérification des services Docker...
docker-compose ps

echo.
echo 🌐 Test des URLs importantes :
echo.

echo 1️⃣  Grafana Dashboard :
echo    URL: http://localhost:3001
echo    Identifiants: admin / admin
echo.

echo 2️⃣  Prometheus Metrics :
echo    URL: http://localhost:9090
echo    (Pas d'identifiants requis)
echo.

echo 3️⃣  Votre Application :
echo    URL: http://localhost
echo.

echo ⚡ Actions automatiques :
timeout /t 2 /nobreak >nul
echo    - Ouverture de Grafana...
start http://localhost:3001

timeout /t 1 /nobreak >nul
echo    - Ouverture de Prometheus...
start http://localhost:9090

timeout /t 1 /nobreak >nul
echo    - Ouverture de l'Application...
start http://localhost

echo.
echo ════════════════════════════════════════════════════════════════
echo  ✅ TOUT EST CONFIGURÉ !
echo.
echo  📋 Instructions :
echo     1. Connectez-vous à Grafana (admin/admin)
echo     2. Naviguez dans votre app pour générer du trafic
echo     3. Observez les métriques en temps réel !
echo.
echo  📁 Guides disponibles :
echo     - GUIDE-MONITORING-VISUEL.md (guide détaillé)
echo     - DASHBOARD_URLS.md (URLs et accès)
echo ════════════════════════════════════════════════════════════════
echo.
pause
