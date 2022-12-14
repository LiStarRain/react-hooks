module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test/spec))\\.(jsx?|tsx?)$',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['es/', 'lib/'],
  collectCoverage: true,
  root: './src',
};
