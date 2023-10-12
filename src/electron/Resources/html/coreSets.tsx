import "../css/coreSets.css";
import { ipcRenderer } from "electron";
import CoreSetsView from "../../CoreSupport/View/CoreSets";
import { CoreSetsStatus, CoreSupportEntry } from "../../CoreSupport/shared";

import { PriceChangeWorksheetsStatus } from "../../PriceChangeWorksheets/shared";
import {
  setStatus as setPriceChangeWorksheetsStatus,
  setFolderPath,
  setWorksheets,
} from "../../PriceChangeWorksheets/View/PriceChangeWorksheetsSlice";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file
import {
  setStatus,
  setFilePath,
  setAvailableItems,
} from "../../CoreSupport/View/CoreSetSlice";

import { onReady } from "../../Utility";
import { createRoot } from "react-dom/client";
import { store } from "../../View/store";
import React from "react";
import { Provider } from "react-redux";

//Set up Listeners that update state

ipcRenderer.on(
  "CoreSetStatusUpdated",
  (event, status: CoreSetsStatus) => {
    store.dispatch(setStatus(status));
  }
);
ipcRenderer.on("CoreSetFilePathUpdated", (event, filePath: string) => {
  store.dispatch(setFilePath(filePath));
});

ipcRenderer.on(
  "CoreSetEntriesUpdated",
  (event, coreSetItemsArray: Array<CoreSupportEntry>) => {
    console.log("CoreSetEntriesUpdated");
    if (typeof coreSetItemsArray !== "undefined") {
      console.log(coreSetItemsArray);

      store.dispatch(setAvailableItems(coreSetItemsArray));
    }
  }
);

ipcRenderer.on(
  "PriceChangeWorksheetsStatus",
  (event, priceChangeWorksheetsStatus: PriceChangeWorksheetsStatus) => {
    console.log("PriceChangeWorksheetsStatus", priceChangeWorksheetsStatus);

    store.dispatch(setPriceChangeWorksheetsStatus(priceChangeWorksheetsStatus));
  }
);

ipcRenderer.on(
  "PriceChangeWorksheetsFolderPath",
  (event, priceChangeWorksheetsFolderPath: PriceChangeWorksheetsStatus) => {
    console.log(
      "PriceChangeWorksheetsFolderPath",
      priceChangeWorksheetsFolderPath
    );

    store.dispatch(setFolderPath(priceChangeWorksheetsFolderPath));
  }
);

ipcRenderer.on(
  "PriceChangeWorksheetsWorksheets",
  (event, priceChangeWorksheetsWorksheets: Array<string>) => {
    console.log(
      "PriceChangeWorksheetsWorksheets",
      priceChangeWorksheetsWorksheets
    );

    store.dispatch(setWorksheets(priceChangeWorksheetsWorksheets));
  }
);

onReady(() => {
  const container = document.getElementById("CoreSetsRoot") as HTMLElement;
  console.log(container);
  if (container) {
    const root = createRoot(container);
    root.render(
      <Provider store={store}>
        <CoreSetsView props={[]} />
      </Provider>
    );
  }
});

console.log("From CoreSets.tsx");

// const coreSetsTable: Tabulator | null = null;
// let coreSetItems = [] as Array<CoreSupportEntry>;

// let coreSetStatus = CoreSetsStatus.Starting;
// let coreSetsFilePath = "";

// const numberOfCoreSupportItems = 0;
// const numberOfCoreSupportItemsFromOurDistributors = 0;

const selectFileMenuButton = document.getElementById("selectFileMenuButton");
if (selectFileMenuButton) {
  selectFileMenuButton.addEventListener("click", function () {
    selectFileMenuButtonClicked();
  });
}

