//

import {  BrowserWindow, Tray, Menu, ipcMain, dialog, IpcMainEvent } from "electron";

import * as path from "path";
import * as fs from "fs";
import * as http from "http";

import { Inventory } from "../Google/Inventory/Inventory";




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
  
  public static getMainWindow() : BrowserWindow {
    
    if (Main.mainWindow === null)
    {    

      if(Main.notReady){
        console.error("NOOOOOO!!!!")
      }
      const preloadPath = path.join(__dirname, "preloadDialog.js");
      console.log("preload path" ,preloadPath)
      Main.mainWindow =  new BrowserWindow(
        { width: 800, 
          height: 600,  
          webPreferences: {
            preload: preloadPath, // Load preload script for the input dialog
            contextIsolation: true,
            nodeIntegration: false,
            },
        });
    }

    return Main.mainWindow
  }
  private static onReady() {
    Main.notReady = false;

    const preloadPath = path.join(__dirname, "preloadDialog.js");
    console.log("preload path" ,preloadPath)
    Main.mainWindow =  new BrowserWindow(
      { width: 800, 
        height: 600,  
        webPreferences: {
          preload: preloadPath, // Load preload script for the input dialog
          contextIsolation: true,
          nodeIntegration: false,
          },
      });
    
      Main.mainWindow.loadFile(
      path.join(__dirname, "/Resources/html/index.html")
    );
    Main.getMainWindow().on("closed", Main.onClose);

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
          const mainWindow = Main.getMainWindow() 
          mainWindow.loadURL("http://localhost:4848/Inventory");
        },
        submenu: [ {
          label: "Find Scan Code",
          click() {
            Main.showDialog();
          },
        },]
      },
      {
        label: "Add/Drop",
        
        submenu: [{
          label: "Summary",
          click() {
             const mainWindow = Main.getMainWindow() 
          mainWindow.loadURL("http://localhost:4848/");
          }
        },{
          label: "Save Add Drop Price Change",
          click() {
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
        },]
      },
      {
        label: "TabImporter",
        click() {
           const mainWindow = Main.getMainWindow() 
          mainWindow.loadURL("https://coop-blake.github.io/tabImporter/");
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
    const win = new this.BrowserWindow({
      width: 300,
      height: 150,
      webPreferences: {
        preload: preloadPath, // Load preload script for the input dialog

        nodeIntegration: true,
      },
    });

    win.loadFile(__dirname + "/Resources/html/inputDialog.html");

     const onInputData  =  (event : IpcMainEvent, data : string) => {
      // console.log(
      //   "User input - if this was a list of UPCs, either newlined or comma seperated, make a list of items:",
      //   data
      // );

     
      const output =  returnUserScancodeSearch(data)
      Main.getMainWindow().loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(output)}`
      );
      event.sender.send("input-data-reply", "Data processed successfully");
      win.close();
    }

    win.on('closed', () => {
      // Remove the IPC event listener when the window is closed
      ipcMain.removeListener("input-data", onInputData);
    });


    ipcMain.on("input-data", onInputData)
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
    //Main.getMainWindow().loadURL("http://localhost:4848/");
    Main.started = true;


      if (Main.notReady) {
        console.log("Not ready, waiting!");

        Main.application?.on("ready", async () => {
          const mainWindow = Main.getMainWindow();
          mainWindow.webContents.send("startEvent", "Started")
        });

      }else{
        Main.getMainWindow().webContents.send("startEvent", "Started")
      }


    // const mainWindow = Main.getMainWindow();
    // if (mainWindow !== null) {
    //   mainWindow.webContents.executeJavaScript(`
    //       let statusContent = document.getElementById('statusContent');
    //       if (statusContent) {
    //         statusContent.textContent = 'Success!';
    //       }
    //       let iconImage = document.getElementById('iconImage');
    //       if(iconImage){
    //         iconImage.classList.remove('pulsating');
    //       }
    //       let menuContent = document.getElementById('menuContent');
    //       if(menuContent){
    //         menuContent.classList.add('fadeIn');
    //       }
    //     `);
    // }
  }

  static statusMessageUpdate(message: string) {
    const mainWindow = Main.getMainWindow();

    Main.statusMessage = message;

    if (mainWindow !== null && Main.loadError === null) {
      mainWindow.webContents.send("startMessageUpdate", message)
      mainWindow.webContents.executeJavaScript(`
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          update();
        } else {
          document.addEventListener('DOMContentLoaded', update);
        }
        function update(){
            let statusContent = document.getElementById('statusContent');
            
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
    const mainWindow = Main.getMainWindow();
    const errorMessage = error.message as string;
    Main.loadError = errorMessage;

    if (Main.notReady) {
      console.log("Not ready, waiting!");

      Main.application?.on("ready", async () => {
        const mainWindow = Main.getMainWindow();
        mainWindow.webContents.send(`startError`, error);
      });

    }else{
      mainWindow.webContents.send(`startError`, error);
  }


    // if (mainWindow !== null) {
    //   mainWindow.webContents.send(`startError`, error);
    // }
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


function returnUserScancodeSearch (input: string) : string{
  const inventory = Inventory.getInstance();

  function getLineFromScanCode (ScanCode : string) : string{
    const entry = inventory.getEntryFromScanCode(ScanCode);
     return entry ? entry.valuesArray.join(" | ") : "No Item Found: " + ScanCode
  }


  if(input.includes(',')) {
    const scanCodes = input.split(',').map(code => code.trim());
    let returnString = ""
    scanCodes.forEach((ScanCode) => {
      returnString += getLineFromScanCode(ScanCode)
    })
    return returnString;
  } else {
    return getLineFromScanCode(input.trim());
  }

}