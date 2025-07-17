from flask import Blueprint, jsonify
from datetime import datetime

health_bp = Blueprint('health', __name__)

@health_bp.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'db': True,
        'timestamp': datetime.now().isoformat()
    })
