from datetime import datetime
from app import db

class Cotisation(db.Model):
    __tablename__ = 'cotisations'
    
    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id'), nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_date = db.Column(db.DateTime, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False, default='CASH')
    status = db.Column(db.String(20), nullable=False, default='PENDING')
    year = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Cotisation {self.member_id} - {self.year}>'
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'memberId': str(self.member_id),
            'amount': float(self.amount),
            'paymentDate': self.payment_date.isoformat() if self.payment_date else None,
            'paymentMethod': self.payment_method,
            'status': self.status,
            'year': self.year,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def to_dict(self):
        """Convertir l'objet en dictionnaire pour la sérialisation JSON"""
        return {
            'id': self.id,
            'member_id': self.member_id,
            'amount': float(self.amount) if self.amount else None,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'payment_method': self.payment_method,
            'status': self.status,
            'year': self.year,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
