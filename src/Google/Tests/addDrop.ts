import { AddDropState, AddDrop, AddDropStatus } from "../addDrop/addDrop";
import { Inventory, InventoryState, InventoryStatus } from "../Inventory/Inventory";


// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow
const inventoryInstance = Inventory.getInstance();


import express from "express";


import {
    getIndex,
    getNewItemsReport,
    getItemsAlreadyInInventoryReport,
    getPriceUpdatesInfo,
    getAddDropPriceUpdatesTSV,
  } from "../addDrop/htmlOutputs";
  
  

  
const addDropInstance = AddDrop.getInstance();

const statusSubscription = AddDrop.state.status$.subscribe((status: AddDropStatus) => {
  console.log(`AddDrop status changed: ${status}`);
});


const lastRefreshCompletedSubscription = AddDrop.state.lastRefreshCompleted$.subscribe((lastRefreshCompleted: number) => {

    if(lastRefreshCompleted === 0)
    {

    }else{
        const lastRefreshDate = new Date(lastRefreshCompleted);
        const formattedDate = lastRefreshDate.toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        console.log(`AddDrop Updated changed: ${formattedDate}`);
    
    }
    
  });


  setTimeout(() => {
    console.log("leaving")
   
  }, 2000);



  const dalchemist = express();

  
  dalchemist.get("/", (request, response) => {

    response.send(
      getIndex(
        AddDrop.state.newItems,
        AddDrop.state.itemsAlreadyInInventory,
        AddDrop.state.attributeChangeItems,
        AddDrop.state.priceUpdates
      )
    );
  });

  dalchemist.get("/newItems", async (request, response) => {
    response.send(getNewItemsReport(AddDrop.state.newItems));
  });

  dalchemist.get("/itemsAlreadyInInventory", async (request, response) => {
    response.send(getItemsAlreadyInInventoryReport(AddDrop.state.itemsAlreadyInInventory));
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
    console.log("ok")
  });