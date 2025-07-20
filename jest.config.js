module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/node_modules/@testing-library/jest-dom/dist/index.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^.+/utils/apiUrl\\.vite$': '<rootDir>/src/utils/apiUrl.node.ts',
  },
};
