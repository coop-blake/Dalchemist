import { NewItemEntry, AttributeChangeEntry } from "../../../Google/addDrop/addDrop";
import { ipcRenderer } from "electron";
import{InventoryEntry} from "../../../Google/Inventory/Inventory"
import "../css/addDrop.css";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

import { CellComponent, TabulatorFull as Tabulator } from "tabulator-tables";

import {onReady, show, hide, formatTimestampToMinute} from '../../Utility'


let newItems: Array<NewItemEntry> = [];
let newItemsTable: Tabulator | null = null;
let newItemsReceived = false

let newItemsInInventory: Array<NewItemInEnventory> = [];
let newItemsInInventoryTable: Tabulator | null = null;
let newItemsInInventoryReceived = false



let changeItems: Array<AttributeChangeEntry> = [];
let changeItemsTable: Tabulator | null = null;
let changeItemsReceived = false


let priceChangeItems: Array<AttributeChangeEntry> = [];
let priceChangeItemsTable: Tabulator | null = null;
let priceChangeItemsReceived = false

/*####################################################################
#  Events From Main Thread  ##########################################
####################################################################*/ 

ipcRenderer.on(
  "newItemsArray",
  (event, newItemsArray: Array<NewItemEntry>) => {
        newItemsReceived = true
    if(typeof newItemsArray !== 'undefined'){
      console.log(newItemsArray);
      newItems = newItemsArray;
      newItemsArrayUpdated();
    }else{
      console.log("New Items Array undefined");
redraw()
    }
  }
);

ipcRenderer.on("addDropDataLastReload", (event, lastAddDropLastRefresh : number) => {
  window.document.title = `AddDrop last retreived: ${formatTimestampToMinute(lastAddDropLastRefresh)}`
})

ipcRenderer.on("itemsAlreadyInInventory", (event, newItemsInInventoryArray : Array<[NewItemEntry, InventoryEntry]>) => {
  // eslint-disable-next-line no-console
  console.log("itemsAlreadyInInventory", newItemsInInventoryArray);

  newItemsInInventoryReceived = true
  // eslint-disable-next-line no-console
  if(typeof newItemsInInventoryArray !== 'undefined'){
    console.log("itemsAlreadyInInventory", newItemsInInventoryArray);
    newItemsInInventory = newItemsInInventoryArray.map((item => {

      const newItem = item[0]
      const inventoryItem = item[1]
        const returnItem = {
          ScanCode : inventoryItem.ScanCode,

          inventoryDefaultSupplier: inventoryItem.DefaultSupplier,
          inventoryDepartment: inventoryItem.Department,
          inventoryBrand: inventoryItem.Brand,
          inventoryName: inventoryItem.Name,
          inventorySize: inventoryItem.Size,
          inventoryReceiptAlias: inventoryItem.ReceiptAlias,
          inventoryBasePrice: inventoryItem.BasePrice,
          inventoryLastCost: inventoryItem.LastCost,
          inventoryAverageCost: inventoryItem.AverageCost,
          inventorySubDepartment: inventoryItem.SubDepartment,
          inventoryIdealMargin: inventoryItem.IdealMargin,
          inventoryQuantity: inventoryItem.Quantity,
          inventoryUnit: inventoryItem.Unit,
          inventorySupplierUnitID: inventoryItem.SupplierUnitID,
          inventoryCaseCost: `$${String((parseFloat(inventoryItem.Quantity) * parseFloat(inventoryItem.LastCost.replace("$",""))))}`,



          newItemDate: newItem.Date,
          newItemClient: newItem.Client,
          newItemScanCode: newItem.ScanCode,
          newItemSupplier: newItem.Supplier,
          newItemSupplierItemID: newItem.SupplierItemID,
          newItemBrand: newItem.Brand,
          newItemName: newItem.Name,
          newItemUnit: newItem.Unit,
          newItemSubDepartment: newItem.SubDepartment,
          newItemQuantity: newItem.Quantity,
          newItemCaseCost: newItem.CaseCost,
          newItemUnitCost: newItem.UnitCost,
          newItemMARGIN: newItem.MARGIN,
          newItemShippingPercent: newItem.ShippingPercent,
          newItemProposedPrice: newItem.ProposedPrice,
          newItemBasePrice: newItem.BasePrice,
          newItemDepartment: newItem.Department,
          newItemBottleDepositFlag: newItem.BottleDepositFlag,
          newItemLocalDirectFlag: newItem.LocalDirectFlag,
          newItemLocalSixFlag: newItem.LocalSixFlag,
          newItemLocalORFlag: newItem.LocalORFlag,
          newItemOGFlag: newItem.OGFlag,
          newItemFlipChartAddFlag: newItem.FlipChartAddFlag,
          newItemComments: newItem.Comments,

        }

        return returnItem
    }))
    newItemsInInventoryUpdated();
  }else{
    console.log("Change Items Array undefined");
    redraw()
  }
});

