# Script PowerShell pour supprimer les anciens boutons de navigation
Write-Host "🧹 Nettoyage des anciens boutons de navigation..." -ForegroundColor Yellow

# Liste des fichiers à nettoyer
$files = @(
    "src\pages\DocumentationPage.tsx",
    "src\pages\ContactPage.tsx", 
    "src\pages\TrainingPage.tsx",
    "src\pages\DemoPage.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "📄 Nettoyage de $file..." -ForegroundColor Cyan
        
        # Lire le contenu du fichier
        $content = Get-Content $file -Raw
        
        # Supprimer les boutons de retour (patterns multiples)
        $patterns = @(
            '(?s)<Link\s+to={ROUTES\.HOME}\s+className="[^"]*"[^>]*>\s*<ArrowLeft[^>]*\/>\s*Retour à l''accueil\s*<\/Link>',
            '(?s)<div[^>]*>\s*<Link\s+to={ROUTES\.HOME}[^>]*>\s*<ArrowLeft[^>]*\/>\s*Retour à l''accueil\s*<\/Link>\s*<\/div>',
            '(?s){\/\* Bouton retour \*\/}[^}]*}',
            '(?s)\/\* Bouton retour \*\/[^<]*<div[^>]*>[^<]*<Link[^}]*}[^<]*<\/div>'
        )
        
        foreach ($pattern in $patterns) {
            $content = $content -replace $pattern, ''
        }
        
        # Nettoyer les imports inutiles
        $content = $content -replace ', ArrowLeft', ''
        $content = $content -replace 'ArrowLeft, ', ''
        $content = $content -replace 'import { Link } from ''react-router-dom'';', ''
        $content = $content -replace 'import { ROUTES } from ''../constants'';', ''
        
        # Nettoyer les lignes vides multiples
        $content = $content -replace '(?m)^\s*\n\s*\n\s*\n', "`n`n"
        
        # Sauvegarder le fichier modifié
        Set-Content $file -Value $content -Encoding UTF8
        
        Write-Host "✅ $file nettoyé avec succès" -ForegroundColor Green
    } else {
        Write-Host "❌ Fichier $file non trouvé" -ForegroundColor Red
    }
}

Write-Host "🎉 Nettoyage terminé ! Tous les anciens boutons de navigation ont été supprimés." -ForegroundColor Green
Write-Host "📋 Les pages utilisent maintenant les layouts avec navigation intégrée." -ForegroundColor Blue
