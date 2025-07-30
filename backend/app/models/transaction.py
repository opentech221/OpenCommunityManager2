"""
Modèle de données pour les transactions financières
"""
from datetime import datetime
from enum import Enum
from app import db


class TransactionType(Enum):
    """Types de transactions"""
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"


class Transaction(db.Model):
    """Transaction financière d'une association"""
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    association_id = db.Column(db.Integer, db.ForeignKey('associations.id'), nullable=False)
    
    # Informations de base
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.Enum(TransactionType), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    
    # Métadonnées
    date = db.Column(db.Date, nullable=False)
    receipt = db.Column(db.String(255), nullable=True)  # Chemin vers le fichier reçu
    notes = db.Column(db.Text, nullable=True)
    
    # Métadonnées de suivi
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.String(255), nullable=True)  # ID du membre qui a créé
    
    # Relations
    association = db.relationship('Association', backref='transactions')
    
    def to_dict(self):
        """Convertir en dictionnaire pour l'API"""
        return {
            'id': self.id,
            'association_id': self.association_id,
            'description': self.description,
            'amount': self.amount,
            'type': self.type.value,
            'category': self.category,
            'date': self.date.isoformat(),
            'receipt': self.receipt,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'created_by': self.created_by
        }
    
    def __repr__(self):
        return f'<Transaction {self.id}: {self.description} - {self.amount}€>'
