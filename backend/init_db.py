#!/usr/bin/env python3
"""Script d'initialisation de la base de données"""

import os
import sys
import uuid
from datetime import datetime

# Ajouter le répertoire racine au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configuration explicite pour le développement local
os.environ['DATABASE_URL'] = f'sqlite:///{os.path.abspath("instance/app.db")}'

from app import create_app, db

def init_database():
    """Initialiser la base de données avec toutes les tables"""
    print("🚀 Initialisation de la base de données...")
    
    try:
        app = create_app()
        with app.app_context():
            print(f"📍 URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
            
            # Supprimer toutes les tables existantes
            print("🗑️  Suppression des tables existantes...")
            db.drop_all()
            
            # Créer toutes les tables
            print("📊 Création de toutes les tables...")
            db.create_all()
            
            # Vérifier les tables créées
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"✅ Tables créées: {tables}")
            
            # Créer quelques données de test pour le système de guidance
            from app.models.guidance import DocumentTemplate, OrganizationalDiagnostic
            from app.models.guidance import MaturityLevel  # Import de l'enum
            from app.models.association import Association
            
            # Créer une association de test si elle n'existe pas
            association = Association.query.first()
            if not association:
                print("👥 Création d'une association de test...")
                association = Association(
                    name="Association Test",
                    description="Association pour tester le système de guidance",
                    email="test@example.com",
                    phone="0123456789",
                    address="123 Rue Test, 75001 Paris",
                    password_hash="test_hash"  # Normalement hashé
                )
                db.session.add(association)
                db.session.commit()
                print(f"✅ Association créée avec ID: {association.id}")
            
            # Créer quelques templates de documents
            templates = [
                {
                    'name': 'Procès-verbal d\'Assemblée Générale',
                    'category': 'governance',
                    'description': 'Template pour les PV d\'AG',
                    'template_content': '# Procès-verbal de l\'Assemblée Générale\n\n**Date:** {{date}}\n**Lieu:** {{lieu}}\n**Présents:** {{participants}}\n\n## Ordre du jour\n\n{{ordre_du_jour}}\n\n## Décisions prises\n\n{{decisions}}',
                    'template_variables': [
                        {"name": "date", "type": "date", "description": "Date de l'AG", "required": True},
                        {"name": "lieu", "type": "text", "description": "Lieu de l'AG", "required": True},
                        {"name": "participants", "type": "textarea", "description": "Liste des participants", "required": True},
                        {"name": "ordre_du_jour", "type": "textarea", "description": "Points à l'ordre du jour", "required": True},
                        {"name": "decisions", "type": "textarea", "description": "Décisions prises", "required": True}
                    ],
                    'organization_types': ["association", "cooperative"],
                    'maturity_level': MaturityLevel.STRUCTURE,
                    'required': True
                },
                {
                    'name': 'Rapport d\'activité annuel',
                    'category': 'reporting',
                    'description': 'Template pour le rapport d\'activité',
                    'template_content': '# Rapport d\'activité {{annee}}\n\n## Activités réalisées\n\n{{activites}}\n\n## Bilan financier\n\n{{bilan}}\n\n## Perspectives\n\n{{perspectives}}',
                    'template_variables': [
                        {"name": "annee", "type": "number", "description": "Année du rapport", "required": True},
                        {"name": "activites", "type": "textarea", "description": "Activités réalisées", "required": True},
                        {"name": "bilan", "type": "textarea", "description": "Bilan financier", "required": True},
                        {"name": "perspectives", "type": "textarea", "description": "Perspectives", "required": False}
                    ],
                    'organization_types': ["association", "cooperative", "ong"],
                    'maturity_level': MaturityLevel.EMERGENT,
                    'required': False
                },
                {
                    'name': 'Demande de subvention',
                    'category': 'funding',
                    'description': 'Template pour les demandes de subvention',
                    'template_content': '# Demande de subvention\n\n**Organisme:** {{organisme}}\n**Montant demandé:** {{montant}}\n**Projet:** {{projet}}\n\n## Description du projet\n\n{{description}}\n\n## Budget prévisionnel\n\n{{budget}}',
                    'template_variables': [
                        {"name": "organisme", "type": "text", "description": "Organisme demandeur", "required": True},
                        {"name": "montant", "type": "number", "description": "Montant demandé", "required": True},
                        {"name": "projet", "type": "text", "description": "Nom du projet", "required": True},
                        {"name": "description", "type": "textarea", "description": "Description du projet", "required": True},
                        {"name": "budget", "type": "textarea", "description": "Budget prévisionnel", "required": True}
                    ],
                    'organization_types': ["association", "ong"],
                    'maturity_level': MaturityLevel.ORGANISE,
                    'required': False
                }
            ]
            
            for template_data in templates:
                existing = DocumentTemplate.query.filter_by(name=template_data['name']).first()
                if not existing:
                    template_data['id'] = str(uuid.uuid4())  # Générer un UUID
                    template = DocumentTemplate(**template_data)
                    db.session.add(template)
            
            # Créer un diagnostic de test
            existing_diag = OrganizationalDiagnostic.query.filter_by(association_id=association.id).first()
            if not existing_diag:
                print("📋 Création d'un diagnostic de test...")
                from datetime import datetime, timedelta
                
                diagnostic = OrganizationalDiagnostic(
                    id=str(uuid.uuid4()),  # Générer un UUID
                    association_id=association.id,
                    current_maturity_level=MaturityLevel.STRUCTURE,
                    target_maturity_level=MaturityLevel.ORGANISE,
                    overall_score=7.2,
                    category_scores={"governance": 7, "finances": 8, "communication": 6, "events": 9, "compliance": 5},
                    strengths=["Excellente gestion des événements", "Bonne situation financière", "Équipe motivée"],
                    weaknesses=["Conformité réglementaire à améliorer", "Communication externe limitée", "Documentation manquante"],
                    next_assessment_date=datetime.utcnow() + timedelta(days=365)  # Dans un an
                )
                db.session.add(diagnostic)
            
            db.session.commit()
            print("✅ Données de test créées")
            
            print("\n🎯 Base de données initialisée avec succès!")
            print(f"📊 Total de tables: {len(tables)}")
            print("🔗 Le système de guidance est prêt à être utilisé!")
            
            return True
            
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = init_database()
    
    if success:
        print("\n✅ Vous pouvez maintenant démarrer le serveur avec: python run.py")
    else:
        print("\n❌ Échec de l'initialisation - vérifiez les erreurs ci-dessus")
