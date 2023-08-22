import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  modulePathIgnorePatterns: ['dist'],
};

export default jestConfig;