//Attribute Changes
ipcRenderer.on("attributeChangeItems", (event, changeItemsArray: Array<AttributeChangeEntry>) => {
  changeItemsReceived = true
  // eslint-disable-next-line no-console
  if(typeof changeItemsArray !== 'undefined'){
    console.log("attributeChangeItems", changeItemsArray);
    changeItems = changeItemsArray
    changeItemsArrayUpdated();
  }else{
    console.log("Change Items Array undefined");
    redraw()
  }
  
});

//Prive Changes
ipcRenderer.on("priceUpdates", (event, priceChangeItemsArray:  Array<AttributeChangeEntry>) => {
  // eslint-disable-next-line no-console
  console.log("priceUpdates", priceChangeItemsArray);

  priceChangeItemsReceived = true
  // eslint-disable-next-line no-console
  if(typeof priceChangeItemsArray !== 'undefined'){
    console.log("attributeChangeItems", priceChangeItemsArray);
    priceChangeItems = priceChangeItemsArray
    priceChangeItemsUpdated();
  }else{
    console.log("Change Items Array undefined");
    redraw()
  }
});


/*####################################################################
#  Data updated Functions                             ################
####################################################################*/ 



function newItemsArrayUpdated  () {

  if(newItems.length>0){
    //Create table or set data
    if(newItemsTable === null){
      newItemsTable = new Tabulator("#newItemsTable", {
        data: newItems, //load row data from array
        movableColumns: true, //allow column order to be changed
        columns: [
          {title: "Client", field: "Client", frozen: true},
          {title: "Comments", field: "Comments", frozen: true},
          {title: "ScanCode", field: "ScanCode", frozen: true},
          {title: "Brand", field: "Brand", frozen: true},
          {title: "Name", field: "Name", frozen: true},
          {title: "Unit", field: "Unit", frozen: true},
          {title: "Department", field: "Department"},
          {title: "SubDepartment", field: "SubDepartment"},
          {title: "🍺", field: "BottleDepositFlag"},
          {title: "LD", field: "LocalDirectFlag"},
          {title: "L6", field: "LocalSixFlag"},
          {title: "LOR", field: "LocalORFlag"},
          {title: "OG", field: "OGFlag"},
          {title: "🖥️", field: "FlipChartAddFlag"},
          {title: "BasePrice", field: "BasePrice"},
          {title: "Supplier", field: "Supplier"},
          {title: "SupplierItemID", field: "SupplierItemID"},
          {title: "Quantity", field: "Quantity"},
          {title: "CaseCost", field: "CaseCost"},
          {title: "UnitCost", field: "UnitCost"},
          {title: "MARGIN", field: "MARGIN"},
          {title: "ShippingPercent", field: "ShippingPercent"},
          {title: "ProposedPrice", field: "ProposedPrice"},
        ]
      });
      }else{
      newItemsTable.setData(newItems)
      }
  }
  
  redraw();
}
function newItemsInInventoryUpdated(){
  if(newItemsInInventory.length>0){
    //Create table or set data
    if(newItemsInInventoryTable === null){

      const newEntryTextColor = "#2b292b"
      const newEntryBackgroundColor = "rgba(144, 238, 144, 0.514)"
      const inventoryEntryTextColor = "#2b292b"
      const inventoryEntryBackgroundColor = "rgb(221, 178, 219)"

      newItemsInInventoryTable = new Tabulator("#alreadyItemsTable", {
        data: newItemsInInventory, //load row data from array
        movableColumns: true, //allow column order to be changed
        columns: [
          {title: "Client", field: "newItemClient", frozen: true},
          {title: "Comments", field: "newItemComments", frozen: true},
          {title: "ScanCode", field: "ScanCode", frozen: true},

          {title: "New Brand", field: "newItemBrand", formatter:styleFormatter, formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},
          {title: "New Name", field: "newItemName", formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor} },
          {title: "New Unit", field: "newItemUnit",  formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor} },

          {title: "Brand", field: "inventoryBrand",  formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},
          {title: "Name", field: "inventoryName", formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},
          {title: "Unit", field: "inventorySize", formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},

          {title: "New Department", field: "newItemDepartment", formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},
          {title: "New SubDepartment", field: "newItemSubDepartment", formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},

          {title: "Department", field: "inventoryDepartment", formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},
          {title: "SubDepartment", field: "inventorySubDepartment", formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},

          
          {title: "New Price", field: "newItemProposedPrice",  formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},
          {title: "New Cost", field: "newItemUnitCost",  formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},

          {title: "Price", field: "inventoryBasePrice", formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},
          {title: "Cost", field: "inventoryLastCost", formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},


          {title: "New Supplier", field: "newItemSupplier",formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},
          {title: "New SupItemID", field: "newItemSupplierItemID",formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},
          {title: "New Quantity", field: "newItemQuantity",formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},
          {title: "New CaseCost", field: "newItemCaseCost",formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},
          {title: "New Margin", field: "newItemMARGIN",formatter:styleFormatter,formatterParams: {textColor: newEntryTextColor, backgroundColor: newEntryBackgroundColor}},

          {title: "Supplier", field: "inventoryDefaultSupplier",formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},
          {title: "SupItemID", field: "inventorySupplierUnitID",formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},
          {title: "Quantity", field: "inventoryQuantity",formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},
          {title: "CaseCost", field: "inventoryCaseCost",formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},
          {title: "Margin", field: "inventoryIdealMargin",formatter:styleFormatter,formatterParams: {textColor: inventoryEntryTextColor, backgroundColor: inventoryEntryBackgroundColor}},

         
        ]
      });
      }else{
        newItemsInInventoryTable.setData(newItemsInInventory)
      }
  }
  
  redraw();
}
function changeItemsArrayUpdated () {

  if (changeItems.length > 0)
  {
    if(changeItemsTable === null)
    {
        changeItemsTable =  new Tabulator("#changeItemsTable", {
          data: changeItems, //load row data from array
          movableColumns: true, //allow column order to be changed
          columns: [
            // { title: "Date", field: "Date"},
              { title: "Client", field: "Client", frozen: true},
              { title: "ScanCode", field: "ScanCode", frozen: true},
              { title: "Comments", field: "Comments", frozen: true},
              { title: "ChangeOne", field: "ChangeOne", frozen: true},
              { title: "ChangeTwo", field: "ChangeTwo", frozen: true},
              { title: "ChangeThree", field: "ChangeThree", frozen: true},
              { title: "ChangeFour", field: "ChangeFour", frozen: true},
              { title: "Supplier", field: "Supplier"},
              { title: "Sup Item ID", field: "SupplierItemID"},
              { title: "Brand", field: "Brand"},
              { title: "Name", field: "Name"},
              { title: "Unit", field: "Unit"},
              { title: "SubDepartment", field: "SubDepartment"},
              { title: "Quantity", field: "Quantity"},
              { title: "CaseCost", field: "CaseCost"},
              { title: "UnitCost", field: "UnitCost"},
              { title: "MARGIN", field: "MARGIN"},
              { title: "ShippingPercent", field: "ShippingPercent"},
              { title: "ProposedPrice", field: "ProposedPrice"},
              { title: "BasePrice", field: "BasePrice"},
              { title: "Department", field: "Department"},
              { title: "BottleDepositFlag", field: "BottleDepositFlag"},
              { title: "LocalDirectFlag", field: "LocalDirectFlag"},
              { title: "LocalSixFlag", field: "LocalSixFlag"},
              { title: "LocalORFlag", field: "LocalORFlag"},
              { title: "OGFlag", field: "OGFlag"},
              { title: "BestDateForPriceChange", field: "BestDateForPriceChange"},
              { title: "BestTimeForPriceChange", field: "BestTimeForPriceChange"}
         ]
        });
    } else {
      changeItemsTable.setData(changeItems)
    }

  }

 

  redraw();
}
function priceChangeItemsUpdated(){
 if (changeItems.length > 0)
  {
    if(priceChangeItemsTable === null)
    {
      priceChangeItemsTable =  new Tabulator("#priceChangesTable", {
          data: priceChangeItems, //load row data from array
          movableColumns: true, //allow column order to be changed
          columns: [
            // { title: "Date", field: "Date"},
              { title: "Client", field: "Client", frozen: true},
              { title: "ScanCode", field: "ScanCode", frozen: true},
              { title: "Department", field: "Department"},
              { title: "BasePrice", field: "BasePrice" },
              { title: "UnitCost", field: "UnitCost"},
              { title: "BestDateForPriceChange", field: "BestDateForPriceChange"},
              { title: "BestTimeForPriceChange", field: "BestTimeForPriceChange"}
         ]
        });
    } else {
      priceChangeItemsTable.setData(priceChangeItems)
    }
  }

  redraw()

}

