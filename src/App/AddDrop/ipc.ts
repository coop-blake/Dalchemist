import { AddDrop } from "./AddDrop";

import { AddDrop as GoogleAddDrop } from "../../Google/addDrop/addDrop";

import { IpcMainInvokeEvent, dialog } from "electron";
import { getAddDropPriceUpdatesTSV } from "../../Google/addDrop/htmlOutputs";
import { saveStringToFile } from "../FileSave";
export const sendStateChangesToWindow = async () => {
  GoogleAddDrop.getInstance();
  const inventoryObservable =
    GoogleAddDrop.state.lastRefreshCompleted$.subscribe(
      async (lastRefresh: number) => {
        if (lastRefresh > 0) {
          sendAddDropData();
        }
      }
    );

  return inventoryObservable;
};

export const sendAddDropData = async () => {
  const addDropWindow = await AddDrop.getInstance().getWindow();
  if (addDropWindow !== null) {
    addDropWindow.webContents.send("addDropStatus", GoogleAddDrop.state.status);
    addDropWindow.webContents.send(
      "newItemsArray",
      GoogleAddDrop.state.newItems
    );
    addDropWindow.webContents.send(
      "itemsAlreadyInInventory",
      GoogleAddDrop.state.itemsAlreadyInInventory
    );
    addDropWindow.webContents.send(
      "attributeChangeItems",
      GoogleAddDrop.state.attributeChangeItems
    );
    addDropWindow.webContents.send(
      "priceUpdates",
      GoogleAddDrop.state.priceUpdates
    );
    addDropWindow.webContents.send(
      "addDropDataLastReload",
      GoogleAddDrop.state.lastRefreshCompleted
    );
  }
};

export const handleAddDropWindowMessage = async (
  _event: IpcMainInvokeEvent,
  mainWindowMessage: string
) => {
  if (mainWindowMessage === "loaded") {
    //should send the data
    sendAddDropData();
  } else if (mainWindowMessage === "savePriceCostTSV") {
    savePriceCostTSVPrompt();
  }
};

export const savePriceCostTSVPrompt = function () {
  const contentToSave = getAddDropPriceUpdatesTSV(
    GoogleAddDrop.state.priceUpdates
  );
  dialog
    .showSaveDialog({ defaultPath: "addDropPriceCost.txt" })
    .then((result) => {
      if (!result.canceled && result.filePath) {
        const filePath = result.filePath;
        saveStringToFile(contentToSave, filePath);
      }
    });
};
