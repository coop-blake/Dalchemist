import { NewItemEntry, AttributeChangeEntry } from "Google/addDrop/addDrop";
import "../css/addDrop.css";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

import { TabulatorFull as Tabulator } from "tabulator-tables";



//import  {ResponsiveLayoutModule} from 'tabulator-tables'

//Tabulator.registerModule(ResponsiveLayoutModule)


console.log("From addDrop.tsx");
let newItems: Array<NewItemEntry> = [];
let changeItems: Array<AttributeChangeEntry> = [];

window.electron.ipcRenderer.on(
  "newItemsArray",
  (newItemsArray: Array<NewItemEntry>) => {
    // eslint-disable-next-line no-console
    console.log(newItemsArray);

    newItems = newItemsArray;
    newItemsArrayUpdated();
  }
);

window.electron.ipcRenderer.on("itemsAlreadyInInventory", (message) => {
  // eslint-disable-next-line no-console
  console.log("itemsAlreadyInInventory", message);
});

window.electron.ipcRenderer.on("priceUpdates", (message) => {
  // eslint-disable-next-line no-console
  console.log("priceUpdates", message);
});

window.electron.ipcRenderer.on("attributeChangeItems", (changeItemsArray: Array<AttributeChangeEntry>) => {
  // eslint-disable-next-line no-console
  console.log("attributeChangeItems", changeItemsArray);

  changeItems = changeItemsArray

  changeItemsArrayUpdated();

});
let changeItemsTable: Tabulator | null = null;
const changeItemsArrayUpdated = function() {
  new Tabulator("#changeItemsTable", {
    data: changeItems, //load row data from array
    // layout:"fitColumns",      //fit columns to width of table
    // responsiveLayout:"hide",  //hide columns that don't fit on the table
    autoColumns: true,
    //   addRowPos:"top",          //when adding a new row, add it to the top of the table
    //     history:true,             //allow undo and redo actions on the table
    //    pagination:true,       //paginate the data
    //    paginationSize:7,         //allow 7 rows per page of data
    //    paginationCounter:"rows", //display count of paginated rows in footer
    movableColumns: true, //allow column order to be changed
    autoColumnsDefinitions: {
      Date: { frozen: true }, //add input editor to the name column
      Client: {frozen: true},
      ScanCode: { frozen: true }, //add input editor to the name column
      Department: { headerFilter: true }, //add header filters to the age column
      valuesArray: { visible: false },
    },
  });

  redraw();
}

let newItemsTable: Tabulator | null = null;
const newItemsArrayUpdated = function () {
  // table = new Tabulator("#example-table", {
  //     data: newItems, //assign data to table
  //     autoColumns:true, //create columns from data field names
  // });

  newItemsTable = new Tabulator("#newItemsTable", {
    data: newItems, //load row data from array
    // layout:"fitColumns",      //fit columns to width of table
    // responsiveLayout:"hide",  //hide columns that don't fit on the table
    autoColumns: true,
    //   addRowPos:"top",          //when adding a new row, add it to the top of the table
    //     history:true,             //allow undo and redo actions on the table
    //    pagination:true,       //paginate the data
    //    paginationSize:7,         //allow 7 rows per page of data
    //    paginationCounter:"rows", //display count of paginated rows in footer
    movableColumns: true, //allow column order to be changed
    autoColumnsDefinitions: {
      Date: { frozen: true }, //add input editor to the name column
      Client: {frozen: true},
      ScanCode: { frozen: true }, //add input editor to the name column
      Department: { headerFilter: true }, //add header filters to the age column
      valuesArray: { visible: false },
    },
  });

  redraw();
};

const redraw = function () {
  console.log(newItems.length);

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    const numberOfNewItemsSpan = document.getElementById(
      "numberOfNewItems"
    ) as HTMLSpanElement;
    if (numberOfNewItemsSpan) {
      numberOfNewItemsSpan.innerHTML = String(newItems.length);
    }
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      redraw();
    });
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function displayNewItems() {
  table.data = newItems;
}

function setListeners() {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    const DownloadButton = document.getElementById("DownloadButton");
    if (DownloadButton) {
      DownloadButton.addEventListener("click", function () {
        window.electron.ipcRenderer.sendMessage(
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
setListeners();

window.electron.ipcRenderer.sendMessage(
  "addDropWindowMessage",
  "loaded"
);

