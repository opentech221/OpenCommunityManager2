#!/usr/bin/env python3
"""
Script de test pour vérifier les routes CORS de l'API événements en production
"""

import requests
import json

# Configuration
PRODUCTION_URL = "https://opencommunitymanager2.up.railway.app"
FRONTEND_URL = "https://opencommunitymanager2.netlify.app"

def test_cors_preflight(method, endpoint, token=None):
    """Test une requête OPTIONS (CORS preflight)"""
    url = f"{PRODUCTION_URL}{endpoint}"
    
    headers = {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': method,
        'Access-Control-Request-Headers': 'authorization,content-type'
    }
    
    print(f"\n🧪 Test CORS preflight: {method} {endpoint}")
    print(f"URL: {url}")
    
    try:
        response = requests.options(url, headers=headers, timeout=10)
        
        print(f"Status: {response.status_code}")
        print(f"Headers CORS reçus:")
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        for key, value in cors_headers.items():
            print(f"  {key}: {value}")
        
        if response.text:
            try:
                data = response.json()
                print(f"Body: {json.dumps(data, indent=2)}")
            except:
                print(f"Body (text): {response.text}")
        
        return response.status_code == 200 or response.status_code == 204
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def test_actual_request(method, endpoint, token, data=None):
    """Test une vraie requête après preflight"""
    url = f"{PRODUCTION_URL}{endpoint}"
    
    headers = {
        'Origin': FRONTEND_URL,
        'Content-Type': 'application/json'
    }
    
    if token:
        headers['Authorization'] = f'Bearer {token}'
    
    print(f"\n🚀 Test requête réelle: {method} {endpoint}")
    
    try:
        if method == 'GET':
            response = requests.get(url, headers=headers, timeout=10)
        elif method == 'POST':
            response = requests.post(url, headers=headers, json=data, timeout=10)
        elif method == 'PUT':
            response = requests.put(url, headers=headers, json=data, timeout=10)
        elif method == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=10)
        
        print(f"Status: {response.status_code}")
        
        if response.text:
            try:
                data = response.json()
                print(f"Body: {json.dumps(data, indent=2)}")
            except:
                print(f"Body (text): {response.text}")
        
        return response.status_code < 400
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False

def main():
    print("🔍 Test des routes CORS pour les événements")
    print(f"Backend: {PRODUCTION_URL}")
    print(f"Frontend: {FRONTEND_URL}")
    
    # Token d'exemple (remplacer par un vrai token si disponible)
    test_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MzQ2NzA0OSwianRpIjoiYjY3NDAxMDMtZWY0Yy00ZTdmLWI3YTAtMjhjNDhkZWY1NTlhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjMiLCJuYmYiOjE3NTM0NjcwNDksImNzcmYiOiJhOWJjOTI2My1mMDg5LTRhM2ItYjE0My1iZDg5NDRhZDNjMmEifQ.VPodB_XxZX1k4VGq3Wut2zjtJGjr404P997mZ79knzU"
    
    tests = [
        # Tests de preflight CORS
        ("OPTIONS", "/api/events/", None),
        ("OPTIONS", "/api/events/5/", None),
        ("OPTIONS", "/api/events/test", None),
        
        # Tests de requêtes réelles
        ("GET", "/api/events/", test_token),
        ("DELETE", "/api/events/5/", test_token),
    ]
    
    results = []
    
    for method, endpoint, token in tests:
        if method == "OPTIONS":
            success = test_cors_preflight(method.replace("OPTIONS ", ""), endpoint, token)
        else:
            success = test_actual_request(method, endpoint, token)
        
        results.append((method, endpoint, success))
        print(f"{'✅' if success else '❌'} {method} {endpoint}")
    
    print("\n📊 Résumé des tests:")
    success_count = sum(1 for _, _, success in results if success)
    total_count = len(results)
    
    for method, endpoint, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"  {status} - {method} {endpoint}")
    
    print(f"\n🎯 Résultat: {success_count}/{total_count} tests réussis")
    
    if success_count < total_count:
        print("\n💡 Suggestions:")
        print("- Vérifier que le backend est déployé avec les dernières modifications")
        print("- Vérifier la configuration CORS dans app/__init__.py")
        print("- Vérifier que les routes OPTIONS sont bien définies")

if __name__ == "__main__":
    main()
