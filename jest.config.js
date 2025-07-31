module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^../utils$': '<rootDir>/src/utils/__mocks__/index.ts',
    '^.+/utils/apiUrl\\.vite$': '<rootDir>/src/utils/apiUrl.node.ts',
    
    // Mocks des hooks personnalisés
    '^../hooks/useFinances$': '<rootDir>/src/hooks/__mocks__/useFinances.ts',
    '^../hooks/useEvents$': '<rootDir>/src/hooks/__mocks__/useEvents.ts',
    '^../hooks/useCotisations$': '<rootDir>/src/hooks/__mocks__/useCotisations.ts',
    '^../hooks/useMembers$': '<rootDir>/src/hooks/__mocks__/useMembers.ts',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-router|react-router-dom)/)'
  ]
};
