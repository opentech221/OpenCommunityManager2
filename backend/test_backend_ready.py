#!/usr/bin/env python3
"""
Test rapide du backend après initialisation de la base de données
"""
import os
import sys
from datetime import datetime

# Ajouter le répertoire parent au chemin Python
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_backend():
    """Test rapide du backend"""
    try:
        print("🔍 Test du backend après initialisation...")
        
        # Test d'import de l'application
        from app import create_app, db
        app = create_app()
        
        with app.app_context():
            # Test de connexion à la base de données
            print("📊 Test de connexion à la base de données...")
            from app.models.transaction import Transaction, TransactionType
            
            # Compter les transactions existantes
            transaction_count = Transaction.query.count()
            print(f"✅ {transaction_count} transactions trouvées dans la base")
            
            # Test de création d'une transaction test
            print("💰 Test de création d'une transaction...")
            test_transaction = Transaction(
                description="Transaction de test API",
                amount=150.0,
                type=TransactionType.INCOME,
                category="Test",
                association_id=1,
                date=datetime.utcnow()
            )
            
            db.session.add(test_transaction)
            db.session.commit()
            
            print(f"✅ Transaction créée avec ID: {test_transaction.id}")
            
            # Test de récupération
            transactions = Transaction.query.all()
            print(f"📊 Total transactions après test: {len(transactions)}")
            
            # Test des routes
            print("🔗 Test d'import des routes...")
            from app.routes.finances import finances_bp
            print("✅ Routes finances importées")
            
        print("\n🎉 Backend validé et opérationnel !")
        print("🚀 Prêt pour les tests d'intégration frontend/backend")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_backend()
    if success:
        print("\n✨ Backend prêt ! Vous pouvez maintenant:")
        print("1. Démarrer le serveur: python run.py")
        print("2. Tester l'API: python test_finances_api.py")
        print("3. Lancer le frontend et tester l'intégration complète")
    else:
        print("\n💥 Problème détecté dans le backend")
        sys.exit(1)
