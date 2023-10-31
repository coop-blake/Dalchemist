import { Inventory as GoogleInventory } from "../../Google/Inventory/Inventory";
import path from "path";
import { resolveHtmlPath } from "../Utility";
import { app, BrowserWindow } from "electron";
import DalchemistApp from "../DalchemistApp";
import { sendStateChangesToWindow, sendInventoryData } from "./ipc";
/**
 * Inventory
 * Singlton Instance with State that handles the Inventory Main Process for Electron
 */
export class Inventory {
  private static instance: Inventory;

  private window: BrowserWindow | null = null;

  private constructor() {
    GoogleInventory.getInstance();
  }

  static getInstance(): Inventory {
    if (!Inventory.instance) {
      Inventory.instance = new Inventory();
    }
    return Inventory.instance;
  }

  public async showWindow() {
    const inventoryWindow = await this.getWindow();
    const getIndexPath = resolveHtmlPath("index.html", "/Inventory");
    //const getIndexPath = resolveHtmlPath("inventory.html");

    console.log("Inventory getIndexPath", getIndexPath);

    if (inventoryWindow !== null) {
      inventoryWindow
        .loadURL(getIndexPath)
        .then(() => {
          sendInventoryData();

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
        : path.join(
            __dirname,
            "../../../build/Inventory/View/preloadInventory.js"
          );
      console.log("Add Drop preload path", preloadPath);
      this.window = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        webPreferences: {
          preload: preloadPath, // Load preload script for the input dialog
          contextIsolation: true,
          nodeIntegration: false
        }
      });

      this.window.on("closed", () => {
        this.window = null;
      });
      sendStateChangesToWindow();
    }

    return this.window;
  }
}
