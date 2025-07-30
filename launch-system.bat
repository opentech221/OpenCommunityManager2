@echo off
echo 🚀 Lancement du système Open Community Manager
echo.

echo 📱 Démarrage du backend Flask...
cd backend
start "Backend Flask" cmd /k "python run.py"

echo.
echo ⏳ Attente de 3 secondes pour que le backend démarre...
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Démarrage du frontend React...
cd ..
start "Frontend React" cmd /k "npm run dev"

echo.
echo ✅ Système démarré !
echo 📍 Frontend: http://localhost:5173
echo 📍 Backend: http://localhost:5000
echo.
echo Appuyez sur une touche pour continuer...
pause >nul
