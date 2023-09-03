//
//import { URL } from "url";

import { resolveHtmlPath } from "./Utility";

import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent, dialog } from "electron";
import path from "path";
import { BehaviorSubject, Observable } from "rxjs";
import { DalchemistMainMenu } from "./Menu";

import { combineLatest, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { AddDrop } from "../Google/addDrop/addDrop";
import { Inventory } from "../Google/Inventory/Inventory";


import {getAddDropPriceUpdatesTSV} from '../../src/Google/addDrop/htmlOutputs'
import fs from 'fs'

export class DalchemistAppState {
  private statusSubject = new BehaviorSubject<DalchemistAppStatus>(
    DalchemistAppStatus.Preparing
  );

  public get status$(): Observable<DalchemistAppStatus> {
    return this.statusSubject.asObservable();
  }

  public setStatus(status: DalchemistAppStatus) {
    this.statusSubject.next(status);
  }
  public getStatus(): DalchemistAppStatus {
    return this.statusSubject.getValue()
  }
}

export enum DalchemistAppStatus {
  Preparing = "Preparing",
  Initializing = "Initializing",
  Starting = "Starting",
  Running = "Running",
  Error = "Error!",
}

export default class DalchemistApp {
  public static instance: DalchemistApp;
  static state: DalchemistAppState = new DalchemistAppState();

  public notReady = true;

  private mainWindow: BrowserWindow | null = null;
  private addDropWindow: BrowserWindow | null = null;
  private inventoryWindow: BrowserWindow | null = null;
  private tabImporterWindow: BrowserWindow | null = null;

  private mainMenu: DalchemistMainMenu | null = null;

  public static getState(): DalchemistAppState {
    return DalchemistApp.state;
  }

  public showFindDialog() {
    const preloadPath = path.join(__dirname, "../../build/preloadDialog.js");
    console.log("preload path", preloadPath);
    const win = new BrowserWindow({
      width: 300,
      height: 150,
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: true,
      },
    });

    win.loadFile(__dirname + "/Resources/html/inputDialog.html");

    const searchInventoryAndShowResults = (
      _ipcEvent: IpcMainInvokeEvent,
      lookingFor: string
    ) => {
      const output = returnUserScancodeSearch(lookingFor);

      this.getMainWindow()?.loadURL(
        `data:text/html;charset=utf-8,${encodeURIComponent(output)}`
      );
      win.close();
    };

    win.on("closed", () => {
      // Remove the IPC event listener when the window is closed
      ipcMain.removeListener("searchInventory", searchInventoryAndShowResults);
    });

    ipcMain.handle("searchInventory", searchInventoryAndShowResults);
  }

  static getInstance(): DalchemistApp {
    if (!DalchemistApp.instance) {
      DalchemistApp.instance = new DalchemistApp();
    }
    return DalchemistApp.instance;
  }

  private constructor() {
    DalchemistApp.state.setStatus(DalchemistAppStatus.Initializing);

    console.log("🟩DalchemistApp-Starting!");

    // app.on("window-all-closed", this.onWindowsAllClosed);
    // app.on("ready", this.onReady);

    app.whenReady().then(() => {
      app.on("window-all-closed", this.onWindowAllClosed);

      console.log("DalchemistApp-onReady!");
      this.onReady();
    });
  }

  private onWindowAllClosed(){
    if (process.platform !== "darwin") {
      //  Main.application.quit();
    }
  }

  private sendStatusToMainWindow() {
    const mainWindow = this.getMainWindow();

    if (mainWindow != null) {
      if (this.sendStatusToMainWindow !== null) {
        this.stopSendingStatusToMainWindow();
      }
      this.sendingStatusToWindow = DalchemistApp.state.status$.subscribe(
        (status: string) => {
          console.log("DalchemistApp.state.status status", status);
          mainWindow.webContents.send("status", status);
        }
      );
    }
  }
  private stopSendingStatusToMainWindow() {
    if (this.sendingStatusToWindow !== null) {
      this.sendingStatusToWindow.unsubscribe();
      this.sendingStatusToWindow = null;
    }
  }
  public showAddDropWindow() {
    const addDropWindow = this.getAddDropWindow();
    const getIndexPath = resolveHtmlPath("addDrop.html");
    console.log("addDrop getIndexPath", getIndexPath);

    if (addDropWindow !== null) {

      ipcMain.on("addDropWindowMessage", this.handleAddDropWindowMessage);
  
      addDropWindow.on("closed", () => {
        // Remove the IPC event listener when the window is closed
        ipcMain.removeListener("addDropWindowMessage", this.handleAddDropWindowMessage);
        
      });


      addDropWindow
        .loadURL(path.join(getIndexPath))
        .then(() => {
          addDropWindow.webContents.send(
            "newItemsArray",
            AddDrop.state.newItems
          );
          addDropWindow.webContents.send(
            "itemsAlreadyInInventory",
            AddDrop.state.itemsAlreadyInInventory
          );
          addDropWindow.webContents.send(
            "attributeChangeItems",
            AddDrop.state.attributeChangeItems
          );
          addDropWindow.webContents.send(
            "priceUpdates",
            AddDrop.state.priceUpdates
          );

          addDropWindow.show();
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }
 
  }

  public showInventoryWindow() {
    const inventoryWindow = this.getInventoryWindow();
    const getIndexPath = resolveHtmlPath("inventory.html");
    console.log("Inventory getIndexPath", getIndexPath);

    if (inventoryWindow !== null) {
      inventoryWindow
        .loadURL(path.join(getIndexPath))
        .then(() => {

         
          const inventoryValues = Array.from(
            Inventory.getInstance().entries.values()
          );

          inventoryWindow.webContents.send("inventoryData", inventoryValues);

          inventoryWindow.show();
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }
  }

  public showTabImporterWindow() {
    const tabImporterWindow = this.getTabImporterWindow();
   
    if (tabImporterWindow !== null) {

      
      tabImporterWindow
        .loadURL(path.join("https://coop-blake.github.io/tabImporter/"))
        .then(() => { 
          tabImporterWindow.show();
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }
  }
  private sendingStatusToWindow: Subscription | null = null;

  public closeMainWindow() {
    const mainWindow = this.mainWindow;
    if (mainWindow !== null) {
      mainWindow.close();
    }
  }

  private onCloseMainWindow() {
    const mainWindow = this.mainWindow;
    if (mainWindow !== null) {
      this.mainWindow = null;
    }
  }

  private onReady() {
    DalchemistApp.state.setStatus(DalchemistAppStatus.Starting);
    this.notReady = false;
    this.mainMenu = new DalchemistMainMenu(this);
    this.showMainWindow()
  }


  private sendMainWindowStatus(){
    const mainWindow = this.getMainWindow();

    mainWindow?.webContents.send("status", DalchemistApp.state.getStatus());

  }
  private handleMainWindowMessage = async (_event, mainWindowMessage: string) => {
    if (mainWindowMessage === "inventoryMenuButtonClicked") {
      this.showInventoryWindow();
    } else if (mainWindowMessage === "addDropMenuButtonClicked") {
      this.showAddDropWindow();
    } else if (mainWindowMessage === "closeMenuButtonClicked") {
      this.closeMainWindow();
    }else if (mainWindowMessage === "loaded") {
      this.sendMainWindowStatus()
    }
  }




  private handleAddDropWindowMessage = async (_event, mainWindowMessage: string) => {
    if (mainWindowMessage === "loaded") {
      //should send the data
    } else if (mainWindowMessage === "savePriceCostTSV") {
      savePriceCostTSVPrompt()
    } 
  }

public showMainWindow() {
  
  if(this.mainWindow !== null)
  {
    this.mainWindow.show()
  }else{
    const mainWindow = this.getMainWindow();

    if (mainWindow !== null) {
      ipcMain.on("mainWindowMessage", this.handleMainWindowMessage);
  
      mainWindow.on("closed", () => {
        // Remove the IPC event listener when the window is closed
        ipcMain.removeListener("mainWindowMessage", this.handleMainWindowMessage);
        this.stopSendingStatusToMainWindow();
        this.mainWindow = null
      });
      
      const getIndexPath = resolveHtmlPath("index.html");
      console.log("getIndexPath", getIndexPath);
      //mainWindow.loadFile(path.join(__dirname, "/Resources/html/index.html"))
      mainWindow
        .loadURL(path.join(getIndexPath))
        .then(() => {
          this.sendStatusToMainWindow();
        })
        .then(() => {
          mainWindow.show();
        })
        .catch((error: Error) => {
          console.error(error);
        });


      const addDropObservable = AddDrop.state.lastRefreshCompleted$;
      const inventoryObservable = Inventory.state.lastRefreshCompleted$;
      if (mainWindow != null) {
        if (this.sendStatusToMainWindow !== null) {
          this.stopSendingStatusToMainWindow();
        }
        combineLatest([addDropObservable, inventoryObservable])
          .pipe(
            map(([addDropLastRefresh, inventoryLastRefresh]) => {
              console.log(
                `AddDrop Last refresh: ${formatDateForConsole(
                  addDropLastRefresh
                )}`
              );
              console.log(
                `Inventory Last Refresh: ${formatDateForConsole(
                  inventoryLastRefresh
                )}`
              );
              if (addDropLastRefresh !== 0 && inventoryLastRefresh !== 0) {
                console.log(`ONREADY: Add Drop and Inventory Ready: `);
                DalchemistApp.state.setStatus(DalchemistAppStatus.Running);
              }
            })
          )
          .subscribe();
      }
    }
  }
  
  
  }

  public getMainWindow(): BrowserWindow | null {
    if (this.mainWindow === null) {
      if (this.notReady) {
        return null;
      }

      const preloadPath = app.isPackaged
        ? path.join(__dirname, "preload.js")
        : path.join(__dirname, "../../build/preload.js");
      console.log("preload path", preloadPath);
      this.mainWindow = new BrowserWindow({
        width: 270,
        height: 350,
        show: false,
        frame: false,
        titleBarStyle: "customButtonsOnHover",
        titleBarOverlay: {
          color: "#2f3241",
          symbolColor: "#74b1be",
          height: "10px",
        },
        resizable: false,
        webPreferences: {
          preload: preloadPath, // Load preload script for the input dialog
          contextIsolation: true,
          nodeIntegration: false,
        },
      });
    }
    return this.mainWindow;
  }

  public getInventoryWindow(): BrowserWindow | null {
    if (this.inventoryWindow === null) {
      if (this.notReady) {
        return null;
      }

      const preloadPath = app.isPackaged
        ? path.join(__dirname, "preloadInventory.js")
        : path.join(__dirname, "../../build/preloadInventory.js");
      console.log("Add Drop preload path", preloadPath);
      this.inventoryWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
          preload: preloadPath, // Load preload script for the input dialog
          contextIsolation: true,
          nodeIntegration: false,
        },
      });
    }

    this.inventoryWindow.on('closed' , () =>{
            this.inventoryWindow = null
    })
    return this.inventoryWindow;
  }

  public getAddDropWindow(): BrowserWindow | null {
    if (this.addDropWindow === null) {
      if (this.notReady) {
        return null;
      }

      const preloadPath = app.isPackaged
        ? path.join(__dirname, "preloadAddDrop.js")
        : path.join(__dirname, "../../build/preloadAddDrop.js");
      console.log("Add Drop preload path", preloadPath);
      this.addDropWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
          preload: preloadPath, // Load preload script for the input dialog
          contextIsolation: true,
          nodeIntegration: true,
        },
      });
    }
    this.addDropWindow.on('closed' , () =>{
      this.addDropWindow = null
})
    return this.addDropWindow;
  }


  public getTabImporterWindow(): BrowserWindow | null {
    if (this.tabImporterWindow === null) {
      if (this.notReady) {
        return null;
      }

      this.tabImporterWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        titleBarOverlay: {
          color: "#2f3241",
          symbolColor: "#74b1be",
          height: "10px",
        },
        autoHideMenuBar: true,
        webPreferences: {
          contextIsolation: true,
         
      
           // Set this to false to use the default menu

        },
      });
    }
    this.tabImporterWindow.on('closed' , () =>{
      this.tabImporterWindow = null
})
    return this.tabImporterWindow;
  }

  public getIcon() {
    return app.isPackaged
      ? process.platform === "win32"
        ? "../../../icon/favicon.ico"
        : "../../../icon/icon32.png"
      : process.platform === "win32"
      ? "../../icon/favicon.ico"
      : "../../icon/icon32.png";
  }

  public quit() {
    app.quit();
  }
}

