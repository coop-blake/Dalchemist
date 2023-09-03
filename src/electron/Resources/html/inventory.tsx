import { InventoryEntry } from "../../../Google/Inventory/Inventory";

import { TabulatorFull as Tabulator } from "tabulator-tables";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

console.log("From Inventory.tsx");

let inventoryData: InventoryEntry[] = [];
//let table: Tabulator | null = null

window.electron.ipcRenderer.on(
  "inventoryData",
  (inventoryDataMap: InventoryEntry[]) => {
    // eslint-disable-next-line no-console
    console.log(inventoryDataMap);

    inventoryData = inventoryDataMap;
    inventoryDataUpdated();
  }
);

function inventoryDataUpdated() {
  const table = new Tabulator("#example-table", {
    //height:"400px",
    data: inventoryData, //load row data from array
    // layout:"fitColumns",      //fit columns to width of table
    //responsiveLayout:"hide",  //hide columns that don't fit on the table
    autoColumns: true,
    //   addRowPos:"top",          //when adding a new row, add it to the top of the table
    //     history:true,             //allow undo and redo actions on the table
    // pagination:true,       //paginate the data
    // paginationSize:10,         //allow 500 rows per page of data
    // paginationCounter:"rows", //display count of paginated rows in footer
     movableColumns:true,      //allow column order to be changed
    autoColumnsDefinitions: {
      ScanCode: { headerFilter: true, sorter:"alphanum", frozen:true },
      Brand: { headerFilter: true ,frozen:true},
      Name: { headerFilter: true,frozen:true },
      Size: { headerFilter: true , sorter:"alphanum"},

      DefaultSupplier: { headerFilter: true,frozen:true },
      Department: { headerFilter: true,frozen:true },
      ReceiptAlias: { headerFilter: true },
      BasePrice: { headerFilter: true, sorter:"alphanum" },
      LastCost: { headerFilter: true , sorter:"alphanum"},
      AverageCost: { headerFilter: true, sorter:"alphanum" },
      SubDepartment: { headerFilter: true },
      IdealMargin: { headerFilter: true },
      Quantity: { headerFilter: true, sorter:"alphanum" },
      Unit: { headerFilter: true },
      SupplierUnitID: { headerFilter: true,  sorter:"alphanum" },
      N: { headerFilter: true },
      S: { headerFilter: true },

      valuesArray: { visible: false },
    },
  });
}

function setTableHeightToDocumentHeight() {
  const tableElement = document.getElementById("example-table"); // Replace with the actual ID of your table element
  const documentHeight = document.documentElement.clientHeight;

  // Set the table's height to match the document's height
  if (tableElement !== null) tableElement.style.height = `${documentHeight}px`;
}
setTableHeightToDocumentHeight();
window.addEventListener("resize", setTableHeightToDocumentHeight);
