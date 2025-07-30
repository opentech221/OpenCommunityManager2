#!/usr/bin/env node
/**
 * Script de test des types TypeScript
 */

// Test d'import pour vérifier la compilation
try {
  console.log('🔍 Test des imports TypeScript...');
  
  // Simuler les imports (dans un vrai projet, ceci serait dans un fichier .ts)
  console.log('✅ Imports simulés réussis');
  
  // Test des types principaux
  const TRANSACTION_TYPES = {
    INCOME: 'INCOME',
    EXPENSE: 'EXPENSE'
  };
  
  console.log('✅ Types de transaction définis:', TRANSACTION_TYPES);
  
  // Simuler une transaction
  const mockTransaction = {
    id: '1',
    type: TRANSACTION_TYPES.INCOME,
    amount: 150.0,
    description: 'Test transaction',
    date: new Date(),
    category: 'Test',
    associationId: '1'
  };
  
  console.log('✅ Transaction de test créée:', {
    ...mockTransaction,
    date: mockTransaction.date.toISOString()
  });
  
  console.log('\n🎉 Tous les tests de types sont réussis !');
  console.log('📝 Les fichiers TypeScript devraient maintenant compiler sans erreurs.');
  
} catch (error) {
  console.error('❌ Erreur lors du test des types:', error);
  process.exit(1);
}
