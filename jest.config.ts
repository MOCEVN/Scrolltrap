import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^next/image$': '<rootDir>/__mocks__/next/image.tsx',
  },
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx}',
    '!<rootDir>/.next/**',
    '!<rootDir>/node_modules/**',
    '!<rootDir>/next-env.d.ts',
    '!<rootDir>/jest.config.ts',
    '!<rootDir>/jest.setup.ts',
    '!<rootDir>/__tests__/**',
    '!<rootDir>/**/types/**',
  ],
};

export default createJestConfig(config);
