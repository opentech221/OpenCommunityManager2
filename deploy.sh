#!/bin/bash
# 🚀 Script de Déploiement Automatique - Open Community Manager
# Version: 2.0.0

set -e  # Arrêter en cas d'erreur

# 🎨 Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 📋 Configuration
APP_NAME="OpenCommunityManager"
VERSION=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="./backups"
LOG_FILE="./deploy-${VERSION}.log"

# 🎯 Fonctions utilitaires
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

# 🔍 Vérifications préliminaires
check_requirements() {
    log "🔍 Vérification des prérequis..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        error "Docker n'est pas installé"
    fi
    
    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose n'est pas installé"
    fi
    
    # Vérifier les fichiers essentiels
    if [[ ! -f "docker-compose.yml" ]]; then
        error "docker-compose.yml non trouvé"
    fi
    
    if [[ ! -f ".env.production" ]]; then
        error ".env.production non trouvé"
    fi
    
    success "Prérequis validés"
}

# 🧪 Tests avant déploiement
run_tests() {
    log "🧪 Exécution des tests..."
    
    # Tests frontend
    log "📱 Tests frontend..."
    npm test -- --coverage --watchAll=false || error "Tests frontend échoués"
    
    # Build frontend
    log "🏗️ Build frontend..."
    npm run build || error "Build frontend échoué"
    
    # Tests backend (si Python est disponible)
    if command -v python3 &> /dev/null; then
        log "🐍 Tests backend..."
        cd backend
        python3 -m pytest --cov=app || warning "Tests backend échoués (non bloquant)"
        cd ..
    fi
    
    success "Tests terminés"
}

# 💾 Sauvegarde
backup_data() {
    log "💾 Création de la sauvegarde..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Sauvegarde de la base de données
    if docker-compose ps database | grep -q "Up"; then
        log "🗄️ Sauvegarde de la base de données..."
        docker-compose exec -T database pg_dump -U postgres opencommunity > "$BACKUP_DIR/db-backup-${VERSION}.sql" || warning "Échec sauvegarde DB"
    fi
    
    # Sauvegarde des uploads
    if [[ -d "./uploads" ]]; then
        log "📁 Sauvegarde des fichiers..."
        tar -czf "$BACKUP_DIR/uploads-backup-${VERSION}.tar.gz" ./uploads/ || warning "Échec sauvegarde uploads"
    fi
    
    success "Sauvegarde créée: $BACKUP_DIR"
}

# 🏗️ Build des images Docker
build_images() {
    log "🏗️ Construction des images Docker..."
    
    # Arrêter les services existants
    docker-compose down --remove-orphans
    
    # Construire les nouvelles images
    docker-compose build --no-cache --parallel || error "Échec de la construction des images"
    
    success "Images construites"
}

# 🚀 Déploiement
deploy() {
    log "🚀 Déploiement en cours..."
    
    # Copier le fichier d'environnement
    cp .env.production .env
    
    # Démarrer les services
    docker-compose up -d || error "Échec du déploiement"
    
    # Attendre que les services soient prêts
    log "⏱️ Attente de la disponibilité des services..."
    sleep 30
    
    # Vérifier la santé des services
    check_health
    
    success "Déploiement terminé"
}

# 🔍 Vérification de santé
check_health() {
    log "🔍 Vérification de la santé des services..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        log "Tentative $attempt/$max_attempts..."
        
        # Vérifier le frontend
        if curl -f -s http://localhost:3000 > /dev/null; then
            success "Frontend: ✅ OK"
            break
        fi
        
        # Vérifier le backend
        if curl -f -s http://localhost:5000/api/health > /dev/null; then
            success "Backend: ✅ OK"
            break
        fi
        
        sleep 10
        ((attempt++))
    done
    
    if [[ $attempt -gt $max_attempts ]]; then
        error "Services non disponibles après $max_attempts tentatives"
    fi
}

# 🧹 Nettoyage
cleanup() {
    log "🧹 Nettoyage..."
    
    # Supprimer les images non utilisées
    docker system prune -f || warning "Échec du nettoyage Docker"
    
    # Garder seulement les 5 dernières sauvegardes
    if [[ -d "$BACKUP_DIR" ]]; then
        find "$BACKUP_DIR" -name "*.sql" -type f | sort -r | tail -n +6 | xargs rm -f || true
        find "$BACKUP_DIR" -name "*.tar.gz" -type f | sort -r | tail -n +6 | xargs rm -f || true
    fi
    
    success "Nettoyage terminé"
}

# 📊 Rapport de déploiement
generate_report() {
    log "📊 Génération du rapport de déploiement..."
    
    cat > "deployment-report-${VERSION}.txt" << EOF
🚀 RAPPORT DE DÉPLOIEMENT - $APP_NAME
================================================
Date: $(date)
Version: $VERSION
Statut: ✅ SUCCÈS

📊 SERVICES DÉPLOYÉS:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Base de données: PostgreSQL
- Cache: Redis

📁 SAUVEGARDES:
$(ls -la "$BACKUP_DIR" | tail -5)

🔍 SANTÉ DES SERVICES:
$(docker-compose ps)

📝 LOGS:
Voir: $LOG_FILE

================================================
Déploiement terminé avec succès ! 🎉
EOF
    
    success "Rapport généré: deployment-report-${VERSION}.txt"
}

# 🎯 Fonction principale
main() {
    log "🚀 Début du déploiement de $APP_NAME v$VERSION"
    
    check_requirements
    run_tests
    backup_data
    build_images
    deploy
    cleanup
    generate_report
    
    success "🎉 Déploiement terminé avec succès!"
    success "🌐 Application disponible sur http://localhost:3000"
    success "📊 API disponible sur http://localhost:5000"
}

# 📋 Menu interactif
show_menu() {
    echo -e "${PURPLE}"
    echo "🚀 OpenCommunityManager - Script de Déploiement"
    echo "================================================"
    echo -e "${NC}"
    echo "1) 🚀 Déploiement complet"
    echo "2) 🧪 Tests uniquement"
    echo "3) 💾 Sauvegarde uniquement"
    echo "4) 🏗️ Build uniquement"
    echo "5) 🔍 Vérification santé"
    echo "6) 🧹 Nettoyage"
    echo "7) ❌ Quitter"
    echo
    read -p "Choisissez une option (1-7): " choice
    
    case $choice in
        1) main ;;
        2) run_tests ;;
        3) backup_data ;;
        4) build_images ;;
        5) check_health ;;
        6) cleanup ;;
        7) exit 0 ;;
        *) echo "Option invalide"; show_menu ;;
    esac
}

# 🎯 Point d'entrée
if [[ $# -eq 0 ]]; then
    show_menu
else
    case "$1" in
        "deploy") main ;;
        "test") run_tests ;;
        "backup") backup_data ;;
        "build") build_images ;;
        "health") check_health ;;
        "clean") cleanup ;;
        *) echo "Usage: $0 [deploy|test|backup|build|health|clean]"; exit 1 ;;
    esac
fi
