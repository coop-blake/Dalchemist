# Desktop Application ![Icon](../icon/icon32.png)

Some Dalchemist services can be consumed through a Desktop Application

The repository includes scripts for building, running, and packaging a cross-platform desktop application using the [Electron framework](https://www.electronjs.org/).

### Running

You can start the Electron application by running `npm run start:App` from the terminal which will:

- **Check that port 4848 is available** ( _./building/scripts/check-port-in-use.ts_ )
- **Starts Render Process with Webpack** (`npm run start:App:renderer`)
- **Builds dlls** ( _./building/configs/webpack.config.renderer.dev.ts_ calls `npm run build:dlls` when loaded)
- **Builds Preload Typescript files** ( _./building/configs/webpack.config.renderer.dev.ts_ calls `npm run start:App:preload` in **setupMiddlewares()** )
- **Starts Main Process** ( _./building/configs/webpack.config.renderer.dev.ts_ calls `npm run start:App:main` in **setupMiddlewares()** )

### Building

The building scripts are used by the packaging process but can be ran from the command line if needed

- `npm run build` (runs `npm run build:main`and`npm run build:renderer`)
- `npm run build:main` ( Webpack production mode main process transpiled using _./building/configs/webpack.config.main.prod.ts_ )
- `npm run  build:renderer` (Webpack production mode render process transpiled using _./building/configs/webpack.config.renderer.prod.ts_ )
- `npm run build:dlls` (Webpack development mode libraries transpiled using _./building/configs/webpack.config.renderer.dev.dll.ts_ )

### Packaging

To build a packaged installer run `npm run package:App`

This will run the build process then package an installable application for your platform.

The packaged installer can be found in [_./release/package_ 📁](../release/package/)
