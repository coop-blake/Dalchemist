//
import { URL } from 'url';

import { app, BrowserWindow , ipcMain, IpcMainInvokeEvent} from "electron";
import * as path from "path";
import { BehaviorSubject, Observable } from 'rxjs';
import { DalchemistMainMenu } from "./Menu";

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';


import { AddDrop } from "../Google/addDrop/addDrop";
import { Inventory } from "../Google/Inventory/Inventory";


export class DalchemistAppState {
  private statusSubject = new BehaviorSubject<DalchemistAppStatus>(DalchemistAppStatus.Preparing);


  public get status$(): Observable<DalchemistAppStatus> {
    return this.statusSubject.asObservable();
  }


  public setStatus(status: DalchemistAppStatus) {
    this.statusSubject.next(status);
  }

}


export enum DalchemistAppStatus {
  Preparing = "Preparing",
  Initializing = "Initializing",
  Starting = 'Starting',
  Running = 'Running',
  Error = 'Error!'
}


export default class DalchemistApp {
  private static instance: DalchemistApp;
  static state: DalchemistAppState =  new DalchemistAppState();

  private notReady = true

  private mainWindow : BrowserWindow | null = null;
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

    const searchInventoryAndShowResults  =  (_ipcEvent : IpcMainInvokeEvent, 
      lookingFor : string) => {
  
     const output =  returnUserScancodeSearch(lookingFor)

     this.getMainWindow()?.loadURL(
       `data:text/html;charset=utf-8,${encodeURIComponent(output)}`
     );
     win.close();
   }

   win.on('closed', () => {
     // Remove the IPC event listener when the window is closed
     ipcMain.removeListener("searchInventory", searchInventoryAndShowResults);
   });

   ipcMain.handle('searchInventory', searchInventoryAndShowResults)
  }


  static  getInstance(): DalchemistApp {
    if (!DalchemistApp.instance) {
      DalchemistApp.instance = new DalchemistApp();
    }
    return DalchemistApp.instance;
  }


  private  constructor() {
    DalchemistApp.state.setStatus(DalchemistAppStatus.Initializing)

    console.log("🟩DalchemistApp-Strarting!");
   
   // app.on("window-all-closed", this.onWindowsAllClosed);
   // app.on("ready", this.onReady);

    app.whenReady().then(() => {
      console.log("DalchemistApp-onReady!");
      this.onReady()
    })

  }

 

  private  onReady(){
    
    DalchemistApp.state.setStatus(DalchemistAppStatus.Starting)
    this.notReady = false;
    const mainWindow = this.getMainWindow()

    if(mainWindow !== null)
    {
      const getIndexPath = resolveHtmlPath('index.html');
      console.log("getIndexPath", getIndexPath)
      //mainWindow.loadFile(path.join(__dirname, "/Resources/html/index.html"))
      mainWindow.loadURL(path.join(getIndexPath))
      .then(() => { mainWindow.webContents.send('status', "started ll"); })
      .then(() => { mainWindow.show(); })
      .catch((error: Error) => {console.error(error)});

    this.mainMenu = new DalchemistMainMenu(this)

     const addDropObservable = AddDrop.state.lastRefreshCompleted$
     const inventoryObservable = Inventory.state.lastRefreshCompleted$
     combineLatest([addDropObservable,inventoryObservable]).pipe(
      map( ([addDropLastRefresh, inventoryLastRefresh]) => {
        console.log(`AddDrop Last refresh: ${formatDateForConsole(addDropLastRefresh)}`)
        console.log(`Inventory Last Refresh: ${formatDateForConsole(inventoryLastRefresh)}`)
        if(addDropLastRefresh !== 0 && inventoryLastRefresh !== 0)
        {
          console.log(`ONREADY: Add Drop and Inventory Ready: `);
          mainWindow.webContents.send('message-from-main', "Finished");
          
        }
      }
    )).subscribe();
    }

  }

  public getMainWindow()
    : BrowserWindow | null{

      if (this.mainWindow === null)
      {    
  
        if(this.notReady){
          return null
        }

        const preloadPath =app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, "../../build/preload.js");
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


    public getIcon() {
      return process.platform === "win32"
        ? "../../icon/favicon.ico"
        : "../../icon/icon.png";
    }

    public quit() {
      app.quit()
    }
  }


  const formatDateForConsole = function (datetime: number) : string{
    const lastRefreshDate = new Date(datetime);
    const formattedDate = lastRefreshDate.toLocaleString(undefined, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  return formattedDate
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



  function resolveHtmlPath(htmlFileName: string) {
    if (process.env.NODE_ENV === 'development') {
      console.log("getIndexPath:htmlFileName", htmlFileName)

      const port = process.env.PORT || 1212;
      const url = new URL(`http://localhost:${port}`);
      url.pathname = htmlFileName;
      console.log("getIndexPath:url.href", url.href)

      return url.href;
    }
    console.log("getIndexPath:file", __dirname, `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`)

    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  }