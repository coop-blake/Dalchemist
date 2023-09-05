import { Menu, Tray } from "electron";
import path from "path";
import * as http from "http";
import {DalchemistApp, savePriceCostTSVPrompt} from "./DalchemistApp";
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
        id: "main-menu",
        label: "Dalchemist",
        click() {
          dalchemistApp.showMainWindow()
        },
        accelerator: 'CommandOrControl+D'

      },
      // {
      //   id: "inventory-menu",
      //   label: "Inventory",
      //   submenu: [
      //     {
      //       label: "Find Scan Codes",
      //       click() {
      //         dalchemistApp.showFindDialog();
      //       },
      //     },
      //     {
      //       label: "All",
      //       click() {
      //         dalchemistApp.showInventoryWindow();
      //       },
      //     },
      //   ],
      //   enabled: false,
      // },

      {
        id: "inventory-menu",
        label: "Inventory",
        click() {
          dalchemistApp.showInventoryWindow();
        },
        enabled: false,
        accelerator: 'CommandOrControl+I'


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
            accelerator: 'CommandOrControl+A'
          },
          {
            label: "Save Add Drop Price Change",
            click() {
              savePriceCostTSVPrompt()
            },
            accelerator: 'CommandOrControl+S'
          },
        ],
      },
      {
        label: "TabImporter",
        click() {
         dalchemistApp.showTabImporterWindow()
        },
      },

      {
        label: process.platform === "win32" ? "Exit" : "Quit",
        click() {
          dalchemistApp.quit();
        },
        accelerator: 'CommandOrControl+Q'

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
