from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.cotisation import Cotisation
from app.models.member import Member
from datetime import datetime

cotisations_bp = Blueprint('cotisations', __name__)

@cotisations_bp.route('/', methods=['GET'])
@jwt_required()
def get_cotisations():
    try:
        association_id = get_jwt_identity()
        
        # Paramètres de filtrage
        year = request.args.get('year', '')
        status = request.args.get('status', '')
        member_id = request.args.get('member_id', '')
        
        # Query de base avec jointure pour filtrer par association
        query = db.session.query(Cotisation).join(Member).filter(Member.association_id == association_id)
        
        # Filtres
        if year:
            query = query.filter(Cotisation.year == int(year))
        
        if status:
            query = query.filter(Cotisation.status == status)
        
        if member_id:
            query = query.filter(Cotisation.member_id == int(member_id))
        
        cotisations = query.order_by(Cotisation.payment_date.desc()).all()
        return jsonify([cotisation.to_dict() for cotisation in cotisations]), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération des cotisations: ' + str(e)}), 500

@cotisations_bp.route('/', methods=['POST'])
@jwt_required()
def create_cotisation():
    try:
        association_id = get_jwt_identity()
        data = request.get_json()
        
        # Vérification des champs requis
        required_fields = ['member_id', 'amount', 'payment_date', 'year']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Vérification que le membre appartient à l'association
        member = Member.query.filter_by(id=data['member_id'], association_id=association_id).first()
        if not member:
            return jsonify({'error': 'Membre non trouvé'}), 404
        
        # Conversion de la date
        payment_date = datetime.fromisoformat(data['payment_date'].replace('Z', '+00:00'))
        
        # Création de la cotisation
        cotisation = Cotisation(
            member_id=data['member_id'],
            amount=data['amount'],
            payment_date=payment_date,
            payment_method=data.get('payment_method', 'CASH'),
            status=data.get('status', 'PENDING'),
            year=data['year'],
            notes=data.get('notes')
        )
        
        db.session.add(cotisation)
        db.session.commit()
        
        return jsonify(cotisation.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la création de la cotisation: ' + str(e)}), 500

@cotisations_bp.route('/<int:cotisation_id>', methods=['GET'])
@jwt_required()
def get_cotisation(cotisation_id):
    try:
        association_id = get_jwt_identity()
        cotisation = db.session.query(Cotisation).join(Member).filter(
            Cotisation.id == cotisation_id,
            Member.association_id == association_id
        ).first()
        
        if not cotisation:
            return jsonify({'error': 'Cotisation non trouvée'}), 404
        
        return jsonify(cotisation.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération de la cotisation: ' + str(e)}), 500

@cotisations_bp.route('/<int:cotisation_id>', methods=['PUT'])
@jwt_required()
def update_cotisation(cotisation_id):
    try:
        association_id = get_jwt_identity()
        cotisation = db.session.query(Cotisation).join(Member).filter(
            Cotisation.id == cotisation_id,
            Member.association_id == association_id
        ).first()
        
        if not cotisation:
            return jsonify({'error': 'Cotisation non trouvée'}), 404
        
        data = request.get_json()
        
        # Mise à jour des champs
        if 'amount' in data:
            cotisation.amount = data['amount']
        if 'payment_date' in data:
            cotisation.payment_date = datetime.fromisoformat(data['payment_date'].replace('Z', '+00:00'))
        if 'payment_method' in data:
            cotisation.payment_method = data['payment_method']
        if 'status' in data:
            cotisation.status = data['status']
        if 'year' in data:
            cotisation.year = data['year']
        if 'notes' in data:
            cotisation.notes = data['notes']
        
        db.session.commit()
        
        return jsonify(cotisation.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la mise à jour de la cotisation: ' + str(e)}), 500

@cotisations_bp.route('/<int:cotisation_id>', methods=['DELETE'])
@jwt_required()
def delete_cotisation(cotisation_id):
    try:
        association_id = get_jwt_identity()
        cotisation = db.session.query(Cotisation).join(Member).filter(
            Cotisation.id == cotisation_id,
            Member.association_id == association_id
        ).first()
        
        if not cotisation:
            return jsonify({'error': 'Cotisation non trouvée'}), 404
        
        db.session.delete(cotisation)
        db.session.commit()
        
        return jsonify({'message': 'Cotisation supprimée avec succès'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la suppression de la cotisation: ' + str(e)}), 500

@cotisations_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_cotisation_stats():
    try:
        association_id = get_jwt_identity()
        year = request.args.get('year', datetime.now().year)
        
        # Statistiques des cotisations
        stats = db.session.query(
            Cotisation.status,
            db.func.count(Cotisation.id).label('count'),
            db.func.sum(Cotisation.amount).label('total')
        ).join(Member).filter(
            Member.association_id == association_id,
            Cotisation.year == year
        ).group_by(Cotisation.status).all()
        
        result = {
            'year': year,
            'stats': [
                {
                    'status': stat.status,
                    'count': stat.count,
                    'total': float(stat.total) if stat.total else 0
                }
                for stat in stats
            ]
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération des statistiques: ' + str(e)}), 500
