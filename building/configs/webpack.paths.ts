import path from 'path';

const rootPath = path.join(__dirname, "../..");
const srcPath = path.join(rootPath, 'src');

const srcRendererPath = path.join(srcPath, 'electron/Resources/html/');
const srcMainPath = path.join(srcPath, 'electron/');

const buildRendererPath =  path.join(rootPath, 'build');
const srcNodeModulesPath = path.join(rootPath, 'node-modules');

const buildPath = path.join(rootPath, 'build');


/*
const dllPath = path.join(__dirname, '../dll');


const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');

const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app');

const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(srcPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = path.join(distPath, 'renderer');

const buildPath = path.join(releasePath, 'build');
*/
export default {
  rootPath,
  srcPath,
  srcRendererPath,
  buildRendererPath,
  srcNodeModulesPath,
  srcMainPath,
  buildPath,
  /*
  dllPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
  buildPath,
  */
};