"""
Modèles de données pour le système de guidance organisationnelle
"""
from datetime import datetime
from enum import Enum
from app import db
from sqlalchemy import JSON


class MaturityLevel(Enum):
    """Niveaux de maturité organisationnelle"""
    EMERGENT = 1
    STRUCTURE = 2
    ORGANISE = 3
    OPTIMISE = 4
    EXCELLENCE = 5


class ComplianceCategory(Enum):
    """Catégories de conformité"""
    LEGAL = "legal"
    GOVERNANCE = "governance"
    FINANCIAL = "financial"
    OPERATIONAL = "operational"


class ComplianceStatus(Enum):
    """Statuts de conformité"""
    COMPLIANT = "compliant"
    NON_COMPLIANT = "non_compliant"
    PENDING = "pending"
    NOT_APPLICABLE = "not_applicable"


class RecommendationPriority(Enum):
    """Priorités des recommandations"""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class RecommendationStatus(Enum):
    """Statuts des recommandations"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DISMISSED = "dismissed"


class InsightType(Enum):
    """Types d'insights"""
    WARNING = "warning"
    OPPORTUNITY = "opportunity"
    SUGGESTION = "suggestion"
    ACHIEVEMENT = "achievement"


class OrganizationalDiagnostic(db.Model):
    """Diagnostic organisationnel d'une association"""
    __tablename__ = 'organizational_diagnostics'
    
    id = db.Column(db.String(36), primary_key=True)
    association_id = db.Column(db.String(36), db.ForeignKey('associations.id'), nullable=False)
    performed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    current_maturity_level = db.Column(db.Enum(MaturityLevel), nullable=False)
    target_maturity_level = db.Column(db.Enum(MaturityLevel), nullable=False)
    overall_score = db.Column(db.Float, nullable=False)
    
    # Scores par catégorie (JSON)
    category_scores = db.Column(JSON, nullable=False)  # {governance: 0.8, operations: 0.6, ...}
    
    # Points forts et faibles
    strengths = db.Column(JSON, nullable=False)  # ["Excellente gouvernance", ...]
    weaknesses = db.Column(JSON, nullable=False)  # ["Manque de documentation", ...]
    
    next_assessment_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    association = db.relationship('Association', backref='diagnostics')
    recommendations = db.relationship('Recommendation', backref='diagnostic', cascade='all, delete-orphan')
    compliance_checks = db.relationship('ComplianceCheck', backref='diagnostic', cascade='all, delete-orphan')
    insights = db.relationship('SmartInsight', backref='diagnostic', cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'association_id': self.association_id,
            'performed_at': self.performed_at.isoformat(),
            'current_maturity_level': self.current_maturity_level.value,
            'target_maturity_level': self.target_maturity_level.value,
            'overall_score': self.overall_score,
            'category_scores': self.category_scores,
            'strengths': self.strengths,
            'weaknesses': self.weaknesses,
            'next_assessment_date': self.next_assessment_date.isoformat(),
            'recommendations': [r.to_dict() for r in self.recommendations],
            'compliance_checks': [c.to_dict() for c in self.compliance_checks],
            'insights': [i.to_dict() for i in self.insights],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class ComplianceCheck(db.Model):
    """Vérifications de conformité"""
    __tablename__ = 'compliance_checks'
    
    id = db.Column(db.String(36), primary_key=True)
    diagnostic_id = db.Column(db.String(36), db.ForeignKey('organizational_diagnostics.id'), nullable=False)
    category = db.Column(db.Enum(ComplianceCategory), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    required = db.Column(db.Boolean, default=False)
    status = db.Column(db.Enum(ComplianceStatus), nullable=False)
    last_checked = db.Column(db.DateTime)
    next_deadline = db.Column(db.DateTime)
    
    # Documents et actions
    documents = db.Column(JSON)  # ["document1.pdf", "document2.pdf"]
    action_items = db.Column(JSON)  # ["Action 1", "Action 2"]
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'diagnostic_id': self.diagnostic_id,
            'category': self.category.value,
            'title': self.title,
            'description': self.description,
            'required': self.required,
            'status': self.status.value,
            'last_checked': self.last_checked.isoformat() if self.last_checked else None,
            'next_deadline': self.next_deadline.isoformat() if self.next_deadline else None,
            'documents': self.documents or [],
            'action_items': self.action_items or [],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Recommendation(db.Model):
    """Recommandations d'amélioration"""
    __tablename__ = 'recommendations'
    
    id = db.Column(db.String(36), primary_key=True)
    diagnostic_id = db.Column(db.String(36), db.ForeignKey('organizational_diagnostics.id'), nullable=False)
    priority = db.Column(db.Enum(RecommendationPriority), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Détails d'implémentation
    action_steps = db.Column(JSON, nullable=False)  # ["Étape 1", "Étape 2"]
    estimated_duration = db.Column(db.String(50))  # "2-4 semaines"
    resources = db.Column(JSON)  # ["Resource 1", "Resource 2"]
    impact = db.Column(db.Text)  # Description de l'impact attendu
    
    status = db.Column(db.Enum(RecommendationStatus), default=RecommendationStatus.PENDING)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'diagnostic_id': self.diagnostic_id,
            'priority': self.priority.value,
            'category': self.category,
            'title': self.title,
            'description': self.description,
            'action_steps': self.action_steps,
            'estimated_duration': self.estimated_duration,
            'resources': self.resources or [],
            'impact': self.impact,
            'status': self.status.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class SmartInsight(db.Model):
    """Insights intelligents générés par IA"""
    __tablename__ = 'smart_insights'
    
    id = db.Column(db.String(36), primary_key=True)
    diagnostic_id = db.Column(db.String(36), db.ForeignKey('organizational_diagnostics.id'), nullable=False)
    type = db.Column(db.Enum(InsightType), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.Integer, default=1)  # 1-5, 5 = plus prioritaire
    actionable = db.Column(db.Boolean, default=False)
    
    # Actions suggérées
    actions = db.Column(JSON)  # ["Action 1", "Action 2"]
    
    dismissed = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'diagnostic_id': self.diagnostic_id,
            'type': self.type.value,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'priority': self.priority,
            'actionable': self.actionable,
            'actions': self.actions or [],
            'dismissed': self.dismissed,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class DocumentTemplate(db.Model):
    """Templates de documents organisationnels"""
    __tablename__ = 'document_templates'
    
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # statuts, reglement, pv, rapport, etc.
    description = db.Column(db.Text)
    required = db.Column(db.Boolean, default=False)
    template_content = db.Column(db.Text, nullable=False)  # Contenu du template
    
    # Variables du template
    template_variables = db.Column(JSON)  # [{name, type, description, required, defaultValue}]
    
    # Métadonnées
    organization_types = db.Column(JSON)  # ["association", "cooperative", "ong"]
    maturity_level = db.Column(db.Enum(MaturityLevel), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'required': self.required,
            'template_content': self.template_content,
            'template_variables': self.template_variables or [],
            'organization_types': self.organization_types or [],
            'maturity_level': self.maturity_level.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class AIQuery(db.Model):
    """Historique des requêtes IA"""
    __tablename__ = 'ai_queries'
    
    id = db.Column(db.String(36), primary_key=True)
    association_id = db.Column(db.String(36), db.ForeignKey('associations.id'), nullable=False)
    diagnostic_id = db.Column(db.String(36), db.ForeignKey('organizational_diagnostics.id'))
    
    query = db.Column(db.Text, nullable=False)
    context = db.Column(JSON)  # {currentPage, userRole, maturityLevel}
    response = db.Column(db.Text, nullable=False)
    suggestions = db.Column(JSON)  # ["Suggestion 1", "Suggestion 2"]
    related_resources = db.Column(JSON)  # ["Resource 1", "Resource 2"]
    follow_up_questions = db.Column(JSON)  # ["Question 1", "Question 2"]
    confidence = db.Column(db.Float)  # 0.0 - 1.0
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    association = db.relationship('Association', backref='ai_queries')
    diagnostic = db.relationship('OrganizationalDiagnostic', backref='ai_queries')
    
    def to_dict(self):
        return {
            'id': self.id,
            'association_id': self.association_id,
            'diagnostic_id': self.diagnostic_id,
            'query': self.query,
            'context': self.context or {},
            'response': self.response,
            'suggestions': self.suggestions or [],
            'related_resources': self.related_resources or [],
            'follow_up_questions': self.follow_up_questions or [],
            'confidence': self.confidence,
            'created_at': self.created_at.isoformat()
        }
