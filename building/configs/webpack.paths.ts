import path from "path";

const rootPath = path.join(__dirname, "../..");
const srcPath = path.join(rootPath, "src");

const srcRendererPath = path.join(srcPath, "App/Main/View/resources/html/");
const srcMainPath = path.join(srcPath, "App/");
const srcCLIPath = path.join(srcPath, "CLI/");

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

const distCLIPath = path.join(releasePath, "cli/dist");

export default {
  rootPath,
  srcPath,
  srcRendererPath,
  buildRendererPath,
  srcNodeModulesPath,
  srcMainPath,
  srcCLIPath,
  buildPath,
  dllPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  distPath,
  distMainPath,
  distCLIPath,
  distRendererPath
};