function selectFileMenuButtonClicked() {
  ipcRenderer.send(
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
  ipcRenderer.send(
    "coreSetsWindowMessage",
    "saveCoreSetReportButtonClicked"
  );
}

//###################### After getting data - Refresh!
// function refreshStatus() {
//   const numberOfCoreSupportItemsElement = document.getElementById(
//     "numberOfCoreSupportItems"
//   );

//   if (numberOfCoreSupportItemsElement) {
//     numberOfCoreSupportItemsElement.innerHTML = String(
//       numberOfCoreSupportItems
//     );
//   }
//   const numberOfCoreSupportItemsFromOurDistributorsElement =
//     document.getElementById("numberOfCoreSupportItemsFromOurDistributors");

//   if (numberOfCoreSupportItemsFromOurDistributorsElement) {
//     numberOfCoreSupportItemsFromOurDistributorsElement.innerHTML = String(
//       numberOfCoreSupportItemsFromOurDistributors
//     );
//   }
// }

function coreSetsRefreshed() {
  // const statusElement = document.getElementById("statusInfo");
  // if (statusElement) {
  //   statusElement.innerHTML = coreSetStatus;
  // }
  // const selectFileMenuButton = document.getElementById("selectFileMenuButton");
  // if (
  //   coreSetStatus == CoreSetsStatus.NoFilePath ||
  //   coreSetStatus == CoreSetsStatus.NoFileAtPath
  // ) {
  //   if (selectFileMenuButton) {
  //     // selectFileMenuButton.style.display = "inherit";
  //   }
  // } else {
  //   if (selectFileMenuButton) {
  //     //selectFileMenuButton.style.display = "none";
  //   }
  // }
  // const fileNameElement = document.getElementById("fileName");
  // if (fileNameElement) {
  //   if (coreSetsFilePath === "") {
  //     fileNameElement.innerHTML = "No Core Sets Excel File Location Saved";
  //   } else {
  //     fileNameElement.innerHTML = coreSetsFilePath;
  //   }
  // }
  // if (coreSetItems.length > 0) {
  //   const coreSetsTableElement = document.getElementById("coreSetsTable");
  //   if (coreSetsTableElement) {
  //     coreSetsTableElement.style.display = "inherit";
  //   }
  //   if (coreSetsTable === null) {
  //     coreSetsTable = new Tabulator("#coreSetsTable", {
  //       data: coreSetItems, //load row data from array
  //       movableColumns: true, //allow column order to be changed
  //       columns: [
  //         { title: "Brand", field: "Brand", headerFilter: true },
  //         { title: "BuyInEnd", field: "BuyInEnd", headerFilter: true },
  //         { title: "BuyInStart", field: "BuyInStart", headerFilter: true },
  //         { title: "Category", field: "Category", headerFilter: true },
  //         { title: "Changes", field: "Changes", headerFilter: true },
  //         {
  //           title: "CoreSetsRound",
  //           field: "CoreSetsRound",
  //           headerFilter: true,
  //         },
  //         { title: "Dept", field: "Dept", headerFilter: true },
  //         { title: "Description", field: "Description", headerFilter: true },
  //         { title: "Distributor", field: "Distributor", headerFilter: true },
  //         {
  //           title: "DistributorProductID",
  //           field: "DistributorProductID",
  //           headerFilter: true,
  //         },
  //         { title: "EDLPPrice", field: "EDLPPrice", headerFilter: true },
  //         {
  //           title: "FormattedUPC",
  //           field: "FormattedUPC",
  //           headerFilter: true,
  //         },
  //         { title: "ID", field: "ID", headerFilter: true },
  //         { title: "LineNotes", field: "LineNotes", headerFilter: true },
  //         { title: "Margin", field: "Margin", headerFilter: true },
  //         { title: "PackSize", field: "PackSize", headerFilter: true },
  //         { title: "PromoMCB", field: "PromoMCB", headerFilter: true },
  //         { title: "PromoOI", field: "PromoOI", headerFilter: true },
  //         {
  //           title: "RebatePerUnit",
  //           field: "RebatePerUnit",
  //           headerFilter: true,
  //         },
  //         {
  //           title: "ReportingUPC",
  //           field: "ReportingUPC",
  //           headerFilter: true,
  //         },
  //         {
  //           title: "SaleCaseCost",
  //           field: "SaleCaseCost",
  //           headerFilter: true,
  //         },
  //         {
  //           title: "SaleUnitCost",
  //           field: "SaleUnitCost",
  //           headerFilter: true,
  //         },
  //         { title: "UnitCount", field: "UnitCount", headerFilter: true },
  //         { title: "UPCA", field: "UPCA", headerFilter: true },
  //       ],
  //     });
  //   } else {
  //     coreSetsTable.setData(coreSetItems);
  //   }
  // } else {
  //   const coreSetsTableElement = document.getElementById("coreSetsTable");
  //   if (coreSetsTableElement) {
  //     coreSetsTableElement.style.display = "none";
  //   }
  // }
}

ipcRenderer.on(
  "CoreSetEntriesUpdated",
  (event, coreSetItemsArray: Array<CoreSupportEntry>) => {
    console.log(coreSetItemsArray);
    if (typeof coreSetItemsArray !== "undefined") {
      coreSetItems = coreSetItemsArray;
    }

    coreSetsRefreshed();
  }
);

ipcRenderer.on(
  "CoreSetStatusUpdated",
  (event, status: CoreSetsStatus) => {
    console.log(status);
    coreSetStatus = status;
    coreSetsRefreshed();
  }
);

ipcRenderer.on("CoreSetFilePathUpdated", (event, filePath: string) => {
  console.log(filePath);
  coreSetsFilePath = filePath;
  coreSetsRefreshed();
});
