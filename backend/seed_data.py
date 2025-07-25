#!/usr/bin/env python3
"""
Script pour peupler la base de données avec des données réelles d'exemple
"""

import os
import sys
from datetime import datetime, timedelta

# Ajouter le répertoire parent au path pour importer l'app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db, bcrypt
from app.models.association import Association
from app.models.member import Member
from app.models.event import Event
from app.models.cotisation import Cotisation

def seed_database():
    """Peuple la base de données avec des données d'exemple"""
    
    app = create_app()
    
    with app.app_context():
        print("🌱 Début du peuplement de la base de données...")
        
        # Nettoyer les données existantes (optionnel)
        print("🧹 Nettoyage des données existantes...")
        db.session.query(Cotisation).delete()
        db.session.query(Event).delete()
        db.session.query(Member).delete()
        db.session.query(Association).delete()
        db.session.commit()
        
        # 1. Créer une association d'exemple
        print("🏢 Création de l'association...")
        association = Association(
            name="Association des Jeunes de Pikine",
            sigle="AJP",
            email="contact@ajpikine.sn",
            phone="+221 77 123 45 67",
            password_hash=bcrypt.generate_password_hash("admin2024").decode('utf-8'),
            description="Association de développement communautaire à Pikine",
            address="Quartier Pikine Ouest, Rue 5, Dakar, Sénégal",
            logo=None
        )
        db.session.add(association)
        db.session.flush()  # Pour obtenir l'ID
        
        # 2. Créer des membres réalistes
        print("👥 Création des membres...")
        membres_data = [
            {
                "first_name": "Aminata", "last_name": "Diallo", 
                "email": "aminata.diallo@gmail.com", "phone": "+221 77 555 0001",
                "role": "PRESIDENT", "status": "ACTIVE"
            },
            {
                "first_name": "Mamadou", "last_name": "Ba", 
                "email": "mamadou.ba@gmail.com", "phone": "+221 78 555 0002",
                "role": "VICE_PRESIDENT", "status": "ACTIVE"
            },
            {
                "first_name": "Fatou", "last_name": "Camara", 
                "email": "fatou.camara@gmail.com", "phone": "+221 76 555 0003",
                "role": "SECRETARY", "status": "ACTIVE"
            },
            {
                "first_name": "Ousmane", "last_name": "Ndiaye", 
                "email": "ousmane.ndiaye@gmail.com", "phone": "+221 77 555 0004",
                "role": "TREASURER", "status": "ACTIVE"
            },
            {
                "first_name": "Aïssa", "last_name": "Sow", 
                "email": "aissa.sow@gmail.com", "phone": "+221 78 555 0005",
                "role": "MEMBER", "status": "ACTIVE"
            },
            {
                "first_name": "Ibrahima", "last_name": "Fall", 
                "email": "ibrahima.fall@gmail.com", "phone": "+221 76 555 0006",
                "role": "MEMBER", "status": "ACTIVE"
            },
            {
                "first_name": "Mariama", "last_name": "Sy", 
                "email": "mariama.sy@gmail.com", "phone": "+221 77 555 0007",
                "role": "MEMBER", "status": "ACTIVE"
            },
            {
                "first_name": "Cheikh", "last_name": "Gueye", 
                "email": "cheikh.gueye@gmail.com", "phone": "+221 78 555 0008",
                "role": "MEMBER", "status": "SUSPENDED"
            },
            {
                "first_name": "Ndèye", "last_name": "Mbaye", 
                "email": "ndeye.mbaye@gmail.com", "phone": "+221 76 555 0009",
                "role": "MEMBER", "status": "ACTIVE"
            },
            {
                "first_name": "Moussa", "last_name": "Diop", 
                "email": "moussa.diop@gmail.com", "phone": "+221 77 555 0010",
                "role": "MEMBER", "status": "INACTIVE"
            }
        ]
        
        membres = []
        for membre_data in membres_data:
            membre = Member(
                first_name=membre_data["first_name"],
                last_name=membre_data["last_name"],
                email=membre_data["email"],
                phone=membre_data["phone"],
                role=membre_data["role"],
                status=membre_data["status"],
                join_date=datetime.now() - timedelta(days=365 * 2),  # Membres depuis 2 ans
                association_id=association.id
            )
            membres.append(membre)
            db.session.add(membre)
        
        db.session.flush()
        
        # 4. Créer des événements réalistes
        print("📅 Création des événements...")
        events_data = [
            {
                "title": "Assemblée Générale Annuelle 2024",
                "description": "Assemblée générale ordinaire pour l'élection du nouveau bureau et le bilan de l'année",
                "start_date": datetime(2024, 3, 15, 9, 0),
                "end_date": datetime(2024, 3, 15, 17, 0),
                "location": "Centre communautaire de Pikine",
                "event_type": "MEETING",
                "status": "COMPLETED",
                "max_participants": 50
            },
            {
                "title": "Formation en entrepreneuriat",
                "description": "Formation sur la création d'entreprise et la gestion financière pour les jeunes",
                "start_date": datetime(2024, 6, 20, 8, 0),
                "end_date": datetime(2024, 6, 22, 18, 0),
                "location": "Salle de formation AJP",
                "event_type": "TRAINING",
                "status": "COMPLETED",
                "max_participants": 30
            },
            {
                "title": "Journée de reboisement",
                "description": "Plantation d'arbres dans le quartier pour lutter contre la déforestation",
                "start_date": datetime(2024, 8, 10, 7, 0),
                "end_date": datetime(2024, 8, 10, 16, 0),
                "location": "Parc municipal de Pikine",
                "event_type": "COMMUNITY",
                "status": "COMPLETED",
                "max_participants": 100
            },
            {
                "title": "Tournoi de football des jeunes",
                "description": "Compétition sportive inter-quartiers pour promouvoir la cohésion sociale",
                "start_date": datetime(2025, 8, 5, 8, 0),
                "end_date": datetime(2025, 8, 5, 18, 0),
                "location": "Terrain de football de Pikine",
                "event_type": "SPORT",
                "status": "PLANNED",
                "max_participants": 200
            },
            {
                "title": "Conférence sur l'hygiène et la santé",
                "description": "Sensibilisation sur les bonnes pratiques d'hygiène et de prévention sanitaire",
                "start_date": datetime(2025, 9, 12, 14, 0),
                "end_date": datetime(2025, 9, 12, 17, 0),
                "location": "École primaire Pikine 2",
                "event_type": "HEALTH",
                "status": "PLANNED",
                "max_participants": 80
            }
        ]
        
        for event_data in events_data:
            event = Event(
                title=event_data["title"],
                description=event_data["description"],
                start_date=event_data["start_date"],
                end_date=event_data["end_date"],
                location=event_data["location"],
                event_type=event_data["event_type"],
                status=event_data["status"],
                max_participants=event_data["max_participants"],
                association_id=association.id,
                created_by=membres[0].id  # Créé par le président
            )
            db.session.add(event)
        
        # 5. Créer des cotisations réalistes
        print("💰 Création des cotisations...")
        
        # Cotisations pour l'année 2024 (complètes)
        for i, membre in enumerate(membres):
            # Cotisation 2024
            cotisation_2024 = Cotisation(
                member_id=membre.id,
                amount=25000 if membre.role in ["PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER"] else 15000,  # FCFA
                payment_date=datetime(2024, 1, 15) + timedelta(days=i*7),  # Paiements échelonnés
                payment_method="MOBILE_MONEY" if i % 3 == 0 else "CASH" if i % 3 == 1 else "BANK_TRANSFER",
                status="PAID",
                year=2024,
                notes=f"Cotisation annuelle 2024 - {membre.first_name} {membre.last_name}"
            )
            db.session.add(cotisation_2024)
        
        # Cotisations pour l'année 2025 (en cours)
        for i, membre in enumerate(membres):
            if membre.status == "ACTIVE":
                # Statut varié pour 2025
                if i < 4:  # Les 4 premiers ont payé
                    status = "PAID"
                    payment_date = datetime(2025, 1, 10) + timedelta(days=i*5)
                elif i < 7:  # Les suivants sont en attente
                    status = "PENDING"
                    payment_date = datetime(2025, 7, 1)  # Date prévue de paiement
                else:  # Les derniers sont en retard
                    status = "OVERDUE"
                    payment_date = datetime(2024, 12, 31)  # Date limite dépassée
                
                cotisation_2025 = Cotisation(
                    member_id=membre.id,
                    amount=30000 if membre.role in ["PRESIDENT", "VICE_PRESIDENT", "SECRETARY", "TREASURER"] else 20000,  # Augmentation pour 2025
                    payment_date=payment_date,
                    payment_method="MOBILE_MONEY" if i % 3 == 0 else "CASH" if i % 3 == 1 else "BANK_TRANSFER",
                    status=status,
                    year=2025,
                    notes=f"Cotisation annuelle 2025 - {membre.first_name} {membre.last_name}"
                )
                db.session.add(cotisation_2025)
        
        # Sauvegarder toutes les données
        print("💾 Sauvegarde des données...")
        db.session.commit()
        
        # Afficher un résumé
        print("\n✅ Peuplement terminé avec succès !")
        print(f"📊 Données créées :")
        print(f"   • 1 association : {association.name}")
        print(f"   • {len(membres)} membres")
        print(f"   • {len(events_data)} événements")
        print(f"   • {len(membres) * 2 - 3} cotisations (2024 + 2025)")  # -3 car 3 membres inactifs n'ont pas de cotisation 2025
        
        print(f"\n🔐 Connexion association :")
        print(f"   Email: contact@ajpikine.sn")
        print(f"   Mot de passe: admin2024")
        
        return True

if __name__ == "__main__":
    try:
        success = seed_database()
        if success:
            print("\n🎉 Base de données peuplée avec succès !")
        else:
            print("\n❌ Erreur lors du peuplement de la base de données")
            sys.exit(1)
    except Exception as e:
        print(f"\n💥 Erreur fatale : {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
