import { Inventory } from "./Inventory";

import * as electron from "electron";
import Main from "../../electron/electron-main";

const app = electron.app;

Main.main(app, BrowserWindow);

console.log("startedchecking inventory", Inventory.getInstance().getStatus());
