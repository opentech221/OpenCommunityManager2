// Script de test pour vérifier les fonctionnalités d'événements
const BASE_URL = 'http://127.0.0.1:5000';

// Fonction d'aide pour faire des requêtes
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token' // Remplacer par un vrai token
  };
  
  const response = await fetch(url, {
    headers: { ...defaultHeaders, ...options.headers },
    ...options
  });
  
  return {
    status: response.status,
    ok: response.ok,
    data: response.ok ? await response.json() : await response.text()
  };
}

// Test 1: Récupérer tous les événements
async function testGetEvents() {
  console.log('🧪 Test: Récupération des événements');
  const result = await makeRequest('/api/events/');
  console.log('Status:', result.status);
  console.log('Données:', result.data);
  return result;
}

// Test 2: Créer un nouvel événement
async function testCreateEvent() {
  console.log('🧪 Test: Création d\'événement');
  const eventData = {
    title: 'Test Event',
    description: 'Description de test',
    start_date: new Date().toISOString(),
    location: 'Lieu de test',
    type: 'MEETING',
    status: 'PLANNED',
    max_participants: 50
  };
  
  const result = await makeRequest('/api/events/', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
  
  console.log('Status:', result.status);
  console.log('Données:', result.data);
  return result;
}

// Test 3: Mettre à jour un événement
async function testUpdateEvent(eventId) {
  console.log('🧪 Test: Mise à jour d\'événement ID:', eventId);
  const updateData = {
    title: 'Test Event Modifié',
    description: 'Description modifiée',
    location: 'Nouveau lieu'
  };
  
  const result = await makeRequest(`/api/events/${eventId}/`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
  
  console.log('Status:', result.status);
  console.log('Données:', result.data);
  return result;
}

// Test 4: Supprimer un événement
async function testDeleteEvent(eventId) {
  console.log('🧪 Test: Suppression d\'événement ID:', eventId);
  const result = await makeRequest(`/api/events/${eventId}/`, {
    method: 'DELETE'
  });
  
  console.log('Status:', result.status);
  console.log('Données:', result.data);
  return result;
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 Début des tests d\'événements\n');
  
  try {
    // Test récupération
    await testGetEvents();
    console.log('\n');
    
    // Test création
    const createResult = await testCreateEvent();
    console.log('\n');
    
    if (createResult.ok && createResult.data.id) {
      const eventId = createResult.data.id;
      
      // Test mise à jour
      await testUpdateEvent(eventId);
      console.log('\n');
      
      // Test suppression
      await testDeleteEvent(eventId);
      console.log('\n');
    }
    
    console.log('✅ Tests terminés');
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Décommenter pour exécuter automatiquement
// runAllTests();

// Exporter les fonctions pour utilisation en console
if (typeof window !== 'undefined') {
  window.eventTests = {
    runAllTests,
    testGetEvents,
    testCreateEvent,
    testUpdateEvent,
    testDeleteEvent
  };
}
