#!/usr/bin/env python3
"""
Script simple d'initialisation de la base de données
"""
import os
import sys
from datetime import datetime

# Ajouter le répertoire parent au chemin Python
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db

def init_database():
    """Initialise la base de données avec les tables de base"""
    app = create_app()
    
    with app.app_context():
        print("🚀 Initialisation de la base de données...")
        
        # Créer toutes les tables
        print("🏗️ Création des tables...")
        db.create_all()
        
        print("✅ Base de données initialisée avec succès !")
        print("📊 Tables créées dans la base de données")
        
        return True

if __name__ == "__main__":
    try:
        success = init_database()
        if success:
            print("\n🎉 Initialisation terminée ! Vous pouvez maintenant démarrer le serveur backend.")
        else:
            print("\n💥 Échec de l'initialisation.")
    except Exception as e:
        print(f"❌ Erreur : {e}")
        import traceback
        traceback.print_exc()
