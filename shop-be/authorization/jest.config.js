/** @type {import('ts-jest').JestConfigWithTsJest} */

function makeModuleNameMapper(srcPath, tsconfigPath) {
  // Get paths from tsconfig
  const {paths} = require(tsconfigPath).compilerOptions;

  const aliases = {};

  Object.keys(paths).forEach((item) => {
    const key = item.replace('/*', '/(.*)');
    const path = paths[item][0].replace('/*', '/$1');
    aliases[key] = srcPath + '/' + path;
  });
  return aliases;
}

const TS_CONFIG_PATH = './tsconfig.paths.json';
const SRC_PATH = '<rootDir>';

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: makeModuleNameMapper(SRC_PATH, TS_CONFIG_PATH)
};
