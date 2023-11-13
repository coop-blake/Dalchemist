import path from "path";

const rootPath = path.join(__dirname, "../..");
const srcPath = path.join(rootPath, "src");

const srcRendererPath = path.join(srcPath, "App/Resources/html/");
const srcMainPath = path.join(srcPath, "App/");

const buildRendererPath = path.join(rootPath, "build");
const srcNodeModulesPath = path.join(rootPath, "node_modules");

const buildPath = path.join(rootPath, "build");

const dllPath = path.join(buildPath, "dll");

const releasePath = path.join(rootPath, "release");
const appPath = path.join(releasePath, "app");
const appPackagePath = path.join(appPath, "package.json");
const appNodeModulesPath = path.join(appPath, "node_modules");

const distPath = path.join(appPath, "dist");
const distMainPath = path.join(distPath, "main");
const distRendererPath = path.join(distPath, "renderer");

export default {
  rootPath,
  srcPath,
  srcRendererPath,
  buildRendererPath,
  srcNodeModulesPath,
  srcMainPath,
  buildPath,
  dllPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
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
