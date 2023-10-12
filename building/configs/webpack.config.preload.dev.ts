import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import baseConfig from "./webpack.config.base";
import webpackPaths from "./webpack.paths";

import fs from "fs";
import checkNodeEnv from "../scripts/check-node-env";

// When an ESLint server is running, we can't set the NODE_ENV so we'll check if it's
// at the dev webpack config is not accidentally run in a production environment
if (process.env.NODE_ENV === "production") {
  checkNodeEnv("development");
}

function generateEntryPoints() {
  const entryPoints: {
    [key: string]: string;
  } = {};
  const srcMainFullPath = path.resolve(__dirname, webpackPaths.srcMainPath);

  // Recursively iterate through subdirectories
  function iterateDirectories(dir: string) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Recursive call for subdirectories
        iterateDirectories(filePath);
      } else if (file.startsWith("preload") && file.endsWith(".ts")) {
        // Create entry point for preload.ts files
        const relativePath = path.relative(srcMainFullPath, filePath);
        const entryName = relativePath.replace(/\.ts$/, "");
        entryPoints[entryName] = filePath;
      }
    });
  }

  iterateDirectories(srcMainFullPath);
  return entryPoints;
}

const entryPoints = generateEntryPoints();

console.log(entryPoints);

const configuration: webpack.Configuration = {
  devtool: "inline-source-map",

  mode: "development",

  target: "electron-preload",

  entry: entryPoints,

  //path.join(webpackPaths.srcMainPath, 'preload.ts'),

  output: {
    path: webpackPaths.buildPath,
    filename: "[name].js",
    library: {
      type: "umd"
    }
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === "true" ? "server" : "disabled"
    }),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     *
     * By default, use 'development' as NODE_ENV. This can be overriden with
     * 'staging', for example, by changing the ENV variables in the npm scripts
     */
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development"
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  },

  watch: true
};

export default merge(baseConfig, configuration);
