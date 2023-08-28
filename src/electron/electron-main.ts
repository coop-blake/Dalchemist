//

import { BrowserWindow, Tray, Menu, ipcMain, dialog } from "electron";

import * as path from "path";
import * as fs from "fs";
import * as http from "http";

export default class Main {
  static mainWindow: Electron.BrowserWindow | null = null;
  static application: Electron.App;
  static BrowserWindow: typeof BrowserWindow;

  static loadError: string | null = null;
  static statusMessage: string | null = null;
  static started = false;

  static notReady = true;
  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      //  Main.application.quit();
    }
  }

  private static getIcon() {
    return process.platform === "win32"
      ? "../../icon/favicon.ico"
      : "../../icon/icon.png";
  }

  private static onClose() {
    // Dereference the window object.
    Main.mainWindow = null;
  }

  private static onReady() {
    Main.notReady = false;
    Main.mainWindow = new Main.BrowserWindow({ width: 800, height: 600 });

    Main.mainWindow?.loadFile(
      path.join(__dirname + "/Resources/html/index.html")
    );
    Main.mainWindow?.on("closed", Main.onClose);

    //called before ready
    if (Main.statusMessage !== null && Main.loadError === null) {
      Main.statusMessageUpdate(Main.statusMessage);
    }
    //called before ready
    if (Main.started === true && Main.loadError === null) {
      Main.start();
    }
    //called before ready
    if (Main.loadError !== null) {
      Main.startError(Error(Main.loadError));
    }
    const faviconPath = path.join(__dirname, Main.getIcon());

    console.log("Favicon", faviconPath);
    const tray = new Tray(faviconPath);

    // if ( Main.application.dock)  Main.application.dock.hide();

    if (process.platform === "win32") {
      tray.on("right-click", () => {
        tray.popUpContextMenu();
      });
    }

    const menu = Menu.buildFromTemplate([
      {
        label: "Inventory",
        click() {
          Main.mainWindow?.loadURL("http://localhost:4848/Inventory");
        },
      },
      {
        label: "Add/Drop",
        click() {
          Main.mainWindow?.loadURL("http://localhost:4848/");
        },
      },
      {
        label: "TabImporter",
        click() {
          Main.mainWindow?.loadURL("https://coop-blake.github.io/tabImporter/");
        },
      },
      {
        label: "Save Add Drop Price Change",
        click() {
          // const contentToSave = 'This is the content of the file.';

          // // Show a dialog to choose the file path
          // dialog.showSaveDialog({ defaultPath: 'myfile.txt' }).then(result => {
          //   if (!result.canceled && result.filePath) {
          //     const filePath = result.filePath;
          //     saveStringToFile(contentToSave, filePath);
          //   }
          // });
          http
            .get(
              "http://localhost:4848/addDropPriceChanges.txt",
              (response) => {
                let contentToSave = "";

                response.on("data", (chunk) => {
                  contentToSave += chunk;
                });

                response.on("end", () => {
                  // Show a dialog to choose the file path
                  dialog
                    .showSaveDialog({ defaultPath: "myfile.txt" })
                    .then((result) => {
                      if (!result.canceled && result.filePath) {
                        const filePath = result.filePath;
                        saveStringToFile(contentToSave, filePath);
                      }
                    });
                });
              }
            )
            .on("error", (error) => {
              console.error("Error fetching content:", error);
            });
        },
      },
      {
        label: "Input Data",
        click() {
          Main.showDialog();
        },
      },
      {
        label: process.platform === "win32" ? "Exit" : "Quit",
        click() {
          Main.application.quit();
        },
      },
    ]);

    tray.setToolTip("Dalchemist");
    tray.setContextMenu(menu);
  }

  static showDialog() {
    const preloadPath = path.join(__dirname, "preloadDialog.js");
    console.log("preload path", preloadPath);
    const win = new BrowserWindow({
      width: 300,
      height: 150,
      webPreferences: {
        preload: preloadPath, // Load preload script for the input dialog

        nodeIntegration: true,
      },
    });

    win.loadFile(__dirname + "/Resources/html/inputDialog.html");

    ipcMain.on("input-data", (event, data) => {
      console.log(
        "User input - if this was a list of UPCs, either newlined or comma seperated, make a list of items:",
        data
      );
      Main.mainWindow?.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(data)}`
      );

      win.close();
    });
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);
  }

  static start() {
    //Main.mainWindow?.loadURL("http://localhost:4848/");
    Main.started = true;

    const mainWindow = Main.mainWindow;
    if (mainWindow !== null) {
      mainWindow.webContents.executeJavaScript(`
          const statusContent = document.getElementById('statusContent');
          if (statusContent) {
            statusContent.textContent = 'Success!';
          }
          const iconImage = document.getElementById('iconImage');
          if(iconImage){
            iconImage.classList.remove('pulsating');
          }
          const menuContent = document.getElementById('menuContent');
          if(menuContent){
            menuContent.classList.add('fadeIn');
          }
        `);
    }
  }

  static statusMessageUpdate(message: string) {
    const mainWindow = Main.mainWindow;

    Main.statusMessage = message;

    if (mainWindow !== null && Main.loadError === null) {
      mainWindow.webContents.executeJavaScript(`
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          update();
        } else {
          document.addEventListener('DOMContentLoaded', update);
        }
        function update(){
            const statusContent = document.getElementById('statusContent');
            
            if (statusContent) {
              statusContent.innerHTML = '${message
                .replace(/'/g, "\\'")
                .replace(/"/g, '\\"')}';
              
            }
           
        }
        `);
    } else if (Main.loadError === null) {
      Main.statusMessage = message;
    }
  }

  static startError(error: Error) {
    const mainWindow = Main.mainWindow;
    const errorMessage = error.message as string;
    Main.loadError = errorMessage;
    if (mainWindow !== null) {
      mainWindow.webContents.executeJavaScript(`
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          update();
        } else {
          document.addEventListener('DOMContentLoaded', update);
        }
        function update(){
            const statusContent = document.getElementById('statusContent');
            const iconImage = document.getElementById('iconImage');
            
            if (statusContent) {
              statusContent.innerHTML = 'Error Loading! </br>${errorMessage
                .replace(/'/g, "\\'")
                .replace(/"/g, '\\"')}';

              statusContent.style.color = 'red';

              
            }
            if(iconImage){
              iconImage.classList.remove('pulsating');
            }
        }
        `);
    }
  }
}

function saveStringToFile(content: string, filePath: string) {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("File saved successfully.");
  } catch (error) {
    console.error("Error saving file:", error);
  }
}
