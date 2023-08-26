import { app, BrowserWindow } from "electron";
import Main from "./electron-main";
//import { start } from "../Google/addDrop/addDrop"

import express from "express";
import {
  NewItemEntry,
  AttributeChangeEntry,
  AddDrop,
  AddDropStatus,
} from "../Google/addDrop/addDrop";

import {
  getIndex,
  getNewItemsReport,
  getItemsAlreadyInInventoryReport,
  getPriceUpdatesInfo,
  getAddDropPriceUpdatesTSV,
} from "../Google/addDrop/htmlOutputs";

Main.main(app, BrowserWindow);

const lastRefreshCompletedSubscription =
  AddDrop.state.lastRefreshCompleted$.subscribe(
    (lastRefreshCompleted: number) => {
      if (lastRefreshCompleted === 0) {
      } else {
        const lastRefreshDate = new Date(lastRefreshCompleted);
        const formattedDate = lastRefreshDate.toLocaleString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        console.log(`AddDrop Updated changed: ${formattedDate}`);
        Main.start();
      }
    }
  );

const dalchemist = express();

dalchemist.get("/", (request, response) => {
  response.send(getIndex());
});

dalchemist.get("/newItems", async (request, response) => {
  response.send(getNewItemsReport(AddDrop.state.newItems));
});

dalchemist.get("/itemsAlreadyInInventory", async (request, response) => {
  response.send(
    getItemsAlreadyInInventoryReport(AddDrop.state.itemsAlreadyInInventory)
  );
});
dalchemist.get("/priceUpdateInfo", async (request, response) => {
  response.send(getPriceUpdatesInfo(AddDrop.state.priceUpdates));
});
dalchemist.get("/addDropPriceChanges.txt", async (request, response) => {
  response.setHeader(
    "Content-Disposition",
    'attachment; filename="addDropPriceChanges.txt"'
  );
  response.setHeader("Content-Type", "text/tab-separated-values");

  response.send(getAddDropPriceUpdatesTSV(AddDrop.state.priceUpdates));
});

getAddDropPriceUpdatesTSV;
dalchemist.listen(4848, () => {
  console.log("ok");

  console.log("Web Server Started");
});
