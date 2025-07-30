"""
Routes API pour le système de guidance organisationnelle
"""
import uuid
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.guidance import (
    OrganizationalDiagnostic,
    ComplianceCheck,
    Recommendation,
    SmartInsight,
    DocumentTemplate,
    AIQuery,
    MaturityLevel,
    ComplianceCategory,
    ComplianceStatus,
    RecommendationPriority,
    RecommendationStatus,
    InsightType
)
from app.models.association import Association
import json


guidance_bp = Blueprint('guidance', __name__)


# =============================================================================
# ROUTES DIAGNOSTIC ORGANISATIONNEL
# =============================================================================

@guidance_bp.route('/diagnostics', methods=['GET'])
@jwt_required()
def get_diagnostics():
    """Récupérer tous les diagnostics de l'association"""
    try:
        association_id = get_jwt_identity()
        diagnostics = OrganizationalDiagnostic.query.filter_by(
            association_id=association_id
        ).order_by(OrganizationalDiagnostic.performed_at.desc()).all()
        
        return jsonify([d.to_dict() for d in diagnostics]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@guidance_bp.route('/diagnostics/<diagnostic_id>', methods=['GET'])
@jwt_required()
def get_diagnostic(diagnostic_id):
    """Récupérer un diagnostic spécifique"""
    try:
        association_id = get_jwt_identity()
        diagnostic = OrganizationalDiagnostic.query.filter_by(
            id=diagnostic_id,
            association_id=association_id
        ).first()
        
        if not diagnostic:
            return jsonify({'error': 'Diagnostic non trouvé'}), 404
            
        return jsonify(diagnostic.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@guidance_bp.route('/diagnostics', methods=['POST'])
@jwt_required()
def create_diagnostic():
    """Créer un nouveau diagnostic"""
    try:
        association_id = get_jwt_identity()
        data = request.get_json()
        
        # Validation des données
        required_fields = [
            'current_maturity_level', 'target_maturity_level', 
            'overall_score', 'category_scores', 'strengths', 'weaknesses'
        ]
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Champ manquant: {field}'}), 400
        
        # Créer le diagnostic
        diagnostic = OrganizationalDiagnostic(
            id=str(uuid.uuid4()),
            association_id=association_id,
            current_maturity_level=MaturityLevel(data['current_maturity_level']),
            target_maturity_level=MaturityLevel(data['target_maturity_level']),
            overall_score=data['overall_score'],
            category_scores=data['category_scores'],
            strengths=data['strengths'],
            weaknesses=data['weaknesses'],
            next_assessment_date=datetime.now() + timedelta(days=90)  # 3 mois
        )
        
        db.session.add(diagnostic)
        
        # Ajouter les recommandations si fournies
        if 'recommendations' in data:
            for rec_data in data['recommendations']:
                recommendation = Recommendation(
                    id=str(uuid.uuid4()),
                    diagnostic_id=diagnostic.id,
                    priority=RecommendationPriority(rec_data['priority']),
                    category=rec_data['category'],
                    title=rec_data['title'],
                    description=rec_data['description'],
                    action_steps=rec_data.get('action_steps', []),
                    estimated_duration=rec_data.get('estimated_duration'),
                    resources=rec_data.get('resources', []),
                    impact=rec_data.get('impact')
                )
                db.session.add(recommendation)
        
        # Ajouter les vérifications de conformité si fournies
        if 'compliance_checks' in data:
            for comp_data in data['compliance_checks']:
                compliance = ComplianceCheck(
                    id=str(uuid.uuid4()),
                    diagnostic_id=diagnostic.id,
                    category=ComplianceCategory(comp_data['category']),
                    title=comp_data['title'],
                    description=comp_data['description'],
                    required=comp_data.get('required', False),
                    status=ComplianceStatus(comp_data['status']),
                    documents=comp_data.get('documents', []),
                    action_items=comp_data.get('action_items', [])
                )
                db.session.add(compliance)
        
        # Ajouter les insights si fournis
        if 'insights' in data:
            for insight_data in data['insights']:
                insight = SmartInsight(
                    id=str(uuid.uuid4()),
                    diagnostic_id=diagnostic.id,
                    type=InsightType(insight_data['type']),
                    title=insight_data['title'],
                    description=insight_data['description'],
                    category=insight_data['category'],
                    priority=insight_data.get('priority', 1),
                    actionable=insight_data.get('actionable', False),
                    actions=insight_data.get('actions', [])
                )
                db.session.add(insight)
        
        db.session.commit()
        
        return jsonify(diagnostic.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTES RECOMMANDATIONS
# =============================================================================

@guidance_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Récupérer toutes les recommandations de l'association"""
    try:
        association_id = get_jwt_identity()
        
        # Joindre avec diagnostic pour filtrer par association
        recommendations = db.session.query(Recommendation).join(
            OrganizationalDiagnostic
        ).filter(
            OrganizationalDiagnostic.association_id == association_id
        ).order_by(
            Recommendation.priority.desc(),
            Recommendation.created_at.desc()
        ).all()
        
        return jsonify([r.to_dict() for r in recommendations]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@guidance_bp.route('/recommendations/<recommendation_id>', methods=['PUT'])
@jwt_required()
def update_recommendation(recommendation_id):
    """Mettre à jour le statut d'une recommandation"""
    try:
        association_id = get_jwt_identity()
        data = request.get_json()
        
        # Vérifier que la recommandation appartient à l'association
        recommendation = db.session.query(Recommendation).join(
            OrganizationalDiagnostic
        ).filter(
            Recommendation.id == recommendation_id,
            OrganizationalDiagnostic.association_id == association_id
        ).first()
        
        if not recommendation:
            return jsonify({'error': 'Recommandation non trouvée'}), 404
        
        # Mettre à jour le statut
        if 'status' in data:
            recommendation.status = RecommendationStatus(data['status'])
        
        db.session.commit()
        return jsonify(recommendation.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTES INSIGHTS
# =============================================================================

@guidance_bp.route('/insights', methods=['GET'])
@jwt_required()
def get_insights():
    """Récupérer tous les insights de l'association"""
    try:
        association_id = get_jwt_identity()
        
        insights = db.session.query(SmartInsight).join(
            OrganizationalDiagnostic
        ).filter(
            OrganizationalDiagnostic.association_id == association_id,
            SmartInsight.dismissed == False
        ).order_by(
            SmartInsight.priority.desc(),
            SmartInsight.created_at.desc()
        ).all()
        
        return jsonify([i.to_dict() for i in insights]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@guidance_bp.route('/insights/<insight_id>/dismiss', methods=['PUT'])
@jwt_required()
def dismiss_insight(insight_id):
    """Marquer un insight comme ignoré"""
    try:
        association_id = get_jwt_identity()
        
        insight = db.session.query(SmartInsight).join(
            OrganizationalDiagnostic
        ).filter(
            SmartInsight.id == insight_id,
            OrganizationalDiagnostic.association_id == association_id
        ).first()
        
        if not insight:
            return jsonify({'error': 'Insight non trouvé'}), 404
        
        insight.dismissed = True
        db.session.commit()
        
        return jsonify({'message': 'Insight ignoré avec succès'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTES CONFORMITÉ
# =============================================================================

@guidance_bp.route('/compliance', methods=['GET'])
@jwt_required()
def get_compliance_checks():
    """Récupérer toutes les vérifications de conformité"""
    try:
        association_id = get_jwt_identity()
        
        checks = db.session.query(ComplianceCheck).join(
            OrganizationalDiagnostic
        ).filter(
            OrganizationalDiagnostic.association_id == association_id
        ).order_by(
            ComplianceCheck.required.desc(),
            ComplianceCheck.next_deadline.asc()
        ).all()
        
        return jsonify([c.to_dict() for c in checks]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@guidance_bp.route('/compliance/<check_id>', methods=['PUT'])
@jwt_required()
def update_compliance_check(check_id):
    """Mettre à jour une vérification de conformité"""
    try:
        association_id = get_jwt_identity()
        data = request.get_json()
        
        check = db.session.query(ComplianceCheck).join(
            OrganizationalDiagnostic
        ).filter(
            ComplianceCheck.id == check_id,
            OrganizationalDiagnostic.association_id == association_id
        ).first()
        
        if not check:
            return jsonify({'error': 'Vérification non trouvée'}), 404
        
        # Mettre à jour les champs
        if 'status' in data:
            check.status = ComplianceStatus(data['status'])
            check.last_checked = datetime.now()
        
        if 'documents' in data:
            check.documents = data['documents']
        
        if 'action_items' in data:
            check.action_items = data['action_items']
        
        db.session.commit()
        return jsonify(check.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTES TEMPLATES DE DOCUMENTS
# =============================================================================

@guidance_bp.route('/templates', methods=['GET'])
@jwt_required()
def get_document_templates():
    """Récupérer les templates de documents"""
    try:
        maturity_level = request.args.get('maturity_level', type=int)
        category = request.args.get('category')
        
        query = DocumentTemplate.query
        
        if maturity_level:
            query = query.filter(DocumentTemplate.maturity_level == MaturityLevel(maturity_level))
        
        if category:
            query = query.filter(DocumentTemplate.category == category)
        
        templates = query.all()
        return jsonify([t.to_dict() for t in templates]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTES ASSISTANT IA
# =============================================================================

@guidance_bp.route('/ai/query', methods=['POST'])
@jwt_required()
def ai_query():
    """Soumettre une requête à l'assistant IA"""
    try:
        association_id = get_jwt_identity()
        data = request.get_json()
        
        if 'query' not in data:
            return jsonify({'error': 'Champ query manquant'}), 400
        
        # TODO: Intégrer service IA externe (OpenAI, Claude, etc.)
        # Pour l'instant, réponse simulée
        response_text = f"Réponse simulée pour: {data['query']}"
        suggestions = ["Suggestion 1", "Suggestion 2"]
        
        # Enregistrer la requête
        ai_query_record = AIQuery(
            id=str(uuid.uuid4()),
            association_id=association_id,
            diagnostic_id=data.get('diagnostic_id'),
            query=data['query'],
            context=data.get('context', {}),
            response=response_text,
            suggestions=suggestions,
            related_resources=[],
            follow_up_questions=[],
            confidence=0.8
        )
        
        db.session.add(ai_query_record)
        db.session.commit()
        
        return jsonify({
            'response': response_text,
            'suggestions': suggestions,
            'related_resources': [],
            'follow_up_questions': [],
            'confidence': 0.8
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ROUTES STATISTIQUES & ANALYTICS
# =============================================================================

@guidance_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    """Récupérer les analytics de guidance"""
    try:
        association_id = get_jwt_identity()
        
        # Statistiques générales
        total_diagnostics = OrganizationalDiagnostic.query.filter_by(
            association_id=association_id
        ).count()
        
        # Dernier diagnostic
        latest_diagnostic = OrganizationalDiagnostic.query.filter_by(
            association_id=association_id
        ).order_by(OrganizationalDiagnostic.performed_at.desc()).first()
        
        # Recommandations par statut
        if latest_diagnostic:
            recommendations_stats = db.session.query(
                Recommendation.status,
                db.func.count(Recommendation.id)
            ).filter_by(diagnostic_id=latest_diagnostic.id).group_by(
                Recommendation.status
            ).all()
            
            compliance_stats = db.session.query(
                ComplianceCheck.status,
                db.func.count(ComplianceCheck.id)
            ).filter_by(diagnostic_id=latest_diagnostic.id).group_by(
                ComplianceCheck.status
            ).all()
        else:
            recommendations_stats = []
            compliance_stats = []
        
        return jsonify({
            'total_diagnostics': total_diagnostics,
            'latest_diagnostic': latest_diagnostic.to_dict() if latest_diagnostic else None,
            'recommendations_stats': {
                status.value: count for status, count in recommendations_stats
            },
            'compliance_stats': {
                status.value: count for status, count in compliance_stats
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =============================================================================
# UTILITAIRES
# =============================================================================

@guidance_bp.route('/maturity-levels', methods=['GET'])
def get_maturity_levels():
    """Récupérer la liste des niveaux de maturité"""
    levels = []
    for level in MaturityLevel:
        levels.append({
            'id': level.value,
            'name': level.name,
            'value': level.value
        })
    return jsonify(levels), 200


@guidance_bp.route('/compliance-categories', methods=['GET'])
def get_compliance_categories():
    """Récupérer la liste des catégories de conformité"""
    categories = []
    for category in ComplianceCategory:
        categories.append({
            'id': category.value,
            'name': category.name,
            'value': category.value
        })
    return jsonify(categories), 200
