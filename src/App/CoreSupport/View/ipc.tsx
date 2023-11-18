import { store } from "../../Main/View/store";

import { CoreSetMessage } from "./preloadCoreSets";
import {
  setStatus,
  setFilePath,
  setAllEntries,
  setSelectedDistributorEntries,
  setReportEntries,
  setAvailableDistributors,
  setSelectedDistributors,
} from "./CoreSetSlice";
import {
  CoreSetsStatus,
  CoreSupportPriceListEntry,
  CoreSupportReportEntry,
} from "../../CoreSupport/shared";

export function listenToIPCAndSetState() {
  window.coreSets.ipcRenderer.on(
    "CoreSetAllEntriesUpdated",
    (coreSetItemsArray: Array<CoreSupportPriceListEntry>) => {
      console.log("CoreSetAllEntriesUpdated", event, coreSetItemsArray);
      if (typeof coreSetItemsArray !== "undefined") {
        console.log(coreSetItemsArray);
        store.dispatch(setAllEntries(coreSetItemsArray));
      }
    }
  );

  window.coreSets.ipcRenderer.on(
    "CoreSetSelectedDistributorsEntriesUpdated",
    (coreSetItemsArray: Array<CoreSupportPriceListEntry>) => {
      console.log(
        "CoreSetSelectedDistributorsEntriesUpdated",
        event,
        coreSetItemsArray
      );
      if (typeof coreSetItemsArray !== "undefined") {
        console.log(coreSetItemsArray);
        store.dispatch(setSelectedDistributorEntries(coreSetItemsArray));
      }
    }
  );

  window.coreSets.ipcRenderer.on(
    "CoreSetStatusUpdated",
    (status: CoreSetsStatus) => {
      console.log("CoreSetStatusUpdated🔴🔴🔴🔴🔴", status);
      store.dispatch(setStatus(status));
    }
  );
  window.coreSets.ipcRenderer.on(
    "CoreSetFilePathUpdated",
    (filePath: string) => {
      console.log("CoreSetStatusUpdated🔴🔴🔴🔴🔴", status);
      store.dispatch(setFilePath(filePath));
    }
  );

  window.coreSets.ipcRenderer.on(
    "CoreSetReportEntries",
    (coreSetReportEntriesArray: Array<CoreSupportReportEntry>) => {
      console.log(
        "CoreSetReportEntriesUpdated🟢🟢🟢🟢🟢",
        coreSetReportEntriesArray
      );
      if (typeof coreSetReportEntriesArray !== "undefined") {
        console.log(coreSetReportEntriesArray);
        store.dispatch(setReportEntries(coreSetReportEntriesArray));
      }
    }
  );
  window.coreSets.ipcRenderer.on(
    "CoreSetAllDistributors",
    (availableDistributorsArray: Array<string>) => {
      console.log("availableDistributorsArray", availableDistributorsArray);
      if (typeof availableDistributorsArray !== "undefined") {
        console.log(availableDistributorsArray);
        store.dispatch(
          setAvailableDistributors(Array.from(availableDistributorsArray))
        );
      }
    }
  );
  window.coreSets.ipcRenderer.on(
    "CoreSetUserSelectedDistributors",
    (selectedDistributorsArray: Array<string>) => {
      if (typeof selectedDistributorsArray !== "undefined") {
        store.dispatch(
          setSelectedDistributors(Array.from(selectedDistributorsArray))
        );
      }
    }
  );
}
