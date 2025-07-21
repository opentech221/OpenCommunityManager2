from datetime import datetime
from app import db

class Association(db.Model):
    __tablename__ = 'associations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    sigle = db.Column(db.String(20), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    logo = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    address = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.timezone.utc)
    updated_at = db.Column(db.DateTime, default=datetime.timezone.utc, onupdate=datetime.timezone.utc)
    
    # Relations
    members = db.relationship('Member', backref='association', lazy=True, cascade='all, delete-orphan')
    events = db.relationship('Event', backref='association', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Association {self.name}>'
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'sigle': self.sigle,
            'email': self.email,
            'phone': self.phone,
            'logo': self.logo,
            'description': self.description,
            'address': self.address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