const formatDateForConsole = function (datetime: number): string {
  const lastRefreshDate = new Date(datetime);
  const formattedDate = lastRefreshDate.toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formattedDate;
};

function returnUserScancodeSearch(input: string): string {
  const inventory = Inventory.getInstance();

  function getLineFromScanCode(ScanCode: string): string {
    const entry = inventory.getEntryFromScanCode(ScanCode);
    return entry ? entry.valuesArray.join(" | ") : "No Item Found: " + ScanCode;
  }

  if (input.includes(",")) {
    const scanCodes = input.split(",").map((code) => code.trim());
    let returnString = "";
    scanCodes.forEach((ScanCode) => {
      returnString += getLineFromScanCode(ScanCode);
    });
    return returnString;
  } else {
    return getLineFromScanCode(input.trim());
  }
}


export function savePriceCostTSVPrompt(){

  const contentToSave = getAddDropPriceUpdatesTSV(AddDrop.state.priceUpdates)
  dialog
  .showSaveDialog({ defaultPath: "addDropPriceCost.txt" })
  .then((result) => {
    if (!result.canceled && result.filePath) {
      const filePath = result.filePath;
      saveStringToFile(contentToSave, filePath);
    }
  });
}

function saveStringToFile(content: string, filePath: string) {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("File saved successfully.");
  } catch (error) {
    console.error("Error saving file:", error);
  }
}
