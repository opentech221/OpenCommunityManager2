from datetime import datetime
from app import db

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=True)
    location = db.Column(db.String(255), nullable=False)
    event_type = db.Column(db.String(50), nullable=False, default='OTHER')
    status = db.Column(db.String(20), nullable=False, default='PLANNED')
    max_participants = db.Column(db.Integer, nullable=True)
    association_id = db.Column(db.Integer, db.ForeignKey('associations.id'), nullable=False)
    created_by = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Event {self.title}>'
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'title': self.title,
            'description': self.description,
            'startDate': self.start_date.isoformat() if self.start_date else None,
            'endDate': self.end_date.isoformat() if self.end_date else None,
            'location': self.location,
            'type': self.event_type,
            'status': self.status,
            'maxParticipants': self.max_participants,
            'associationId': str(self.association_id),
            'createdBy': self.created_by,
            'participants': [],  # À implémenter plus tard
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def to_dict(self):
        """Convertir l'objet en dictionnaire pour la sérialisation JSON"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'location': self.location,
            'event_type': self.event_type,
            'status': self.status,
            'max_participants': self.max_participants,
            'association_id': self.association_id,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
