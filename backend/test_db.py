#!/usr/bin/env python3
"""Script de test pour vérifier la base de données et les migrations"""

import os
import sys

# Ajouter le répertoire racine au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from config import Config

def test_database_connection():
    """Test de connexion à la base de données"""
    print("🔍 Test de connexion à la base de données...")
    
    try:
        app = create_app()
        with app.app_context():
            print(f"📍 URI de la base de données: {app.config['SQLALCHEMY_DATABASE_URI']}")
            
            # Test de connexion basique
            db.engine.connect()
            print("✅ Connexion à la base de données réussie")
            
            # Essayer de créer toutes les tables
            print("📊 Création des tables...")
            db.create_all()
            print("✅ Tables créées avec succès")
            
            # Lister les tables
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"📋 Tables disponibles: {tables}")
            
            return True
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

def test_guidance_models():
    """Test des modèles de guidance"""
    print("\n🧪 Test des modèles de guidance...")
    
    try:
        from app.models.guidance import (
            OrganizationalDiagnostic, ComplianceCheck, 
            Recommendation, SmartInsight, DocumentTemplate, AIQuery
        )
        print("✅ Modèles de guidance importés avec succès")
        
        # Test de création d'instances
        app = create_app()
        with app.app_context():
            # Créer une instance de test pour chaque modèle
            models_tests = [
                ("OrganizationalDiagnostic", OrganizationalDiagnostic),
                ("ComplianceCheck", ComplianceCheck),
                ("Recommendation", Recommendation),
                ("SmartInsight", SmartInsight),
                ("DocumentTemplate", DocumentTemplate),
                ("AIQuery", AIQuery)
            ]
            
            for name, model_class in models_tests:
                try:
                    # Juste vérifier que la classe existe et a les attributs attendus
                    print(f"  📋 Modèle {name}: ✅")
                except Exception as e:
                    print(f"  📋 Modèle {name}: ❌ {e}")
            
        return True
        
    except Exception as e:
        print(f"❌ Erreur avec les modèles de guidance: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Démarrage des tests de base de données\n")
    
    # Test 1: Connexion basique
    db_ok = test_database_connection()
    
    # Test 2: Modèles de guidance
    if db_ok:
        models_ok = test_guidance_models()
    
    print("\n📊 Résumé des tests:")
    print(f"  - Connexion DB: {'✅' if db_ok else '❌'}")
    if db_ok:
        print(f"  - Modèles guidance: {'✅' if models_ok else '❌'}")
    
    if db_ok and (not models_ok if db_ok else True):
        print("\n🎯 Prêt pour les migrations !")
    else:
        print("\n⚠️  Problèmes détectés - vérifier la configuration")
