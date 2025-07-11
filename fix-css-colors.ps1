# Script de correction automatique des couleurs CSS

# Fonction pour corriger un fichier
function Fix-CSSColors {
    param(
        [string]$FilePath
    )
    
    if (Test-Path $FilePath) {
        Write-Host "Correction de $FilePath..."
        
        # Lire le contenu du fichier
        $content = Get-Content $FilePath -Raw
        
        # Remplacer les classes CSS primary- par les équivalents purple-
        $content = $content -replace 'primary-50', 'purple-50'
        $content = $content -replace 'primary-100', 'purple-100'
        $content = $content -replace 'primary-200', 'purple-200'
        $content = $content -replace 'primary-300', 'purple-300'
        $content = $content -replace 'primary-400', 'purple-400'
        $content = $content -replace 'primary-500', 'purple-500'
        $content = $content -replace 'primary-600', 'purple-600'
        $content = $content -replace 'primary-700', 'purple-700'
        $content = $content -replace 'primary-800', 'purple-800'
        $content = $content -replace 'primary-900', 'purple-900'
        
        # Écrire le contenu corrigé
        Set-Content $FilePath -Value $content -NoNewline
        
        Write-Host "✅ $FilePath corrigé"
    } else {
        Write-Host "❌ Fichier non trouvé: $FilePath"
    }
}

# Liste des fichiers à corriger
$files = @(
    "src/pages/LoginPage.tsx",
    "src/pages/RegisterPage.tsx",
    "src/pages/LandingPage.tsx",
    "src/pages/TrainingPage.tsx",
    "src/pages/MembersPage.tsx",
    "src/pages/SettingsPage.tsx",
    "src/pages/TermsPage.tsx",
    "src/pages/HelpPage.tsx",
    "src/pages/DocumentationPage.tsx",
    "src/pages/DemoPage.tsx",
    "src/pages/PrivacyPage.tsx",
    "src/pages/LegalPage.tsx",
    "src/pages/CotisationsPage.tsx",
    "src/pages/EventsPage.tsx",
    "src/pages/FinancesPage.tsx",
    "src/pages/DocumentsPage.tsx",
    "src/pages/MessagesPage.tsx",
    "src/pages/DashboardPage.tsx",
    "src/pages/PublicProfilePage.tsx",
    "src/pages/NotificationsPage.tsx",
    "src/pages/BillingPage.tsx",
    "src/pages/SecurityPage.tsx"
)

Write-Host "🎨 Début de la correction des couleurs CSS..."
Write-Host "Remplacement de toutes les classes 'primary-*' par 'purple-*'"
Write-Host ""

foreach ($file in $files) {
    Fix-CSSColors -FilePath $file
}

Write-Host ""
Write-Host "🎉 Correction terminée !"
Write-Host "Toutes les couleurs CSS ont été mises à jour avec les classes Tailwind standard."
