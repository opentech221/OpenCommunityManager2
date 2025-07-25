#!/usr/bin/env python3
"""
Script pour découvrir la bonne URL de production sur Railway
"""

import requests

# Différentes URLs possibles pour Railway
possible_urls = [
    "https://opencommunitymanager2.up.railway.app"
]

print("🔍 Recherche de l'URL de production...")

for url in possible_urls:
    try:
        print(f"\n🌐 Test de: {url}")
        response = requests.get(f"{url}/api/events/test", timeout=5)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            print(f"   ✅ TROUVÉ! URL valide: {url}")
            print(f"   Réponse: {response.text[:200]}")
            break
        elif response.status_code != 404:
            print(f"   ⚠️  Status différent de 404: {response.text[:100]}")
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Erreur de connexion: {str(e)[:100]}")
    except Exception as e:
        print(f"   ❌ Erreur: {str(e)[:100]}")

print("\n📝 Essayez aussi de vérifier:")
print("   1. Les variables d'environnement Railway")
print("   2. Les logs de déploiement Railway")
print("   3. Le dashboard Railway pour l'URL correcte")
