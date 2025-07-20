from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from app import db, bcrypt
from app.models.association import Association
import os
from werkzeug.utils import secure_filename

auth_bp = Blueprint('auth', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        # Récupération des données
        data = request.get_json() if request.is_json else request.form
        
        # Vérification des champs requis
        required_fields = ['name', 'email', 'phone', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Vérification si l'email existe déjà
        if Association.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Cette adresse email est déjà utilisée'}), 400
        
        # Hachage du mot de passe
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Gestion du logo
        logo_filename = None
        if 'logo' in request.files:
            logo = request.files['logo']
            if logo and allowed_file(logo.filename):
                logo_filename = secure_filename(logo.filename)
                logo_path = os.path.join(current_app.config['UPLOAD_FOLDER'], logo_filename)
                logo.save(logo_path)
        
        # Création de l'association
        association = Association(
            name=data['name'],
            sigle=data.get('sigle'),
            email=data['email'],
            phone=data['phone'],
            password_hash=password_hash,
            logo=logo_filename,
            description=data.get('description'),
            address=data.get('address')
        )
        
        db.session.add(association)
        db.session.commit()
        
        # Création du token JWT
        access_token = create_access_token(identity=str(association.id))
        
        return jsonify({
            'token': access_token,
            'association': association.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de l\'inscription: ' + str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email et mot de passe requis'}), 400
        
        # Recherche de l'association
        association = Association.query.filter_by(email=data['email']).first()
        
        if not association or not bcrypt.check_password_hash(association.password_hash, data['password']):
            return jsonify({'error': 'Identifiants invalides'}), 401
        
        # Création du token JWT
        access_token = create_access_token(identity=str(association.id))
        
        return jsonify({
            'token': access_token,
            'association': association.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la connexion: ' + str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        association_id = get_jwt_identity()
        association = Association.query.get(association_id)
        
        if not association:
            return jsonify({'error': 'Association non trouvée'}), 404
        
        return jsonify(association.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération du profil: ' + str(e)}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        association_id = get_jwt_identity()
        association = Association.query.get(association_id)
        
        if not association:
            return jsonify({'error': 'Association non trouvée'}), 404
        
        data = request.get_json()
        
        # Mise à jour des champs
        if 'name' in data:
            association.name = data['name']
        if 'sigle' in data:
            association.sigle = data['sigle']
        if 'phone' in data:
            association.phone = data['phone']
        if 'description' in data:
            association.description = data['description']
        if 'address' in data:
            association.address = data['address']
        
        db.session.commit()
        
        return jsonify(association.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la mise à jour: ' + str(e)}), 500
