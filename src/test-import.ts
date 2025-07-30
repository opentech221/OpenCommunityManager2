// Test import
import type { OrganizationalMaturityLevel } from './types/guidance';

const test: OrganizationalMaturityLevel = {
  id: 1,
  name: "Test",
  description: "Test",
  icon: "test",
  color: "test",
  requirements: [],
  benefits: []
};

console.log('Import test réussi', test);
