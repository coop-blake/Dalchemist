import { shell, IpcMainInvokeEvent } from "electron";
import { saveCoreSetsTSVPrompt } from "./Report";
import { CoreSets } from "./CoreSets";

export const handleWindowMessage = async (
  _event: IpcMainInvokeEvent,
  mainWindowMessage: string
) => {
  if (mainWindowMessage === "loaded") {
    //should send the data
  } else if (mainWindowMessage === "openCoreSetsFile") {
    openCoreSetsFile();
  } else if (mainWindowMessage === "saveCoreSetReportButtonClicked") {
    saveCoreSetsTSVPrompt();
  } else if (mainWindowMessage === "selectFileMenuButtonClicked") {
    CoreSets.getInstance().selectCoreSetsFilePath();
  }
};

const openCoreSetsFile = () => {
  shell.openPath(CoreSets.state.filePath);
};

export const sendCoreSetsData = async () => {
  const coreSetsWindow = await CoreSets.getInstance().getCoreSetsWindow();
  if (coreSetsWindow !== null) {
    coreSetsWindow.webContents.send(
      "CoreSetEntriesUpdated",
      CoreSets.state.coreSetItems
    );
    coreSetsWindow.webContents.send(
      "CoreSetNumberOfCoreSupportItems",
      CoreSets.getInstance().getCoreSupport().getNumberOfEntries()
    );
    coreSetsWindow.webContents.send(
      "CoreSetStatusUpdated",
      CoreSets.state.status
    );

    coreSetsWindow.webContents.send(
      "CoreSetFilePathUpdated",
      CoreSets.state.filePath
    );

    coreSetsWindow.webContents.send(
      "CoreSetNumberOfCoreSupportItems",
      CoreSets.getInstance().getCoreSupport().getNumberOfEntries()
    );

    coreSetsWindow.webContents.send(
      "CoreSetNumberOfCoreSupportItemsFromOurDistributors",
      CoreSets.getInstance().getCoreSupport().getNumberOfItemsAvailable()
    );

    coreSetsWindow.webContents.send("CoreSetReportEntries", [
      ...CoreSets.state.reportEntries,
    ]);

    coreSetsWindow.webContents.send(
      "CoreSetUserSelectedDistributors",
      CoreSets.state.userSelectedCoreSetDistributors
    );

    coreSetsWindow.webContents.send(
      "CoreSetAllDistributors",
      CoreSets.state.allCoreSetDistributors
    );
  }
};

export const handleUserSelectedCoreSetDistributors = (
  _event: IpcMainInvokeEvent,
  distributors: Array<string>
) => {
  CoreSets.state.setUserSelectedCoreSetDistributors(distributors);
};
