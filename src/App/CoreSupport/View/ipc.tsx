import { store } from "../../Main/View/store";
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
  window.electron.ipcRenderer.on(
    "CoreSetAllEntriesUpdated",
    (coreSetItemsArray: Array<CoreSupportPriceListEntry>) => {
      console.log("CoreSetAllEntriesUpdated", event, coreSetItemsArray);
      if (typeof coreSetItemsArray !== "undefined") {
        console.log(coreSetItemsArray);
        store.dispatch(setAllEntries(coreSetItemsArray));
      }
    }
  );

  window.electron.ipcRenderer.on(
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

  window.electron.ipcRenderer.on(
    "CoreSetStatusUpdated",
    (status: CoreSetsStatus) => {
      console.log("CoreSetStatusUpdated🔴🔴🔴🔴🔴", status);
      store.dispatch(setStatus(status));
    }
  );
  window.electron.ipcRenderer.on(
    "CoreSetFilePathUpdated",
    (filePath: string) => {
      console.log("CoreSetStatusUpdated🔴🔴🔴🔴🔴", status);
      store.dispatch(setFilePath(filePath));
    }
  );

  window.electron.ipcRenderer.on(
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
  window.electron.ipcRenderer.on(
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
  window.electron.ipcRenderer.on(
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
