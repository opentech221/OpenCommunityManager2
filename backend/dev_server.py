#!/usr/bin/env python3
"""Script de démarrage du serveur de développement"""

import sys
import os

# Ajouter le path correct
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configuration pour la base de données locale
os.environ['DATABASE_URL'] = f'sqlite:///{os.path.abspath("instance/app.db")}'

def start_dev_server():
    """Démarrer le serveur de développement"""
    print("🚀 Démarrage du serveur de développement...")
    print("📍 URL de base de données:", os.environ['DATABASE_URL'])
    
    try:
        from app import create_app
        
        app = create_app()
        
        print("✅ Application Flask créée avec succès")
        print("🔗 API de guidance disponibles sur:")
        print("  - http://localhost:5000/api/guidance/diagnostics")
        print("  - http://localhost:5000/api/guidance/recommendations")
        print("  - http://localhost:5000/api/guidance/templates")
        print("  - http://localhost:5000/api/guidance/insights")
        print("  - http://localhost:5000/api/guidance/analytics/overview")
        print("\n🌐 Serveur en écoute sur http://localhost:5000")
        print("🔄 Mode debug activé - Le serveur redémarrera automatiquement")
        print("⏹️  Ctrl+C pour arrêter le serveur\n")
        
        # Configuration pour le développement local
        app.config['CORS_ORIGINS'] = ['http://localhost:5173', 'http://localhost:3000']
        
        app.run(
            debug=True,
            host='0.0.0.0',
            port=5000,
            use_reloader=True
        )
        
    except Exception as e:
        print(f"❌ Erreur lors du démarrage: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    start_dev_server()
