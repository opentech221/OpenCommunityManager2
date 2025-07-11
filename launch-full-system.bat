@echo off
echo ====================================================
echo  OPEN COMMUNITY MANAGER - LANCEMENT COMPLET
echo ====================================================
echo.

echo [1/3] Verification des dependances...
cd /d "%~dp0"

if not exist "node_modules" (
    echo Installation des dependances Frontend...
    call npm install
)

if not exist "backend\venv" (
    echo Erreur: L'environnement virtuel Python n'est pas installe.
    echo Veuillez suivre les instructions dans backend-flask-setup.md
    pause
    exit /b 1
)
echo.

echo [2/3] Demarrage du backend Flask...
cd backend
call venv\Scripts\activate
start /B python run.py
echo Backend demarre sur http://localhost:5000
echo.

echo [3/3] Demarrage du frontend React...
cd ..
start /B npm run dev
echo Frontend demarre sur http://localhost:5173
echo.

echo ====================================================
echo  SYSTEME OPERATIONNEL !
echo ====================================================
echo.
echo Frontend : http://localhost:5173
echo Backend  : http://localhost:5000
echo Sante API: http://localhost:5000/api/health
echo.
echo Appuyez sur une touche pour continuer...
pause > nul
