import { AddDrop as GoogleAddDrop } from "../../Google/addDrop/addDrop";
import path from "path";
import { resolveHtmlPath } from "../Utility";
import { app, BrowserWindow } from "electron";
import DalchemistApp from "../DalchemistApp";
import { sendStateChangesToWindow, sendAddDropData } from "./ipc";
/**
 * AddDrop
 * Singlton Instance with State that handles the AddDrop Main Process for Electron
 */
export class AddDrop {
  private static instance: AddDrop;

  private window: BrowserWindow | null = null;

  private constructor() {
    GoogleAddDrop.getInstance();
  }

  static getInstance(): AddDrop {
    if (!AddDrop.instance) {
      AddDrop.instance = new AddDrop();
    }
    return AddDrop.instance;
  }

  public async showWindow() {
    const inventoryWindow = await this.getWindow();
    const getIndexPath = resolveHtmlPath("index.html", "/AddDrop");
    //const getIndexPath = resolveHtmlPath("inventory.html");

    console.log("AddDrop getIndexPath", getIndexPath);

    if (inventoryWindow !== null) {
      inventoryWindow
        .loadURL(getIndexPath)
        .then(() => {
          sendAddDropData();

          inventoryWindow.show();
        })
        .catch((error: Error) => {
          console.error(error);
        });
    }
  }

  public async getWindow(): Promise<BrowserWindow> {
    if (this.window === null) {
      await DalchemistApp.awaitOnReady();

      const preloadPath = app.isPackaged
        ? path.join(__dirname, "preloadCoreSets.js")
        : path.join(__dirname, "../../../build/AddDrop/View/preloadAddDrop.js");
      console.log("Add Drop preload path", preloadPath);
      this.window = new BrowserWindow({
        title: "AddDrop",
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
          preload: preloadPath, // Load preload script for the input dialog
          contextIsolation: true,
          nodeIntegration: false,
        },
      });

      this.window.on("closed", () => {
        this.window = null;
      });
      sendStateChangesToWindow();
    }

    return this.window;
  }
}
