from flask import Flask
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
    
    # Configuration
    app.config.from_object('config.Config')

    # Gestion dynamique du dossier uploads (local ou Railway)
    uploads_path = '/app/uploads' if os.path.exists('/app/uploads') else 'uploads'
    app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', uploads_path)

    # Initialisation des extensions
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, origins=app.config['CORS_ORIGINS'])
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
    
    # Route de test
    @app.route('/')
    def hello():
        return {'message': 'API Open Community Manager - Backend Flask + PostgreSQL'}
    
    # Gestion des erreurs
    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Endpoint non trouvé'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Erreur interne du serveur'}, 500
    
    return app
