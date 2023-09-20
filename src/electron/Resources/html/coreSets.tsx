import "../css/coreSets.css";

import {CoreSetsView} from "../../CoreSupport/View/CoreSets"
import { CoreSetsStatus, CoreSupportEntry } from "electron/CoreSupport/shared";
import { TabulatorFull as Tabulator } from "tabulator-tables";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file


import { onReady } from "electron/Utility";
import { createRoot } from 'react-dom/client';


onReady(() =>{
  const container = document.getElementById('root') as HTMLElement;
  console.log(container)
  if(container){
 // const root = createRoot(container);
  //root.render(<CoreSetsView props={[]} />);
  }

  
})

console.log("From CoreSets.tsx");

let coreSetsTable: Tabulator | null = null;
let coreSetItems = [] as Array<CoreSupportEntry>
  
let coreSetStatus = CoreSetsStatus.Starting;
let coreSetsFilePath = "";

let numberOfCoreSupportItems = 0
let numberOfCoreSupportItemsFromOurDistributors = 0


const selectFileMenuButton = document.getElementById("selectFileMenuButton");
if (selectFileMenuButton) {
  selectFileMenuButton.addEventListener("click", function () {
    selectFileMenuButtonClicked();
  });
}

function selectFileMenuButtonClicked() {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "selectFileMenuButtonClicked"
  );
}

const saveCoreSetReportButton = document.getElementById(
  "saveCoreSetReportButton"
);
if (saveCoreSetReportButton) {
  saveCoreSetReportButton.addEventListener("click", function () {
    saveCoreSetReportButtonClicked();
  });
}

function saveCoreSetReportButtonClicked() {
  window.electron.ipcRenderer.sendMessage(
    "coreSetsWindowMessage",
    "saveCoreSetReportButtonClicked"
  );
}

//###################### After getting data - Refresh!
function refreshStatus(){
  const numberOfCoreSupportItemsElement = document.getElementById("numberOfCoreSupportItems");

  if (numberOfCoreSupportItemsElement) {
    numberOfCoreSupportItemsElement.innerHTML = String(numberOfCoreSupportItems)
  }
  const numberOfCoreSupportItemsFromOurDistributorsElement = document.getElementById("numberOfCoreSupportItemsFromOurDistributors");

  if (numberOfCoreSupportItemsFromOurDistributorsElement) {
    numberOfCoreSupportItemsFromOurDistributorsElement.innerHTML = String(numberOfCoreSupportItemsFromOurDistributors)
  }
}

function coreSetsRefreshed() {
  const statusElement = document.getElementById("statusInfo");

  if (statusElement) {
    statusElement.innerHTML = coreSetStatus;
  }
  const selectFileMenuButton = document.getElementById("selectFileMenuButton");

  if (
    coreSetStatus == CoreSetsStatus.NoFilePath ||
    coreSetStatus == CoreSetsStatus.NoFileAtPath
  ) {
    if (selectFileMenuButton) {
      // selectFileMenuButton.style.display = "inherit";
    }
  } else {
    if (selectFileMenuButton) {
      //selectFileMenuButton.style.display = "none";
    }
  }

  const fileNameElement = document.getElementById("fileName");

  if (fileNameElement) {
    if (coreSetsFilePath === "") {
      fileNameElement.innerHTML = "No Core Sets Excel File Location Saved";
    } else {
      fileNameElement.innerHTML = coreSetsFilePath;
    }
  }

  if (coreSetItems.length > 0) {
    const coreSetsTableElement = document.getElementById("coreSetsTable");
    if (coreSetsTableElement) {
      coreSetsTableElement.style.display = "inherit";
    }
    if (coreSetsTable === null) {
      coreSetsTable = new Tabulator("#coreSetsTable", {
        data: coreSetItems, //load row data from array
        movableColumns: true, //allow column order to be changed
        columns: [
          { title: "Brand", field: "Brand", headerFilter: true },
          { title: "BuyInEnd", field: "BuyInEnd", headerFilter: true },
          { title: "BuyInStart", field: "BuyInStart", headerFilter: true },
          { title: "Category", field: "Category", headerFilter: true },
          { title: "Changes", field: "Changes", headerFilter: true },
          {
            title: "CoreSetsRound",
            field: "CoreSetsRound",
            headerFilter: true,
          },
          { title: "Dept", field: "Dept", headerFilter: true },
          { title: "Description", field: "Description", headerFilter: true },
          { title: "Distributor", field: "Distributor", headerFilter: true },
          {
            title: "DistributorProductID",
            field: "DistributorProductID",
            headerFilter: true,
          },
          { title: "EDLPPrice", field: "EDLPPrice", headerFilter: true },
          {
            title: "FormattedUPC",
            field: "FormattedUPC",
            headerFilter: true,
          },
          { title: "ID", field: "ID", headerFilter: true },
          { title: "LineNotes", field: "LineNotes", headerFilter: true },
          { title: "Margin", field: "Margin", headerFilter: true },
          { title: "PackSize", field: "PackSize", headerFilter: true },
          { title: "PromoMCB", field: "PromoMCB", headerFilter: true },
          { title: "PromoOI", field: "PromoOI", headerFilter: true },
          {
            title: "RebatePerUnit",
            field: "RebatePerUnit",
            headerFilter: true,
          },
          {
            title: "ReportingUPC",
            field: "ReportingUPC",
            headerFilter: true,
          },
          {
            title: "SaleCaseCost",
            field: "SaleCaseCost",
            headerFilter: true,
          },
          {
            title: "SaleUnitCost",
            field: "SaleUnitCost",
            headerFilter: true,
          },
          { title: "UnitCount", field: "UnitCount", headerFilter: true },
          { title: "UPCA", field: "UPCA", headerFilter: true },
        ],
      });
    } else {
      coreSetsTable.setData(coreSetItems);
    }
  } else {
    const coreSetsTableElement = document.getElementById("coreSetsTable");
    if (coreSetsTableElement) {
      coreSetsTableElement.style.display = "none";
    }
  }
}

window.electron.ipcRenderer.on(
  "CoreSetEntriesUpdated",
  (coreSetItemsArray: Array<CoreSupportEntry>) => {
    console.log(coreSetItemsArray);
    if (typeof coreSetItemsArray !== "undefined") {
      coreSetItems= coreSetItemsArray;
    }

    coreSetsRefreshed();
  }
);

window.electron.ipcRenderer.on(
  "CoreSetStatusUpdated",
  (status: CoreSetsStatus) => {
    console.log(status);
    coreSetStatus = status;
    coreSetsRefreshed();
  }
);

window.electron.ipcRenderer.on("CoreSetFilePathUpdated", (filePath: string) => {
  console.log(filePath);
  coreSetsFilePath = filePath;
  coreSetsRefreshed();
});

window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");


window.electron.ipcRenderer.on(
  "CoreSetNumberOfCoreSupportItems",
  (numberOfCoreSupportItemsReceived: number) => {
    console.log("Got CoreSetNumberOfCoreSupportItems")

    numberOfCoreSupportItems = numberOfCoreSupportItemsReceived
   refreshStatus()
  }
);

window.electron.ipcRenderer.on(
  "CoreSetNumberOfCoreSupportItemsFromOurDistributors",
  (numberOfCoreSupportItemsFromOurDistributorsReceived: number) => {
    console.log("Got CoreSetNumberOfCoreSupportItemsFromOurDistributors")
    numberOfCoreSupportItemsFromOurDistributors = numberOfCoreSupportItemsFromOurDistributorsReceived
   refreshStatus()
  }
);


