import { resolveHtmlPath, formatDateForConsole } from "./Utility";
//import { createAndSetApplicationMenu } from "./Main/AppMenu";
import { app, BrowserWindow, ipcMain, IpcMainInvokeEvent } from "electron";
import path from "path";

import { BehaviorSubject, Observable, combineLatest, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { DalchemistMainMenu } from "./Menu";
import { AddDrop as GoogleAddDrop } from "../Google/addDrop/addDrop";
import { AddDrop } from "./AddDrop/AddDrop";
import { Inventory as GoogleInventory } from "../Google/Inventory/Inventory";
import { Inventory } from "./Inventory/Inventory";
import { CoreSets } from "./CoreSupport/CoreSets";

import { sendMainWindowStatus } from "./ipc";
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
    return this.statusSubject.getValue();
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

  public static awaitOnReady(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (app.isReady()) {
        resolve();
      } else {
        app.on("ready", () => {
          resolve();
        });
      }
    });
  }

  static state: DalchemistAppState = new DalchemistAppState();
  public notReady = true;
  private mainWindow: BrowserWindow | null = null;
  private sendingStatusToWindow: Subscription | null = null;
  private mainMenu: DalchemistMainMenu | null = null;

  public static getState(): DalchemistAppState {
    return DalchemistApp.state;
  }

  static getInstance(): DalchemistApp {
    if (!DalchemistApp.instance) {
      DalchemistApp.instance = new DalchemistApp();
    }
    return DalchemistApp.instance;
  }

  private constructor() {
    DalchemistApp.state.setStatus(DalchemistAppStatus.Initializing);
    app.whenReady().then(() => {
      app.on("window-all-closed", this.onWindowAllClosed);
      this.onReady();
    });
  }

  private onWindowAllClosed() {
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
          if (status.includes("rror")) {
            mainWindow.webContents.send("error", status);
          } else {
            mainWindow.webContents.send("status", status);
          }
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
    AddDrop.getInstance().showWindow();
  }

  public showCoreSetsWindow() {
    CoreSets.getInstance().showCoreSetsWindow();
  }

  public closeMainWindow() {
    const mainWindow = this.mainWindow;
    if (mainWindow !== null) {
      mainWindow.close();
    }
  }

  private onReady() {
    DalchemistApp.state.setStatus(DalchemistAppStatus.Starting);
    this.notReady = false;
    this.mainMenu = new DalchemistMainMenu(this);
    this.showMainWindow();
    ipcMain.on("mainWindowMessage", this.handleMainWindowMessage);

    combineLatest([
      GoogleAddDrop.state.lastRefreshCompleted$,
      GoogleInventory.state.lastRefreshCompleted$,
    ])
      .pipe(
        map(([addDropLastRefresh, inventoryLastRefresh]) => {
          console.log(
            `AddDrop Last refresh: ${formatDateForConsole(addDropLastRefresh)}`
          );
          console.log(
            `GoogleInventory Last Refresh: ${formatDateForConsole(
              inventoryLastRefresh
            )}`
          );
          if (addDropLastRefresh !== 0 && inventoryLastRefresh !== 0) {
            console.log(`ONREADY: Add Drop and GoogleInventory Ready: `);
            DalchemistApp.state.setStatus(DalchemistAppStatus.Running);
            this.onDataUpdate(addDropLastRefresh, inventoryLastRefresh);
          }
        })
      )
      .subscribe();
    //createAndSetApplicationMenu();
    //edit this to merge the menus to a customized one
  }
  /**
   * onDataUpdate
   * @description This is called from Combined Subscription created in onReady.
   * It checks to see if both the AddDrop and Inventory have been refreshed.
   * Once they have, it sets the status to Running
   */
  private onDataUpdate(
    addDropLastRefresh: number,
    inventoryLastRefresh: number
  ) {
    const dalchemistStatus = DalchemistApp.state.getStatus();
    if (
      dalchemistStatus !== DalchemistAppStatus.Running &&
      addDropLastRefresh !== 0 &&
      inventoryLastRefresh !== 0
    ) {
      DalchemistApp.state.setStatus(DalchemistAppStatus.Running);
    }
  }

  private handleMainWindowMessage = async (
    _event: IpcMainInvokeEvent,
    mainWindowMessage: string
  ) => {
    console.log("CLICK RECEIVED");
    if (mainWindowMessage === "inventoryMenuButtonClicked") {
      Inventory.getInstance().showWindow();
    } else if (mainWindowMessage === "addDropMenuButtonClicked") {
      this.showAddDropWindow();
    } else if (mainWindowMessage === "coreSetsMenuButtonClicked") {
      console.log("CLICK RECEIVED");
      this.showCoreSetsWindow();
    } else if (mainWindowMessage === "closeMenuButtonClicked") {
      this.closeMainWindow();
    } else if (mainWindowMessage === "loaded") {
      sendMainWindowStatus();
    }
  };

  public showInventoryWindow() {
    Inventory.getInstance().showWindow();
  }
  public showMainWindow() {
    if (this.mainWindow !== null) {
      this.mainWindow.show();
    } else {
      const mainWindow = this.getMainWindow();
      if (mainWindow !== null) {
        mainWindow.on("closed", () => {
          this.stopSendingStatusToMainWindow();
          this.mainWindow = null;
        });
        const getIndexPath = resolveHtmlPath("index.html");
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
        if (mainWindow != null) {
          if (this.sendStatusToMainWindow !== null) {
            this.stopSendingStatusToMainWindow();
          }
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
        height: 400,
        show: false,
        frame: false,
        titleBarStyle: "customButtonsOnHover",
        titleBarOverlay: {
          color: "#2f3241",
          symbolColor: "#74b1be",
          height: 10,
        },
        resizable: true,
        webPreferences: {
          preload: preloadPath,
          contextIsolation: true,
          nodeIntegration: false,
        },
      });
    }
    return this.mainWindow;
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
