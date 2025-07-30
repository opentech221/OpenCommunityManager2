#!/usr/bin/env node
/**
 * Script de diagnostic pour tester l'API backend
 */

const http = require('http');

function testBackendConnection() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/finances',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      console.log(`✅ Backend répond avec le statut: ${res.statusCode}`);
      console.log(`📋 Headers: ${JSON.stringify(res.headers, null, 2)}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`📄 Réponse: ${data}`);
        resolve({ status: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Erreur de connexion au backend: ${error.message}`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.error('⏰ Timeout - Le backend ne répond pas');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function main() {
  console.log('🔍 Diagnostic de l\'API Backend');
  console.log('==============================');
  
  try {
    console.log('📡 Test de connexion au backend (http://localhost:5000/api/finances)...');
    await testBackendConnection();
    console.log('\n✅ Backend accessible ! Le problème vient du frontend.');
    
    console.log('\n🔧 Vérifications à faire côté frontend :');
    console.log('1. Vérifier les variables d\'environnement VITE_BACKEND_URL');
    console.log('2. Vérifier que les requêtes sont bien envoyées vers localhost:5000');
    console.log('3. Vérifier la configuration CORS');
    
  } catch (error) {
    console.log('\n❌ Backend inaccessible !');
    console.log('\n🚀 Actions recommandées :');
    console.log('1. Démarrer le serveur backend : cd backend && python run.py');
    console.log('2. Vérifier que le port 5000 est libre');
    console.log('3. Vérifier les logs du serveur backend');
  }
}

main();
