from datetime import datetime
from flask import Flask, jsonify, Blueprint, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
import os

# Initialisation des extensions
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
cors = CORS()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    # Force HTTPS en production
    if not app.debug and not app.testing:
        from flask_talisman import Talisman
        Talisman(app, content_security_policy=None)

    # Redirige toute requête HTTP vers HTTPS sauf pour les requêtes OPTIONS (préflight CORS)
    @app.before_request
    def before_request():
        # Ne jamais rediriger les requêtes OPTIONS (préflight CORS)
        if request.method == 'OPTIONS':
            return None  # Laisse Flask-CORS répondre
        if request.headers.get('X-Forwarded-Proto') != 'https':
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)
    # Force HTTPS en production
    if not app.debug and not app.testing:
        from flask_talisman import Talisman
        Talisman(app, content_security_policy=None)
    
    # Configuration
    app.config.from_object('config.Config')
    # Vérification explicite de la présence de DATABASE_URL
    if not app.config.get('SQLALCHEMY_DATABASE_URI'):
        raise RuntimeError("DATABASE_URL manquant : vérifie ta configuration ou tes variables d’environnement.")

    # Gestion dynamique du dossier uploads (local ou Railway)
    uploads_path = '/app/uploads' if os.path.exists('/app/uploads') else 'uploads'
    app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', uploads_path)

    # Initialisation des extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(
        app,
        origins=app.config['CORS_ORIGINS'],
        supports_credentials=True,
        allow_headers=['authorization', 'content-type', 'accept', 'origin', 'x-requested-with'],
        methods=['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT']
    )
    migrate.init_app(app, db)
    
    # Création du dossier uploads
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Importation des modèles
    from app.models import association, member, event, cotisation
    
    # Enregistrement des blueprints
    from app.routes.auth import auth_bp
    from app.routes.members import members_bp
    from app.routes.events import events_bp
    from app.routes.cotisations import cotisations_bp
    from app.routes.main import main_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(members_bp, url_prefix='/api/members')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    app.register_blueprint(cotisations_bp, url_prefix='/api/cotisations')
    app.register_blueprint(main_bp, url_prefix='/api')
    
    # Route racine : message d'accueil API contextualisé
    @app.route('/')
    def hello():
        return jsonify({
            'message': 'API Open Community Manager by opentech221 - Backend Flask + PostgreSQL',
            'author': 'OpenTech221',
            'description': "API de gestion d'associations communautaires (membres, cotisations, événements, finances, documents, notifications, messagerie)",
            'version': '1.0.0',
            'timestamp': datetime.now().isoformat(),
            'docs': 'https://github.com/opentech221/OpenCommunityManager2',
            'features': [
                'Authentification JWT',
                'Gestion des membres (CRUD, rôles)',
                'Suivi des cotisations',
                'Gestion des événements',
                'Module financier',
                'Archivage de documents',
                'Messagerie interne',
                'Profil public association',
                'Endpoints RESTful',
                'Support multi-environnements',
                'Sécurité et CORS dynamique'
            ]
        })

    # Contrôles de routes publics additionnels
    @app.route('/api/ping')
    def ping():
        return jsonify({'ping': 'pong', 'status': 'ok', 'timestamp': datetime.now().isoformat()})
    

    # Importation et enregistrement du blueprint health
    from .routes.health import health_bp
    app.register_blueprint(health_bp)

    @app.route('/api/version')
    def version():
        return jsonify({'version': '1.0.0', 'backend': 'Flask', 'database': 'PostgreSQL', 'timestamp': datetime.now().isoformat()})

    @app.route('/api/features')
    def features():
        return jsonify({
            'features': [
                'Gestion membres',
                'Cotisations',
                'Événements',
                'Finances',
                'Documents',
                'Messagerie',
                'Profil public',
                'API RESTful',
                'Sécurité JWT',
                'CORS dynamique',
                'Support multi-environnements'
            ]
        })

    @app.route('/api/docs')
    def docs():
        return jsonify({'docs': 'https://github.com/opentech221/OpenCommunityManager2', 'user_guide': 'https://github.com/opentech221/OpenCommunityManager2/docs/USER_GUIDE.md'})

    @app.route('/api/time')
    def time():
        return jsonify({'server_time': datetime.now().isoformat()})

    @app.route('/api/roadmap')
    def roadmap():
        return jsonify({
            'roadmap': [
                'MVP : Auth, membres, cotisations, dashboard',
                'Phase 2 : événements, finances, documents, messagerie',
                'Phase 3 : optimisation, accessibilité, production, intégrations'
            ]
        })

    @app.route('/api/author')
    def author():
        return jsonify({'author': 'OpenTech221', 'contact': 'https://github.com/opentech221'})
    
    # Gestion des erreurs
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Endpoint non trouvé'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Erreur interne du serveur'}, 500
    # Autres routes publiques pertinentes
    @app.route('/api/status')
    def status():
        return jsonify({
            'status': 'running',
            'env': os.environ.get('FLASK_ENV', 'production'),
            'debug': app.debug,
            'database_url': app.config.get('SQLALCHEMY_DATABASE_URI', ''),
            'timestamp': datetime.now().isoformat()
        })

    @app.route('/api/config')
    def config_info():
        return jsonify({
            'UPLOAD_FOLDER': app.config.get('UPLOAD_FOLDER'),
            'MAX_CONTENT_LENGTH': app.config.get('MAX_CONTENT_LENGTH'),
            'CORS_ORIGINS': app.config.get('CORS_ORIGINS'),
            'JWT_ALGORITHM': app.config.get('JWT_ALGORITHM'),
            'timestamp': datetime.now().isoformat()
        })

    @app.route('/api/endpoints')
    def endpoints():
        return jsonify({
            'public_endpoints': [
                '/', '/api/ping', '/api/health', '/api/version', '/api/features', '/api/docs', '/api/time', '/api/roadmap', '/api/author',
                '/api/status', '/api/config', '/api/endpoints', '/api/uptime', '/api/contact', '/api/license', '/api/stack', '/api/sample', '/api/links'
            ]
        })

    @app.route('/api/uptime')
    def uptime():
        # Pour un vrai uptime, il faudrait stocker le démarrage du serveur
        return jsonify({'uptime': 'N/A (statique)', 'timestamp': datetime.now().isoformat()})

    @app.route('/api/contact')
    def contact():
        return jsonify({'email': 'contact@opentech221.com', 'github': 'https://github.com/opentech221', 'site': 'https://opentech221.com'})

    @app.route('/api/license')
    def license():
        return jsonify({'license': 'MIT', 'url': 'https://github.com/opentech221/OpenCommunityManager2/blob/master/LICENSE'})

    @app.route('/api/stack')
    def stack():
        return jsonify({'backend': 'Flask', 'database': 'PostgreSQL', 'frontend': 'React + Vite + Tailwind', 'cloud': 'Railway/Netlify'})

    @app.route('/api/sample')
    def sample():
        return jsonify({
            'sample_member': {
                'first_name': 'Awa',
                'last_name': 'Diop',
                'email': 'awa.diop@email.com',
                'role': 'TRESORIER',
                'status': 'ACTIVE'
            },
            'sample_association': {
                'name': 'Association Demo',
                'sigle': 'AD',
                'email': 'demo@asso.com',
                'description': 'Démo gestion associative'
            }
        })

    @app.route('/api/links')
    def links():
        return jsonify({
            'frontend': 'https://opencommunitymanager2.netlify.app',
            'backend': 'https://opencommunitymanager2-backend.railway.app',
            'github': 'https://github.com/opentech221/OpenCommunityManager2',
            'docs': 'https://github.com/opentech221/OpenCommunityManager2/blob/master/docs/USER_GUIDE.md'
        })
    
    
    return app
