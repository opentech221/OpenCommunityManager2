# Service d'intégration Ollama pour l'assistant IA organisationnel
import requests
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class OllamaService:
    """Service pour interagir avec Ollama local"""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.available_models = []
        self.check_ollama_status()
    
    def check_ollama_status(self) -> bool:
        """Vérifier si Ollama est accessible"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                self.available_models = [model['name'] for model in response.json().get('models', [])]
                logger.info(f"Ollama accessible. Modèles disponibles: {self.available_models}")
                return True
        except Exception as e:
            logger.error(f"Ollama non accessible: {e}")
        return False
    
    def get_organizational_prompt(self, context: Dict[str, Any]) -> str:
        """Génère un prompt contextualisé pour l'assistance organisationnelle"""
        
        maturity_level = context.get('maturityLevel', 0)
        current_page = context.get('currentPage', '')
        user_role = context.get('userRole', 'membre')
        
        base_prompt = f"""Tu es un expert consultant en gouvernance associative et organisationnelle.
        
CONTEXTE UTILISATEUR:
- Niveau de maturité organisationnelle: {maturity_level}/5
- Page actuelle: {current_page}
- Rôle: {user_role}

DIRECTIVE:
- Réponds en français de manière précise et professionnelle
- Adapte tes conseils au niveau de maturité de l'organisation
- Propose des actions concrètes et réalisables
- Référence les bonnes pratiques associatives françaises
- Sois concis mais informatif (maximum 300 mots)

DOMAINES D'EXPERTISE:
- Gouvernance associative
- Conformité réglementaire
- Gestion financière
- Organisation administrative
- Développement organisationnel
- Stratégie et planification

QUESTION DE L'UTILISATEUR: """
        
        return base_prompt
    
    def generate_response(self, query: str, context: Dict[str, Any], model: str = "llama2") -> Dict[str, Any]:
        """Génère une réponse IA pour une requête organisationnelle"""
        
        if model not in self.available_models:
            if self.available_models:
                model = self.available_models[0]
            else:
                return self._fallback_response(query)
        
        try:
            full_prompt = self.get_organizational_prompt(context) + query
            
            # Requête à Ollama
            payload = {
                "model": model,
                "prompt": full_prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_tokens": 500
                }
            }
            
            response = requests.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                ai_response = result.get('response', '').strip()
                
                # Analyse et enrichissement de la réponse
                return self._enrich_response(ai_response, query, context)
            else:
                logger.error(f"Erreur Ollama: {response.status_code}")
                return self._fallback_response(query)
                
        except Exception as e:
            logger.error(f"Erreur génération IA: {e}")
            return self._fallback_response(query)
    
    def _enrich_response(self, ai_response: str, query: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Enrichit la réponse IA avec des suggestions et ressources"""
        
        # Génération de suggestions basées sur le contexte
        suggestions = self._generate_suggestions(query, context)
        
        # Ressources liées basées sur la page actuelle
        related_resources = self._get_related_resources(context.get('currentPage', ''))
        
        # Questions de suivi contextuelles
        follow_up_questions = self._generate_follow_up_questions(query, context)
        
        # Calcul de confiance (basique)
        confidence = min(0.9, len(ai_response) / 100)  # Confiance basée sur la longueur
        
        return {
            'response': ai_response,
            'suggestions': suggestions,
            'related_resources': related_resources,
            'follow_up_questions': follow_up_questions,
            'confidence': confidence,
            'model_used': 'llama2',
            'timestamp': datetime.utcnow().isoformat()
        }
    
    def _generate_suggestions(self, query: str, context: Dict[str, Any]) -> List[str]:
        """Génère des suggestions d'actions basées sur la requête"""
        
        current_page = context.get('currentPage', '').lower()
        maturity_level = context.get('maturityLevel', 0)
        
        suggestions = []
        
        if 'diagnostic' in current_page or 'évaluation' in query.lower():
            suggestions = [
                "Effectuer un diagnostic organisationnel complet",
                "Analyser les processus de gouvernance existants",
                "Évaluer la conformité réglementaire"
            ]
        elif 'finance' in query.lower() or 'budget' in query.lower():
            suggestions = [
                "Réviser les procédures de gestion financière",
                "Mettre en place un budget prévisionnel",
                "Optimiser le suivi des recettes et dépenses"
            ]
        elif 'conformité' in current_page or 'réglementation' in query.lower():
            suggestions = [
                "Vérifier les obligations déclaratives",
                "Mettre à jour les statuts si nécessaire",
                "Réviser les procédures internes"
            ]
        else:
            suggestions = [
                "Explorer les recommandations personnalisées",
                "Consulter le guide de meilleures pratiques",
                "Programmer une évaluation organisationnelle"
            ]
        
        return suggestions[:3]  # Limiter à 3 suggestions
    
    def _get_related_resources(self, current_page: str) -> List[str]:
        """Retourne des ressources pertinentes selon la page"""
        
        resources_map = {
            'diagnostic': [
                "Guide d'auto-évaluation organisationnelle",
                "Grille de maturité associative",
                "Modèles de questionnaires de diagnostic"
            ],
            'finance': [
                "Plan comptable associatif",
                "Modèles de budget prévisionnel",
                "Guide de la comptabilité simplifiée"
            ],
            'governance': [
                "Statuts types d'association",
                "Guide des instances dirigeantes",
                "Procédures d'assemblée générale"
            ],
            'compliance': [
                "Calendrier des obligations associatives",
                "Guide de la déclaration préfectorale",
                "Checklist de conformité annuelle"
            ]
        }
        
        for key, resources in resources_map.items():
            if key in current_page.lower():
                return resources
        
        return [
            "Documentation générale associative",
            "Guides de bonnes pratiques",
            "Ressources réglementaires"
        ]
    
    def _generate_follow_up_questions(self, query: str, context: Dict[str, Any]) -> List[str]:
        """Génère des questions de suivi pertinentes"""
        
        questions = [
            "Comment puis-je mettre en œuvre ces recommandations ?",
            "Quels sont les prochaines étapes prioritaires ?",
            "Existe-t-il des outils pour m'accompagner ?"
        ]
        
        maturity_level = context.get('maturityLevel', 0)
        
        if maturity_level < 2:
            questions = [
                "Par quoi commencer pour structurer notre organisation ?",
                "Quelles sont les bases indispensables à mettre en place ?",
                "Comment prioriser nos actions d'amélioration ?"
            ]
        elif maturity_level > 3:
            questions = [
                "Comment optimiser davantage notre organisation ?",
                "Quelles innovations organisationnelles adopter ?",
                "Comment mesurer notre performance organisationnelle ?"
            ]
        
        return questions
    
    def _fallback_response(self, query: str) -> Dict[str, Any]:
        """Réponse de secours en cas d'indisponibilité d'Ollama"""
        
        return {
            'response': f"Je comprends votre question sur '{query}'. Pour obtenir une réponse personnalisée, veuillez vous assurer que le service IA est disponible ou consultez notre documentation.",
            'suggestions': [
                "Consulter la documentation officielle",
                "Contacter l'équipe de support",
                "Explorer les ressources disponibles"
            ],
            'related_resources': [
                "Guide utilisateur",
                "FAQ associative",
                "Ressources en ligne"
            ],
            'follow_up_questions': [
                "Comment accéder à l'aide en ligne ?",
                "Où trouver plus d'informations ?",
                "Comment améliorer mon expérience ?"
            ],
            'confidence': 0.5,
            'model_used': 'fallback',
            'timestamp': datetime.utcnow().isoformat()
        }
