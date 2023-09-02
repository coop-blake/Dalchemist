// import { app, BrowserWindow } from "electron";
// //import Main from "./electron-main";

// //import { start } from "../Google/addDrop/addDrop"

// import express from "express";
// import { AddDrop } from "../Google/addDrop/addDrop";
// import { Inventory } from "../Google/Inventory/Inventory";

// import { combineLatest } from 'rxjs';
// import { map } from 'rxjs/operators';

// import {
//   getIndex,
//   getNewItemsReport,
//   getItemsAlreadyInInventoryReport,
//   getPriceUpdatesInfo,
//   getAddDropPriceUpdatesTSV,
// } from "../Google/addDrop/htmlOutputs";

// Main.main(app, BrowserWindow);

// //const lastRefreshCompletedSubscription =

// const dalchemist = express();

// dalchemist.get("/", (request, response) => {
//   response.send(getIndex());
// });

// dalchemist.get("/newItems", async (request, response) => {
//   response.send(getNewItemsReport(AddDrop.state.newItems));
// });

// dalchemist.get("/itemsAlreadyInInventory", async (request, response) => {
//   response.send(
//     getItemsAlreadyInInventoryReport(AddDrop.state.itemsAlreadyInInventory)
//   );
// });
// dalchemist.get("/priceUpdateInfo", async (request, response) => {
//   response.send(getPriceUpdatesInfo(AddDrop.state.priceUpdates));
// });
// dalchemist.get("/addDropPriceChanges.txt", async (request, response) => {
//   response.setHeader(
//     "Content-Disposition",
//     'attachment; filename="addDropPriceChanges.txt"'
//   );
//   response.setHeader("Content-Type", "text/tab-separated-values");

//   response.send(getAddDropPriceUpdatesTSV(AddDrop.state.priceUpdates));
// });

// getAddDropPriceUpdatesTSV;
// dalchemist.listen(4848, () => {
//   console.log("ok");

//   console.log("Web Server Started");

// const addDropObservable = AddDrop.state.lastRefreshCompleted$
// const inventoryObservable = Inventory.state.lastRefreshCompleted$

// console.log("Got Observables");

// combineLatest([addDropObservable,inventoryObservable]).pipe(
//   map( ([addDropLastRefresh, inventoryLastRefresh]) => {
//     console.log(`AddDrop Last refresh: ${formatDateForConsole(addDropLastRefresh)}`)
//     console.log(`Inventory Last Refresh: ${formatDateForConsole(inventoryLastRefresh)}`)
//     if(addDropLastRefresh !== 0 && inventoryLastRefresh !== 0)
//     {
//       console.log(`Starting and testing Inventory: `);
//       Main.start();
//       const entry = Inventory.getInstance().getEntryFromScanCode("1551")
//           if(entry !== undefined)
//           {
//               console.log(`Scancoded: 1551 ${entry.Name}`);

//           }
//     }
//   }
// )).subscribe();
// console.log("Combined");

// });

// const formatDateForConsole = function (datetime: number) : string{
//   const lastRefreshDate = new Date(datetime);
//   const formattedDate = lastRefreshDate.toLocaleString(undefined, {
//     year: "numeric",
//     month: "numeric",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });
// return formattedDate
// }
