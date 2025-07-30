#!/usr/bin/env python3
"""
Script de test pour valider l'intégration backend Finances
Tests de l'API REST pour les transactions financières
"""
import sys
import json
from datetime import datetime, date
import requests

API_BASE_URL = 'http://localhost:5000/api'

class FinanceAPITester:
    def __init__(self):
        self.token = None
        self.session = requests.Session()
        
    def login_test_user(self):
        """Connexion avec un utilisateur de test"""
        login_data = {
            'email': 'test@asso.com',
            'password': 'test123'
        }
        
        try:
            response = self.session.post(f'{API_BASE_URL}/auth/login', json=login_data)
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                self.session.headers.update({'Authorization': f'Bearer {self.token}'})
                print("✅ Connexion réussie")
                return True
            else:
                print(f"❌ Échec de la connexion: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur de connexion: {e}")
            return False
    
    def test_create_transaction(self):
        """Test de création d'une transaction"""
        transaction_data = {
            'description': 'Test transaction API',
            'amount': 1500.50,
            'type': 'INCOME',
            'category': 'Test',
            'date': datetime.now().isoformat(),
            'notes': 'Transaction de test créée par le script'
        }
        
        try:
            response = self.session.post(f'{API_BASE_URL}/finances', json=transaction_data)
            if response.status_code == 201:
                data = response.json()
                print(f"✅ Transaction créée avec ID: {data['id']}")
                return data['id']
            else:
                print(f"❌ Échec de création: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"❌ Erreur de création: {e}")
            return None
    
    def test_get_transactions(self):
        """Test de récupération des transactions"""
        try:
            response = self.session.get(f'{API_BASE_URL}/finances')
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {len(data)} transactions récupérées")
                return data
            else:
                print(f"❌ Échec de récupération: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Erreur de récupération: {e}")
            return []
    
    def test_get_stats(self):
        """Test de récupération des statistiques"""
        try:
            response = self.session.get(f'{API_BASE_URL}/finances/stats')
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Statistiques récupérées - Balance: {data.get('balance', 0)}€")
                return data
            else:
                print(f"❌ Échec des statistiques: {response.status_code}")
                return {}
        except Exception as e:
            print(f"❌ Erreur des statistiques: {e}")
            return {}
    
    def test_update_transaction(self, transaction_id):
        """Test de mise à jour d'une transaction"""
        update_data = {
            'description': 'Transaction mise à jour via API',
            'amount': 2000.00
        }
        
        try:
            response = self.session.put(f'{API_BASE_URL}/finances/{transaction_id}', json=update_data)
            if response.status_code == 200:
                print(f"✅ Transaction {transaction_id} mise à jour")
                return True
            else:
                print(f"❌ Échec de mise à jour: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur de mise à jour: {e}")
            return False
    
    def test_delete_transaction(self, transaction_id):
        """Test de suppression d'une transaction"""
        try:
            response = self.session.delete(f'{API_BASE_URL}/finances/{transaction_id}')
            if response.status_code == 200:
                print(f"✅ Transaction {transaction_id} supprimée")
                return True
            else:
                print(f"❌ Échec de suppression: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Erreur de suppression: {e}")
            return False
    
    def test_get_categories(self):
        """Test de récupération des catégories"""
        try:
            response = self.session.get(f'{API_BASE_URL}/finances/categories')
            if response.status_code == 200:
                data = response.json()
                categories = data.get('categories', [])
                print(f"✅ {len(categories)} catégories récupérées")
                return categories
            else:
                print(f"❌ Échec des catégories: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Erreur des catégories: {e}")
            return []
    
    def run_full_test(self):
        """Exécute tous les tests dans l'ordre"""
        print("🚀 Début des tests de l'API Finances")
        print("-" * 50)
        
        # Test de connexion
        if not self.login_test_user():
            print("💥 Impossible de se connecter, arrêt des tests")
            return False
        
        # Test de création
        transaction_id = self.test_create_transaction()
        if not transaction_id:
            print("💥 Impossible de créer une transaction, arrêt des tests")
            return False
        
        # Test de récupération
        transactions = self.test_get_transactions()
        
        # Test des statistiques
        stats = self.test_get_stats()
        
        # Test des catégories
        categories = self.test_get_categories()
        
        # Test de mise à jour
        self.test_update_transaction(transaction_id)
        
        # Test de suppression
        self.test_delete_transaction(transaction_id)
        
        print("-" * 50)
        print("🎉 Tests terminés avec succès !")
        return True

def main():
    """Point d'entrée principal"""
    tester = FinanceAPITester()
    
    try:
        success = tester.run_full_test()
        if success:
            print("\n✨ Tous les tests ont réussi ! L'API Finances est opérationnelle.")
            sys.exit(0)
        else:
            print("\n💥 Certains tests ont échoué.")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Tests interrompus par l'utilisateur")
        sys.exit(1)

if __name__ == "__main__":
    main()
