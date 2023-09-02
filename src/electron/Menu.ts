import { Menu, dialog, Tray } from "electron";
import path from "path";
import * as http from "http";
import DalchemistApp from "./DalchemistApp";
import { resolveHtmlPath } from "./Utility";

import { AddDrop } from "../Google/addDrop/addDrop";
import { Inventory } from "../Google/Inventory/Inventory";

import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";

import fs from "fs";

export class DalchemistMainMenu {
  private dalchemistApp: DalchemistApp;
  private menu: Menu | null = null;

  constructor(dalchemistApp: DalchemistApp) {
    this.dalchemistApp = dalchemistApp;

    const faviconPath = path.join(__dirname, this.dalchemistApp.getIcon());
    const tray = new Tray(faviconPath);

    tray.setToolTip("Dalchemist");
    tray.setContextMenu(this.getMenu());

    const addDropObservable = AddDrop.state.lastRefreshCompleted$;
    const inventoryObservable = Inventory.state.lastRefreshCompleted$;

    combineLatest([addDropObservable, inventoryObservable])
      .pipe(
        map(([addDropLastRefresh, inventoryLastRefresh]) => {
          console.log(
            `MENU: AddDrop Last refresh: ${formatDateForConsole(
              addDropLastRefresh
            )}`
          );
          console.log(
            `MENU: Inventory Last Refresh: ${formatDateForConsole(
              inventoryLastRefresh
            )}`
          );
          if (addDropLastRefresh !== 0 && inventoryLastRefresh !== 0) {
            console.log(`MENU: Enabling menus:`);
            this.enableAddDropMenu();
            this.enableInventoryMenu();
            tray.setContextMenu(this.getMenu());
          }
        })
      )
      .subscribe();
  }

  private enableInventoryMenu() {
    const inventoryMenu = this.getMenu()?.getMenuItemById("inventory-menu");
    if (inventoryMenu) {
      inventoryMenu.enabled = true;
    }
  }
  private enableAddDropMenu() {
    const addDropMenu = this.getMenu()?.getMenuItemById("add-drop-menu");
    if (addDropMenu) {
      addDropMenu.enabled = true;
    }
  }

  private buildMenu() {
    const dalchemistApp = this.dalchemistApp;

    this.menu = Menu.buildFromTemplate([
      {
        id: "inventory-menu",
        label: "Inventory",
        click() {
          const mainWindow = dalchemistApp.getMainWindow();
          if (mainWindow !== null) {
            mainWindow.loadURL("http://localhost:4848/Inventory");
          }
        },
        submenu: [
          {
            label: "Find Scan Codes",
            click() {
              dalchemistApp.showFindDialog();
            },
          },
          {
            label: "All",
            click() {
              dalchemistApp.showInventoryWindow();
            },
          },
        ],
        enabled: false,
      },
      {
        label: "Add/Drop",
        id: "add-drop-menu",
        enabled: false,
        submenu: [
          {
            label: "Summary",
            click() {
              // const addDropWindow = dalchemistApp.getAddDropWindow();
              // const getIndexPath = resolveHtmlPath("addDrop.html");
              // console.log("Add Drop getIndexPath", getIndexPath);
              dalchemistApp.showAddDropWindow();
            },
          },
          {
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
                        .showSaveDialog({
                          defaultPath: "addDropPriceChanges.txt",
                        })
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
        ],
      },
      {
        label: "TabImporter",
        click() {
          const mainWindow = dalchemistApp.getMainWindow();
          mainWindow?.loadURL("https://coop-blake.github.io/tabImporter/");
        },
      },

      {
        label: process.platform === "win32" ? "Exit" : "Quit",
        click() {
          dalchemistApp.quit();
        },
      },
    ]);
  }

  public getMenu(): Menu | null {
    if (this.menu === null) {
      this.buildMenu();
    }
    return this.menu;
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
