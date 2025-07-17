import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev_secret_key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') #or 'sqlite:///instance/app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER') or 'uploads'
    MAX_CONTENT_LENGTH = int(os.environ.get('MAX_CONTENT_LENGTH') or 16 * 1024 * 1024)  # 16MB
    
    # Configuration JWT
    JWT_ACCESS_TOKEN_EXPIRES = False  # Pour le développement
    JWT_ALGORITHM = 'HS256'
    
    # Configuration CORS intelligente :
    # - En développement : autorise localhost
    # - En production : autorise le front Netlify
    # - Peut être surchargé par la variable d'environnement CORS_ORIGINS
    ENV = os.environ.get('FLASK_ENV', 'production')
    if os.environ.get('CORS_ORIGINS'):
        CORS_ORIGINS = os.environ['CORS_ORIGINS'].split(',')
    #elif ENV == 'development':
        #CORS_ORIGINS = ['http://localhost:5173']
    else:
        CORS_ORIGINS = ['https://opencommunitymanager2.netlify.app']
