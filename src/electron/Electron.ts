//
/*
import { app, BrowserWindow, Tray, Menu, ipcMain, dialog, IpcMainEvent } from "electron";

import {buildMenu} from "./Menu"

import * as path from "path";
import * as fs from "fs";
import * as http from "http";

import { Inventory } from "../Google/Inventory/Inventory";
import { BehaviorSubject, Observable, Subscription } from 'rxjs';





export class ElectronState {
  private statusSubject = new BehaviorSubject<ElectronStatus>(ElectronStatus.Preparing);


  public get status$(): Observable<ElectronStatus> {
    return this.statusSubject.asObservable();
  }


  public setStatus(status: ElectronStatus) {
    this.statusSubject.next(status);
  }

}


export enum ElectronStatus {
  Preparing = "Preparing",
  Initializing = "Initializing",
  Starting = 'Starting',
  Running = 'Running',
  Error = 'Error!'
}


export default class Electron {
  private static instance: Electron;
  static state: ElectronState =  new ElectronState();

  private notReady = true

  private mainWindow : BrowserWindow | null = null;
  

  public static getState(): ElectronState {
    return Electron.state;
  }
  public showFindDialog() {
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
  }


  static  getInstance(): Electron {
    if (!Electron.instance) {
      Electron.instance = new Electron();
    }
    return Electron.instance;
  }


  private  constructor() {
    Electron.state.setStatus(ElectronStatus.Initializing)

    console.log("🟩Electron-Strarting!");
   
    app.on("window-all-closed", this.onWindowsAllClosed);
    app.on("ready", this.onReady);

  }

  private  onWindowsAllClosed() {
    if (process.platform !== "darwin") {
      //  Main.application.quit();
    }
  }

  private  onReady(){
    Electron.state.setStatus(ElectronStatus.Starting)
    this.notReady = false;
    const mainWindow = this.getMainWindow()

    if(mainWindow !== null)
    {
      mainWindow.loadFile(path.join(__dirname, "/Resources/html/index.html"))
      .then(() => { mainWindow.webContents.send('sendElectronState', Electron.state); })
      .then(() => { mainWindow.show(); })
      .catch((error: Error) => {console.error(error)});

      const menu = buildMenu()

      // tray.setToolTip("Dalchemist");
      // tray.setContextMenu(menu);
    }

  }

  private getMainWindow()
    : BrowserWindow | null{
    
      if (this.mainWindow === null)
      {    
  
        if(this.notReady){
          return null
        }

        const preloadPath = path.join(__dirname, "preloadDialog.js");
        console.log("preload path" ,preloadPath)
        this.mainWindow =  new BrowserWindow(
          { width: 800, 
            height: 600,  
            show: false,
            webPreferences: {
              preload: preloadPath, // Load preload script for the input dialog
              contextIsolation: true,
              nodeIntegration: false,
              },
          });
      }
  
      return this.mainWindow
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

*/