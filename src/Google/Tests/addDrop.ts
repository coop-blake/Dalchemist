import { AddDrop } from "../addDrop/addDrop";
import { AddDropStatus } from "../addDrop/shared";

import { Inventory } from "../Inventory/Inventory";

Inventory.getInstance(); //make sure an initial instance is created
AddDrop.getInstance();
//todo: above lines should be in Inventory

import express from "express";

import {
  getIndex,
  getNewItemsReport,
  getItemsAlreadyInInventoryReport,
  getPriceUpdatesInfo,
  getAddDropPriceUpdatesTSV
} from "../addDrop/htmlOutputs";

AddDrop.state.status$.subscribe((status: AddDropStatus) => {
  console.log(`AddDrop status changed: ${status}`);
});

AddDrop.state.lastRefreshCompleted$.subscribe(
  (lastRefreshCompleted: number) => {
    if (lastRefreshCompleted !== 0) {
      const lastRefreshDate = new Date(lastRefreshCompleted);
      const formattedDate = lastRefreshDate.toLocaleString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      console.log(`AddDrop Updated changed: ${formattedDate}`);
    }
  }
);

setTimeout(() => {
  console.log("leaving");
}, 2000);

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
});
