#!/usr/bin/env python3
"""
Script de test rapide pour valider le backend
"""
import os
import sys

# Ajouter le répertoire parent au chemin Python
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test des imports principaux"""
    try:
        print("🔍 Test des imports...")
        
        # Test de l'application
        from app import create_app, db
        print("✅ Application Flask importée")
        
        # Test des modèles
        from app.models.transaction import Transaction, TransactionType
        print("✅ Modèle Transaction importé")
        
        # Test des routes
        from app.routes.finances import finances_bp
        print("✅ Routes finances importées")
        
        # Test de création de l'app
        app = create_app()
        print("✅ Application Flask créée")
        
        with app.app_context():
            # Test de la base de données
            db.create_all()
            print("✅ Tables de base de données créées")
            
            # Test de création d'une transaction
            test_transaction = Transaction(
                description="Test transaction",
                amount=100.0,
                type=TransactionType.INCOME,
                category="Test",
                association_id=1
            )
            print("✅ Transaction de test créée")
        
        print("\n🎉 Tous les tests d'import ont réussi !")
        print("📝 Le backend est prêt à être démarré avec: python run.py")
        return True
        
    except Exception as e:
        print(f"❌ Erreur lors du test : {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_imports()
    if not success:
        sys.exit(1)