/*####################################################################
#  Read the Data and redraw elements                  ################
####################################################################*/ 

const redraw = function () {
  onReady(() =>{
    const numberOfNewItemsSpan = document.getElementById(
      "numberOfNewItems"
    ) as HTMLSpanElement;
    if (numberOfNewItemsSpan) {
      numberOfNewItemsSpan.innerHTML = String(newItems.length);
    }

    const numberOfChangeItemsSpan = document.getElementById(
      "numberOfChangeItems"
    ) as HTMLSpanElement;
    if (numberOfChangeItemsSpan) {
      numberOfChangeItemsSpan.innerHTML = String(changeItems.length);
    }


    newItems.length > 0 ? show("newItemsDiv") : hide("newItemsDiv");
    newItemsInInventory.length > 0 ? show("newItemErrors") : hide("newItemErrors")
    
    changeItems.length > 0 ?  show("changeItemsDiv") : hide("changeItemsDiv");
    priceChangeItems.length > 0 ?  show("priceChangeDiv") : hide("priceChangeDiv");

    (newItems.length === 0  && changeItems.length === 0 
      && newItemsReceived && changeItemsReceived ) ? show("noItemsDiv") : hide("noItemsDiv");

    (newItemsReceived && changeItemsReceived && 
      newItemsInInventoryReceived  && priceChangeItemsReceived) ? hide("loadingDiv") : show("loadingDiv");
  })
 
};



