from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.event import Event
from datetime import datetime
import traceback

events_bp = Blueprint('events', __name__)

# Route OPTIONS explicite pour debug CORS
@events_bp.route('/<int:event_id>', methods=['OPTIONS'])
def handle_preflight(event_id):
    """Handle CORS preflight requests explicitly"""
    try:
        response = jsonify({'message': 'CORS preflight OK', 'event_id': event_id})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'authorization,content-type')
        response.headers.add('Access-Control-Allow-Methods', 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response, 200
    except Exception as e:
        error_response = {
            'error': f'CORS preflight error: {str(e)}',
            'traceback': traceback.format_exc(),
            'event_id': event_id
        }
        return jsonify(error_response), 500

@events_bp.route('/', methods=['GET'])
@jwt_required()
def get_events():
    try:
        association_id = get_jwt_identity()
        
        # Paramètres de filtrage
        status = request.args.get('status', '')
        event_type = request.args.get('type', '')
        
        # Query de base
        query = Event.query.filter_by(association_id=association_id)
        
        # Filtres
        if status:
            query = query.filter_by(status=status)
        
        if event_type:
            query = query.filter_by(event_type=event_type)
        
        events = query.order_by(Event.start_date.desc()).all()
        return jsonify([event.to_dict() for event in events]), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération des événements: ' + str(e)}), 500

@events_bp.route('/', methods=['POST'])
@jwt_required()
def create_event():
    try:
        association_id = get_jwt_identity()
        data = request.get_json()
        
        # Vérification des champs requis
        required_fields = ['title', 'start_date', 'location']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Conversion des dates
        start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        end_date = None
        if data.get('end_date'):
            end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        
        # Création de l'événement
        event = Event(
            title=data['title'],
            description=data.get('description'),
            start_date=start_date,
            end_date=end_date,
            location=data['location'],
            event_type=data.get('type', 'OTHER'),
            status=data.get('status', 'PLANNED'),
            max_participants=data.get('max_participants'),
            association_id=association_id,
            created_by=data.get('created_by')
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify(event.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la création de l\'événement: ' + str(e)}), 500

@events_bp.route('/<int:event_id>', methods=['GET'])
@jwt_required()
def get_event(event_id):
    try:
        association_id = get_jwt_identity()
        event = Event.query.filter_by(id=event_id, association_id=association_id).first()
        
        if not event:
            return jsonify({'error': 'Événement non trouvé'}), 404
        
        return jsonify(event.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération de l\'événement: ' + str(e)}), 500

@events_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_event(event_id):
    try:
        association_id = get_jwt_identity()
        
        # Log des données reçues pour debug
        data = request.get_json()
        print(f"DEBUG: Updating event {event_id} for association {association_id}")
        print(f"DEBUG: Received data: {data}")
        
        event = Event.query.filter_by(id=event_id, association_id=association_id).first()
        
        if not event:
            error_response = {
                'error': 'Événement non trouvé',
                'event_id': event_id,
                'association_id': association_id,
                'debug': 'Event not found in database for this association'
            }
            return jsonify(error_response), 404
        
        # Mise à jour des champs
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'start_date' in data:
            event.start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        if 'end_date' in data:
            event.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00')) if data['end_date'] else None
        if 'location' in data:
            event.location = data['location']
        if 'type' in data:
            event.event_type = data['type']
        if 'status' in data:
            event.status = data['status']
        if 'max_participants' in data:
            event.max_participants = data['max_participants']
        
        db.session.commit()
        
        print(f"DEBUG: Event {event_id} updated successfully")
        return jsonify(event.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        error_response = {
            'error': f'Erreur lors de la mise à jour de l\'événement: {str(e)}',
            'event_id': event_id,
            'traceback': traceback.format_exc(),
            'debug': 'Exception occurred during event update'
        }
        print(f"ERROR: {error_response}")
        return jsonify(error_response), 500

@events_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_event(event_id):
    try:
        association_id = get_jwt_identity()
        event = Event.query.filter_by(id=event_id, association_id=association_id).first()
        
        if not event:
            return jsonify({'error': 'Événement non trouvé'}), 404
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': 'Événement supprimé avec succès'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la suppression de l\'événement: ' + str(e)}), 500
