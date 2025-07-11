from datetime import datetime
from app import db

class Member(db.Model):
    __tablename__ = 'members'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='MEMBER')
    status = db.Column(db.String(20), nullable=False, default='ACTIVE')
    join_date = db.Column(db.DateTime, default=datetime.utcnow)
    association_id = db.Column(db.Integer, db.ForeignKey('associations.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relations
    cotisations = db.relationship('Cotisation', backref='member', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Member {self.first_name} {self.last_name}>'
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'status': self.status,
            'joinDate': self.join_date.isoformat() if self.join_date else None,
            'associationId': str(self.association_id),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def to_dict(self):
        """Convertir l'objet en dictionnaire pour la sérialisation JSON"""
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'birth_date': self.birth_date.isoformat() if self.birth_date else None,
            'role': self.role,
            'status': self.status,
            'join_date': self.join_date.isoformat() if self.join_date else None,
            'association_id': self.association_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
