import { InventoryEntry } from "../../../Google/Inventory/Inventory";

import { TabulatorFull as Tabulator } from "tabulator-tables";

import {formatTimestampToMinute} from '../../Utility'

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

import "../css/inventory.css"

console.log("From Inventory.tsx");

let inventoryData: InventoryEntry[] = [];

let inventoryTable: Tabulator | null = null;

window.electron.ipcRenderer.on(
  "inventoryData",
  (inventoryDataMap: InventoryEntry[]) => {


    // eslint-disable-next-line no-console
    console.log(inventoryDataMap);

    inventoryData = inventoryDataMap;
    inventoryDataUpdated();
  }
);


window.electron.ipcRenderer.on("inventoryDataLastReload", (lastInventoryLastRefresh : number) => {
  window.document.title = `Inventory last retreived: ${formatTimestampToMinute(lastInventoryLastRefresh)}`
})

function inventoryDataUpdated() {

  if(inventoryData.length>0){
    if(inventoryTable === null)
    {
      inventoryTable = new Tabulator("#inventoryTable", {
   
        data: inventoryData, //load row data from array
         movableColumns:true,      //allow column order to be changed
        columns: [
          {title: "ScanCode", field:"ScanCode", headerFilter: true, sorter:"alphanum", frozen:true },
          {title: "ReceiptAlias", field:"ReceiptAlias", headerFilter: true, frozen:true },
          {title: "Department", field:"Department", headerFilter: true },
          {title: "Brand", field:"Brand", headerFilter: true },
          {title: "Name",field:"Name", headerFilter: true },
          {title: "Size",field:"Size", headerFilter: true , sorter:"alphanum"},  
          {title: "BasePrice",field:"BasePrice", headerFilter: true, sorter:"alphanum" },
          {title: "LastCost", field:"LastCost", headerFilter: true , sorter:"alphanum"},
          {title: "AverageCost", field:"AverageCost", headerFilter: true, sorter:"alphanum" },
          {title: "DefaultSupplier", field:"DefaultSupplier", headerFilter: true },
          {title: "SubDepartment", field:"SubDepartment", headerFilter: true },
          {title: "IdealMargin", field:"IdealMargin", headerFilter: true },
          {title: "Quantity", field:"Quantity", headerFilter: true, sorter:"alphanum" },
          {title: "Unit", field:"Unit", headerFilter: true },
          {title: "SupplierUnitID", field:"SupplierUnitID", headerFilter: true,  sorter:"alphanum" },
          {title: "N", field:"N", headerFilter: true },
          {title: "S", field:"S", headerFilter: true },
          {title: "NorthLSD", field:"NorthLSD", headerFilter: true },
          {title: "SouthLSD", field:"SouthLSD", headerFilter: true },
    
          //valuesArray: { visible: false },
        ],
      });
    }else{
      inventoryTable.setData(inventoryData)
    }
  }
  
}

function setTableHeightToDocumentHeight() {
  const tableElement = document.getElementById("example-table"); // Replace with the actual ID of your table element
  const documentHeight = document.documentElement.clientHeight;

  // Set the table's height to match the document's height
  if (tableElement !== null) tableElement.style.height = `${documentHeight}px`;
}
setTableHeightToDocumentHeight();
window.addEventListener("resize", setTableHeightToDocumentHeight);
