//

import { app, BrowserWindow, Tray } from "electron";
import * as path from "path";
import { BehaviorSubject, Observable } from 'rxjs';
import { buildMenu } from "./Menu";

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
  


  public static getState(): DalchemistAppState {
    return DalchemistApp.state;
  }
  public showFindDialog() {
    const preloadPath = path.join(__dirname, "preloadDialog.js");
    console.log("preload path", preloadPath);
     new BrowserWindow({
      width: 300,
      height: 150,
      webPreferences: {
        preload: preloadPath, // Load preload script for the input dialog

        nodeIntegration: true,
      },
    });
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
   
    app.on("window-all-closed", this.onWindowsAllClosed);
   // app.on("ready", this.onReady);

    app.whenReady().then(() => {
      console.log("DalchemistApp-onReady!");
      this.onReady()
    })

  }

  private  onWindowsAllClosed() {
    if (process.platform !== "darwin") {
      //  Main.application.quit();
    }
  }

  private  onReady(){
    
    DalchemistApp.state.setStatus(DalchemistAppStatus.Starting)
    this.notReady = false;
    const mainWindow = this.getMainWindow()

    if(mainWindow !== null)
    {
      mainWindow.loadFile(path.join(__dirname, "/Resources/html/index.html"))
      .then(() => { mainWindow.webContents.send('message-from-main', "started ll"); })
      .then(() => { mainWindow.show(); })
      .catch((error: Error) => {console.error(error)});

    const menu = buildMenu(this)

    const faviconPath = path.join(__dirname, this.getIcon());

    console.log("Favicon", faviconPath);
    const tray = new Tray(faviconPath);


      tray.setToolTip("Dalchemist");
     tray.setContextMenu(menu);


     const addDropObservable = AddDrop.state.lastRefreshCompleted$
     const inventoryObservable = Inventory.state.lastRefreshCompleted$


     combineLatest([addDropObservable,inventoryObservable]).pipe(
      map( ([addDropLastRefresh, inventoryLastRefresh]) => {
        console.log(`AddDrop Last refresh: ${formatDateForConsole(addDropLastRefresh)}`)
        console.log(`Inventory Last Refresh: ${formatDateForConsole(inventoryLastRefresh)}`)
        if(addDropLastRefresh !== 0 && inventoryLastRefresh !== 0)
        {
          console.log(`Add Drop and Inventory Ready: `);
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

        const preloadPath = path.join(__dirname, "../../build/preload.js");
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


    private getIcon() {
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