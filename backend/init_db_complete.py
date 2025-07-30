#!/usr/bin/env python3
"""
Script d'initialisation complète de la base de données
Avec support des nouvelles tables et données de test
"""
import os
import sys
from datetime import datetime

# Ajouter le répertoire parent au chemin Python
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app import create_app, db
    from app.models.user import User
    from app.models.association import Association
    from app.models.transaction import Transaction, TransactionType
    from werkzeug.security import generate_password_hash
    
    def init_database():
        """Initialise la base de données avec les tables et données de base"""
        app = create_app()
        
        with app.app_context():
            print("🚀 Initialisation de la base de données...")
            
            # Supprimer et recréer toutes les tables
            print("📝 Suppression des anciennes tables...")
            db.drop_all()
            
            print("🏗️  Création des nouvelles tables...")
            db.create_all()
            
            # Créer une association de test
            print("🏢 Création de l'association de test...")
            test_association = Association(
                name="Association Test",
                description="Association de test pour le développement",
                address="123 Rue de Test",
                phone="0123456789",
                email="contact@associationtest.fr",
                website="https://associationtest.fr",
                siret="12345678901234",
                created_at=datetime.utcnow()
            )
            db.session.add(test_association)
            db.session.flush()  # Pour récupérer l'ID
            
            # Créer un utilisateur de test
            print("👤 Création de l'utilisateur de test...")
            test_user = User(
                first_name="Jean",
                last_name="Dupont",
                email="test@asso.com",
                password_hash=generate_password_hash("test123"),
                role="admin",
                association_id=test_association.id,
                phone="0123456789",
                address="123 Rue de Test",
                created_at=datetime.utcnow(),
                is_active=True
            )
            db.session.add(test_user)
            
            # Créer quelques transactions de test
            print("💰 Création des transactions de test...")
            test_transactions = [
                Transaction(
                    description="Cotisation annuelle membre 1",
                    amount=150.00,
                    type=TransactionType.INCOME,
                    category="Cotisations",
                    date=datetime.utcnow(),
                    association_id=test_association.id,
                    notes="Paiement par virement bancaire"
                ),
                Transaction(
                    description="Achat matériel événement",
                    amount=85.50,
                    type=TransactionType.EXPENSE,
                    category="Matériel",
                    date=datetime.utcnow(),
                    association_id=test_association.id,
                    notes="Facture n° F2025-001"
                ),
                Transaction(
                    description="Subvention municipale",
                    amount=500.00,
                    type=TransactionType.INCOME,
                    category="Subventions",
                    date=datetime.utcnow(),
                    association_id=test_association.id,
                    notes="Subvention pour activités 2025"
                ),
                Transaction(
                    description="Frais de communication",
                    amount=45.00,
                    type=TransactionType.EXPENSE,
                    category="Communication",
                    date=datetime.utcnow(),
                    association_id=test_association.id,
                    notes="Impression flyers événement"
                )
            ]
            
            for transaction in test_transactions:
                db.session.add(transaction)
            
            # Valider toutes les modifications
            db.session.commit()
            
            print("✅ Base de données initialisée avec succès !")
            print(f"📊 Données créées :")
            print(f"   - 1 Association de test (ID: {test_association.id})")
            print(f"   - 1 Utilisateur de test (email: test@asso.com, mot de passe: test123)")
            print(f"   - {len(test_transactions)} Transactions de test")
            
            # Afficher un résumé des données
            total_income = sum(t.amount for t in test_transactions if t.type == TransactionType.INCOME)
            total_expense = sum(t.amount for t in test_transactions if t.type == TransactionType.EXPENSE)
            balance = total_income - total_expense
            
            print(f"💼 Résumé financier :")
            print(f"   - Recettes : {total_income:.2f}€")
            print(f"   - Dépenses : {total_expense:.2f}€")
            print(f"   - Balance : {balance:.2f}€")
            
            return True
            
except Exception as e:
    print(f"❌ Erreur lors de l'initialisation : {e}")
    import traceback
    traceback.print_exc()
    
    def init_database():
        return False

if __name__ == "__main__":
    success = init_database()
    if success:
        print("\n🎉 Initialisation terminée ! Vous pouvez maintenant démarrer le serveur backend.")
        sys.exit(0)
    else:
        print("\n💥 Échec de l'initialisation.")
        sys.exit(1)
