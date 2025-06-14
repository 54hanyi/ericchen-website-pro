import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './', // 指向你的 Next.js 專案根目錄
});

// 自訂 Jest config
const customConfig: Config = {
  testEnvironment: 'jsdom', // 若測試中有 React DOM, JSX，使用 jsdom
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // 如有 alias，moduleNameMapper 也能透過 nextJest 自動處理 tsconfig paths
  // 也可手動補充：
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // 若 import CSS/圖片，亦可 stub：
    // '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        /* 可在此加 ts-jest config */
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
};

export default createJestConfig(customConfig);
