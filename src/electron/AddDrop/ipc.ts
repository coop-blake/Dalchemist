import { AddDrop } from "./AddDrop";

import { AddDrop as GoogleAddDrop } from "../../Google/addDrop/addDrop";

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
