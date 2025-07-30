"""
Routes API pour la gestion des transactions financières
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.transaction import Transaction, TransactionType
from datetime import datetime, date
import traceback

finances_bp = Blueprint('finances', __name__)


# Route OPTIONS pour la collection de transactions
@finances_bp.route('/', methods=['OPTIONS'])
def handle_preflight_collection():
    """Handle CORS preflight requests for transactions collection"""
    return '', 204


# Route OPTIONS pour les opérations sur une transaction spécifique
@finances_bp.route('/<int:transaction_id>/', methods=['OPTIONS'])
@finances_bp.route('/<int:transaction_id>', methods=['OPTIONS'])
def handle_preflight(transaction_id):
    """Handle CORS preflight requests for transaction operations"""
    return '', 204


# Route OPTIONS pour les statistiques
@finances_bp.route('/stats', methods=['OPTIONS'])
def handle_preflight_stats():
    """Handle CORS preflight requests for finances stats"""
    return '', 204


@finances_bp.route('/', methods=['GET'])
@jwt_required()
def get_transactions():
    """Récupérer toutes les transactions de l'association"""
    try:
        association_id = get_jwt_identity()
        
        # Paramètres de filtrage
        transaction_type = request.args.get('type', '')
        category = request.args.get('category', '')
        start_date = request.args.get('start_date', '')
        end_date = request.args.get('end_date', '')
        
        # Query de base
        query = Transaction.query.filter_by(association_id=association_id)
        
        # Filtres
        if transaction_type:
            query = query.filter_by(type=TransactionType(transaction_type))
        
        if category:
            query = query.filter_by(category=category)
        
        if start_date:
            start = datetime.fromisoformat(start_date).date()
            query = query.filter(Transaction.date >= start)
        
        if end_date:
            end = datetime.fromisoformat(end_date).date()
            query = query.filter(Transaction.date <= end)
        
        transactions = query.order_by(Transaction.date.desc()).all()
        return jsonify([transaction.to_dict() for transaction in transactions]), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération des transactions: ' + str(e)}), 500


