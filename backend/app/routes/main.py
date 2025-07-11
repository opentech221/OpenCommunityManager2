from flask import Blueprint, jsonify
from datetime import datetime

main_bp = Blueprint('main', __name__)

@main_bp.route('/health', methods=['GET'])
def health_check():
    """Endpoint de vérification de santé de l'API"""
    return jsonify({
        'status': 'healthy',
        'message': 'API Open Community Manager opérationnelle',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }), 200

@main_bp.route('/status', methods=['GET'])
def status():
    """Endpoint de statut détaillé"""
    return jsonify({
        'api': 'Open Community Manager Backend',
        'status': 'running',
        'environment': 'development',
        'database': 'connected',
        'features': {
            'authentication': True,
            'members_management': True,
            'events_management': True,
            'cotisations_management': True
        }
    }), 200