/*####################################################################
#  Set Listeners and Send Loaded Message to Main Process  ############
####################################################################*/ 
//Function to setup the listeners
function setListeners() {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    const DownloadButton = document.getElementById("DownloadButton");
    if (DownloadButton) {
      DownloadButton.addEventListener("click", function () {
       ipcRenderer.send(
          "addDropWindowMessage",
          "savePriceCostTSV"
        );
      });
    }
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      setListeners();
    });
  }
}

//actually make the calls
setListeners();

ipcRenderer.send(
  "addDropWindowMessage",
  "loaded"
);



//combined type
type NewItemInEnventory = {

    ScanCode :string,

    inventoryDefaultSupplier:string,
    inventoryDepartment:string,
    inventoryBrand:string,
    inventoryName:string,
    inventorySize:string,
    inventoryReceiptAlias:string,
    inventoryBasePrice:string,
    inventoryLastCost:string,
    inventoryAverageCost:string,
    inventorySubDepartment:string,
    inventoryIdealMargin:string,
    inventoryQuantity:string,
    inventoryUnit:string,
    inventorySupplierUnitID:string,
    inventoryCaseCost: string,

    newItemDate:string,
    newItemClient:string,
    newItemScanCode:string,
    newItemSupplier:string,
    newItemSupplierItemID:string,
    newItemBrand:string,
    newItemName:string,
    newItemUnit:string,
    newItemSubDepartment:string,
    newItemQuantity:string,
    newItemCaseCost:string,
    newItemUnitCost:string,
    newItemMARGIN:string,
    newItemShippingPercent:string,
    newItemProposedPrice:string,
    newItemBasePrice:string,
    newItemDepartment:string,
    newItemBottleDepositFlag:string,
    newItemLocalDirectFlag:string,
    newItemLocalSixFlag:string,
    newItemLocalORFlag:string,
    newItemOGFlag:string,
    newItemFlipChartAddFlag:string,
    newItemComments:string,

  
}



function styleFormatter(cell: CellComponent, formatterParams){
  
   formatterParams.textColor ? cell.getElement().style.color = formatterParams.textColor : null
   formatterParams.backgroundColor ? cell.getElement().style.backgroundColor = formatterParams.backgroundColor : null
    return cell.getValue()
}


