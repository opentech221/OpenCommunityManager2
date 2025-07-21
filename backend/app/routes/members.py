from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.member import Member
from app.models.association import Association
import traceback

members_bp = Blueprint('members', __name__)

@members_bp.route('/', methods=['GET'])
@jwt_required()
def get_members():
    try:
        association_id = get_jwt_identity()
        
        # Paramètres de filtrage
        search = request.args.get('search', '')
        role = request.args.get('role', '')
        status = request.args.get('status', '')
        
        # Query de base
        query = Member.query.filter_by(association_id=association_id)
        
        # Filtres
        if search:
            query = query.filter(
                (Member.first_name.ilike(f'%{search}%')) |
                (Member.last_name.ilike(f'%{search}%')) |
                (Member.email.ilike(f'%{search}%'))
            )
        
        if role:
            query = query.filter_by(role=role)
        
        if status:
            query = query.filter_by(status=status)
        
        members = query.all()
        return jsonify([member.to_dict() for member in members]), 200
        
    except Exception as e:
        import traceback
        return jsonify({'error': 'Erreur lors de la récupération des membres', 'details': str(e), 'trace': traceback.format_exc()}), 500

@members_bp.route('/', methods=['POST'])
@jwt_required()
def create_member():
    try:
        association_id = get_jwt_identity()
        data = request.get_json()
        
        # Vérification des champs requis
        required_fields = ['first_name', 'last_name', 'email', 'phone', 'role']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Vérification si l'email existe déjà
        if Member.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Cette adresse email est déjà utilisée'}), 400
        
        # Création du membre
        member = Member(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data['phone'],
            role=data['role'],
            status=data.get('status', 'ACTIVE'),
            association_id=association_id
        )
        
        db.session.add(member)
        db.session.commit()
        
        return jsonify(member.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la création du membre: ' + str(e)}), 500

@members_bp.route('/<int:member_id>', methods=['GET', 'OPTIONS'])
@members_bp.route('/<int:member_id>/', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_member(member_id):
    try:
        association_id = get_jwt_identity()
        member = Member.query.filter_by(id=member_id, association_id=association_id).first()
        
        if not member:
            return jsonify({'error': 'Membre non trouvé'}), 404
        
        return jsonify(member.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération du membre: ' + str(e)}), 500

@members_bp.route('/<int:member_id>', methods=['PUT', 'OPTIONS'])
@members_bp.route('/<int:member_id>/', methods=['PUT', 'OPTIONS'])
@jwt_required()
def update_member(member_id):
    try:
        association_id = get_jwt_identity()
        member = Member.query.filter_by(id=member_id, association_id=association_id).first()
        
        if not member:
            return jsonify({'error': 'Membre non trouvé'}), 404
        
        data = request.get_json()
        
        # Mise à jour des champs
        if 'first_name' in data:
            member.first_name = data['first_name']
        if 'last_name' in data:
            member.last_name = data['last_name']
        if 'email' in data:
            # Vérifier si l'email n'est pas déjà utilisé par un autre membre
            existing_member = Member.query.filter_by(email=data['email']).first()
            if existing_member and existing_member.id != member.id:
                return jsonify({'error': 'Cette adresse email est déjà utilisée'}), 400
            member.email = data['email']
        if 'phone' in data:
            member.phone = data['phone']
        if 'role' in data:
            member.role = data['role']
        if 'status' in data:
            member.status = data['status']
        
        db.session.commit()
        
        return jsonify(member.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la mise à jour du membre: ' + str(e)}), 500

@members_bp.route('/<int:member_id>', methods=['DELETE', 'OPTIONS'])
@members_bp.route('/<int:member_id>/', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def delete_member(member_id):
    try:
        association_id = get_jwt_identity()
        member = Member.query.filter_by(id=member_id, association_id=association_id).first()
        
        if not member:
            return jsonify({'error': 'Membre non trouvé'}), 404
        
        db.session.delete(member)
        db.session.commit()
        
        return jsonify({'message': 'Membre supprimé avec succès'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la suppression du membre: ' + str(e)}), 500
