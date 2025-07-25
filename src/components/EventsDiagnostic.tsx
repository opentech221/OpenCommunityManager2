import { useEvents } from '../hooks/useEvents';
import { useState } from 'react';

// Composant de diagnostic pour tester les opérations CRUD d'événements
export default function EventsDiagnostic() {
  const { 
    events, 
    isLoading, 
    addEvent, 
    updateEvent, 
    deleteEvent 
  } = useEvents();
  
  const [diagnosticResults, setDiagnosticResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (message: string) => {
    setDiagnosticResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const runDiagnostic = async () => {
    setIsRunning(true);
    setDiagnosticResults([]);
    
    try {
      addLog('🔍 Début du diagnostic des événements');
      
      // Test 1: Vérifier la récupération des événements
      addLog(`📊 Nombre d'événements chargés: ${events.length}`);
      addLog(`⏳ État de chargement: ${isLoading ? 'En cours' : 'Terminé'}`);
      
      // Test 2: Tenter de créer un événement de test
      addLog('🆕 Test de création d\'événement...');
      const testEvent = {
        title: 'Test Diagnostic',
        description: 'Événement de test pour diagnostic',
        startDate: new Date(),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // +2h
        location: 'Lieu de test',
        type: 'MEETING' as const,
        status: 'PLANNED' as const,
        maxParticipants: 10,
        associationId: '1',
        createdBy: 'diagnostic',
        participants: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await addEvent(testEvent);
      addLog('✅ Création d\'événement réussie');
      
      // Attendre un peu pour que l'état se mette à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trouver l'événement créé
      const createdEvent = events.find(e => e.title === 'Test Diagnostic');
      if (createdEvent) {
        addLog(`📝 Événement trouvé avec ID: ${createdEvent.id}`);
        
        // Test 3: Tenter de modifier l'événement
        addLog('✏️ Test de modification d\'événement...');
        await updateEvent(createdEvent.id, {
          title: 'Test Diagnostic Modifié',
          description: 'Description modifiée'
        });
        addLog('✅ Modification d\'événement réussie');
        
        // Attendre un peu
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test 4: Tenter de supprimer l'événement
        addLog('🗑️ Test de suppression d\'événement...');
        await deleteEvent(createdEvent.id);
        addLog('✅ Suppression d\'événement réussie');
        
      } else {
        addLog('❌ Événement créé non trouvé dans la liste');
      }
      
      addLog('🎉 Diagnostic terminé avec succès');
      
    } catch (error) {
      addLog(`❌ Erreur pendant le diagnostic: ${error}`);
      console.error('Erreur diagnostic:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Diagnostic des événements</h2>
      
      <div className="mb-4">
        <button
          onClick={runDiagnostic}
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg text-white ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isRunning ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Résultats du diagnostic:</h3>
        {diagnosticResults.length === 0 && (
          <p className="text-gray-500">Aucun diagnostic exécuté</p>
        )}
        {diagnosticResults.map((result, index) => (
          <div key={index} className="text-sm mb-1 font-mono">
            {result}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>État actuel:</strong></p>
        <p>• Événements chargés: {events.length}</p>
        <p>• Chargement en cours: {isLoading ? 'Oui' : 'Non'}</p>
      </div>
    </div>
  );
}
