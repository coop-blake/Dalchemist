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

export const setCoreSetDistributors = (
  _event: IpcMainInvokeEvent,
  distributors: Array<string>
) => {
  CoreSets.state.setUserSelectedCoreSetDistributors(distributors);
};