@finances_bp.route('/', methods=['POST'])
@jwt_required()
def create_transaction():
    """Créer une nouvelle transaction"""
    try:
        association_id = get_jwt_identity()
        data = request.get_json()
        
        # Vérification des champs requis
        required_fields = ['description', 'amount', 'type', 'category', 'date']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        # Validation du type de transaction
        try:
            transaction_type = TransactionType(data['type'])
        except ValueError:
            return jsonify({'error': 'Type de transaction invalide'}), 400
        
        # Validation du montant
        try:
            amount = float(data['amount'])
            if amount <= 0:
                return jsonify({'error': 'Le montant doit être supérieur à 0'}), 400
        except ValueError:
            return jsonify({'error': 'Montant invalide'}), 400
        
        # Conversion de la date
        try:
            transaction_date = datetime.fromisoformat(data['date'].replace('Z', '+00:00')).date()
        except ValueError:
            return jsonify({'error': 'Format de date invalide'}), 400
        
        # Création de la transaction
        transaction = Transaction(
            association_id=association_id,
            description=data['description'],
            amount=amount,
            type=transaction_type,
            category=data['category'],
            date=transaction_date,
            receipt=data.get('receipt'),
            notes=data.get('notes'),
            created_by=data.get('created_by')
        )
        
        db.session.add(transaction)
        db.session.commit()
        
        return jsonify(transaction.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la création de la transaction: ' + str(e)}), 500


@finances_bp.route('/<int:transaction_id>', methods=['GET'])
@finances_bp.route('/<int:transaction_id>/', methods=['GET'])
@jwt_required()
def get_transaction(transaction_id):
    """Récupérer une transaction spécifique"""
    try:
        association_id = get_jwt_identity()
        transaction = Transaction.query.filter_by(
            id=transaction_id,
            association_id=association_id
        ).first()
        
        if not transaction:
            return jsonify({'error': 'Transaction non trouvée'}), 404
        
        return jsonify(transaction.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération de la transaction: ' + str(e)}), 500


@finances_bp.route('/<int:transaction_id>', methods=['PUT'])
@finances_bp.route('/<int:transaction_id>/', methods=['PUT'])
@jwt_required()
def update_transaction(transaction_id):
    """Mettre à jour une transaction"""
    try:
        association_id = get_jwt_identity()
        transaction = Transaction.query.filter_by(
            id=transaction_id,
            association_id=association_id
        ).first()
        
        if not transaction:
            return jsonify({'error': 'Transaction non trouvée'}), 404
        
        data = request.get_json()
        
        # Mise à jour des champs
        if 'description' in data:
            transaction.description = data['description']
        
        if 'amount' in data:
            try:
                amount = float(data['amount'])
                if amount <= 0:
                    return jsonify({'error': 'Le montant doit être supérieur à 0'}), 400
                transaction.amount = amount
            except ValueError:
                return jsonify({'error': 'Montant invalide'}), 400
        
        if 'type' in data:
            try:
                transaction.type = TransactionType(data['type'])
            except ValueError:
                return jsonify({'error': 'Type de transaction invalide'}), 400
        
        if 'category' in data:
            transaction.category = data['category']
        
        if 'date' in data:
            try:
                transaction.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00')).date()
            except ValueError:
                return jsonify({'error': 'Format de date invalide'}), 400
        
        if 'receipt' in data:
            transaction.receipt = data['receipt']
        
        if 'notes' in data:
            transaction.notes = data['notes']
        
        db.session.commit()
        
        return jsonify(transaction.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la mise à jour de la transaction: ' + str(e)}), 500


@finances_bp.route('/<int:transaction_id>', methods=['DELETE'])
@finances_bp.route('/<int:transaction_id>/', methods=['DELETE'])
@jwt_required()
def delete_transaction(transaction_id):
    """Supprimer une transaction"""
    try:
        association_id = get_jwt_identity()
        transaction = Transaction.query.filter_by(
            id=transaction_id,
            association_id=association_id
        ).first()
        
        if not transaction:
            return jsonify({'error': 'Transaction non trouvée'}), 404
        
        db.session.delete(transaction)
        db.session.commit()
        
        return jsonify({'message': 'Transaction supprimée avec succès'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erreur lors de la suppression de la transaction: ' + str(e)}), 500


@finances_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_finance_stats():
    """Récupérer les statistiques financières"""
    try:
        association_id = get_jwt_identity()
        
        # Paramètres optionnels
        year = request.args.get('year', '')
        month = request.args.get('month', '')
        
        # Query de base
        query = Transaction.query.filter_by(association_id=association_id)
        
        # Filtres temporels
        if year:
            query = query.filter(db.extract('year', Transaction.date) == int(year))
        
        if month:
            query = query.filter(db.extract('month', Transaction.date) == int(month))
        
        transactions = query.all()
        
        # Calculs des statistiques
        total_income = sum(t.amount for t in transactions if t.type == TransactionType.INCOME)
        total_expenses = sum(t.amount for t in transactions if t.type == TransactionType.EXPENSE)
        balance = total_income - total_expenses
        
        # Statistiques par catégorie
        categories_stats = {}
        for transaction in transactions:
            cat = transaction.category
            if cat not in categories_stats:
                categories_stats[cat] = {'income': 0, 'expenses': 0, 'count': 0}
            
            if transaction.type == TransactionType.INCOME:
                categories_stats[cat]['income'] += transaction.amount
            else:
                categories_stats[cat]['expenses'] += transaction.amount
            
            categories_stats[cat]['count'] += 1
        
        # Transactions récentes
        recent_transactions = Transaction.query.filter_by(
            association_id=association_id
        ).order_by(Transaction.date.desc()).limit(5).all()
        
        result = {
            'total_income': total_income,
            'total_expenses': total_expenses,
            'balance': balance,
            'transactions_count': len(transactions),
            'categories_stats': categories_stats,
            'recent_transactions': [t.to_dict() for t in recent_transactions]
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération des statistiques: ' + str(e)}), 500


@finances_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Récupérer les catégories utilisées par l'association"""
    try:
        association_id = get_jwt_identity()
        
        categories = db.session.query(Transaction.category).filter_by(
            association_id=association_id
        ).distinct().all()
        
        category_list = [cat[0] for cat in categories]
        
        return jsonify({'categories': category_list}), 200
        
    except Exception as e:
        return jsonify({'error': 'Erreur lors de la récupération des catégories: ' + str(e)}), 500
