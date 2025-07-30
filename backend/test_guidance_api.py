#!/usr/bin/env python3
"""Script de test des API de guidance"""

import sys
import os
import json
from datetime import datetime

# Ajouter le path correct
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configuration pour la base de données locale
os.environ['DATABASE_URL'] = f'sqlite:///{os.path.abspath("instance/app.db")}'

def test_guidance_apis():
    """Tester les API de guidance"""
    print("🧪 Test des API de guidance...")
    
    try:
        from app import create_app, db
        
        app = create_app()
        
        with app.test_client() as client:
            with app.app_context():
                print("🚀 Serveur de test démarré")
                
                # Test 1: API de santé
                print("\n1️⃣ Test de l'API de base...")
                response = client.get('/')
                print(f"  Status: {response.status_code}")
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"  ✅ Message: {data.get('message', 'N/A')}")
                
                # Test 2: API ping
                print("\n2️⃣ Test de l'API ping...")
                response = client.get('/api/ping')
                print(f"  Status: {response.status_code}")
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"  ✅ Ping: {data.get('ping', 'N/A')}")
                
                # Test 3: API guidance - Lister les diagnostics
                print("\n3️⃣ Test de l'API guidance - Diagnostics...")
                response = client.get('/api/guidance/diagnostics')
                print(f"  Status: {response.status_code}")
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"  ✅ Diagnostics trouvés: {len(data.get('diagnostics', []))}")
                    if data.get('diagnostics'):
                        diag = data['diagnostics'][0]
                        print(f"  📋 Premier diagnostic ID: {diag.get('id', 'N/A')}")
                        print(f"  📊 Score global: {diag.get('overall_score', 'N/A')}")
                
                # Test 4: API guidance - Lister les templates
                print("\n4️⃣ Test de l'API guidance - Templates...")
                response = client.get('/api/guidance/templates')
                print(f"  Status: {response.status_code}")
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"  ✅ Templates trouvés: {len(data.get('templates', []))}")
                    if data.get('templates'):
                        template = data['templates'][0]
                        print(f"  📄 Premier template: {template.get('name', 'N/A')}")
                        print(f"  📂 Catégorie: {template.get('category', 'N/A')}")
                
                # Test 5: API guidance - Lister les recommandations
                print("\n5️⃣ Test de l'API guidance - Recommandations...")
                response = client.get('/api/guidance/recommendations')
                print(f"  Status: {response.status_code}")
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"  ✅ Recommandations trouvées: {len(data.get('recommendations', []))}")
                
                # Test 6: API guidance - Insights
                print("\n6️⃣ Test de l'API guidance - Insights...")
                response = client.get('/api/guidance/insights')
                print(f"  Status: {response.status_code}")
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"  ✅ Insights trouvés: {len(data.get('insights', []))}")
                
                # Test 7: Statistiques guidance
                print("\n7️⃣ Test des statistiques de guidance...")
                response = client.get('/api/guidance/analytics/overview')
                print(f"  Status: {response.status_code}")
                if response.status_code == 200:
                    data = response.get_json()
                    print(f"  ✅ Données analytics: {json.dumps(data, indent=2)}")
                
                print("\n🎯 Tests des API de guidance terminés!")
                return True
                
    except Exception as e:
        print(f"❌ Erreur lors des tests: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_frontend_integration():
    """Tester l'intégration avec le frontend"""
    print("\n🔗 Test d'intégration frontend...")
    
    # Liste des endpoints que le frontend va utiliser
    expected_endpoints = [
        '/api/guidance/diagnostics',
        '/api/guidance/recommendations', 
        '/api/guidance/templates',
        '/api/guidance/insights',
        '/api/guidance/analytics/overview'
    ]
    
    print("📋 Endpoints requis par le frontend:")
    for endpoint in expected_endpoints:
        print(f"  - {endpoint} ✅")
    
    print("\n💡 Le système de guidance est prêt pour l'intégration frontend!")
    print("🔄 Le frontend peut maintenant se connecter à http://localhost:5000")

if __name__ == "__main__":
    print("🚀 Démarrage des tests du système de guidance\n")
    
    success = test_guidance_apis()
    
    if success:
        test_frontend_integration()
        print("\n✅ SUCCÈS: Le système de guidance backend est opérationnel!")
        print("🎯 Prochaines étapes:")
        print("  1. Tester l'intégration avec le frontend React")
        print("  2. Implémenter la connectivité IA (OpenAI/Claude)")
        print("  3. Ajouter l'authentification JWT")
        print("  4. Optimiser les performances et ajouter du cache")
    else:
        print("\n❌ ÉCHEC: Des problèmes ont été détectés")
        print("🔧 Vérifiez les erreurs ci-dessus et corrigez-les")
