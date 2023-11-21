import { shell, IpcMainInvokeEvent } from "electron";
import Settings from "../Settings";
import { reportEntriesAsXLSX } from "./Report";
import { CoreSets } from "./CoreSets";

export const handleWindowMessage = async (
  _event: IpcMainInvokeEvent,
  mainWindowMessage: string
) => {
  if (mainWindowMessage === "loaded") {
    sendCoreSetsData();
  } else if (mainWindowMessage === "openCoreSetsNCGLink") {
    openCoreSetsNCGLink();
  } else if (mainWindowMessage === "openCoreSetsFile") {
    openCoreSetsFile();
  } else if (mainWindowMessage === "saveCoreSetReportButtonClicked") {
    //saveCoreSetsTSVPrompt();
    reportEntriesAsXLSX();
  } else if (mainWindowMessage === "selectFileMenuButtonClicked") {
    CoreSets.getInstance().selectCoreSetsFilePath();
  }
};

const openCoreSetsFile = () => {
  shell.openPath(CoreSets.state.coreSupportPriceListFilePath);
};

const openCoreSetsNCGLink = () => {
  shell.openPath(
    "https://ncg.coop/resource-library/core-sets-cost-support-price-lists"
  );
};

export const sendCoreSetsData = async () => {
  const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();
  if (coreSetsWindow !== null) {
    //Send Current Status
    coreSetsWindow.webContents.send(
      "CoreSetStatusUpdated",
      CoreSets.state.status
    );
    // Core Support Price List File Path
    coreSetsWindow.webContents.send(
      "CoreSetFilePathUpdated",
      CoreSets.state.coreSupportPriceListFilePath
    );
    // All Entries
    coreSetsWindow.webContents.send(
      "CoreSetAllEntriesUpdated",
      CoreSets.CoreSupportPriceListState.allEntries
    );
    // Selected Distributor Entries
    coreSetsWindow.webContents.send(
      "CoreSetSelectedDistributorsEntriesUpdated",
      CoreSets.CoreSupportPriceListState.selectedDistributorsEntries
    );
    // Report Entries (Combined With Inventory)
    coreSetsWindow.webContents.send("CoreSetReportEntries", [
      ...CoreSets.state.reportEntries,
    ]);

    coreSetsWindow.webContents.send(
      "CoreSetUserSelectedDistributors",
      Array.from(CoreSets.CoreSupportPriceListState.selectedDistributors)
    );

    coreSetsWindow.webContents.send(
      "CoreSetAllDistributors",
      Array.from(CoreSets.CoreSupportPriceListState.allDistributors)
    );
  }
};

//When Renderer sends Selected Distributor list
//Save to Settings and set State
export const handleUserSelectedCoreSetDistributors = (
  _event: IpcMainInvokeEvent,
  distributors: Array<string>
) => {
  Settings.setCoreSetDistributors(distributors);
  CoreSets.CoreSupportPriceListState.setSelectedDistributors(
    new Set(distributors)
  );
};
