import { Inventory as GoogleInventory } from "../../Google/Inventory/Inventory";
import { Inventory } from "./Inventory";
import { IpcMainInvokeEvent } from "electron";

export const sendStateChangesToWindow = async () => {
  GoogleInventory.getInstance();
  const inventoryObservable =
    GoogleInventory.state.lastRefreshCompleted$.subscribe(
      async (lastRefresh: number) => {
        if (lastRefresh > 0) {
          sendInventoryData();
        }
      }
    );

  return inventoryObservable;
};

export const sendInventoryData = async () => {
  const inventoryWindow = await Inventory.getInstance().getWindow();
  if (inventoryWindow !== null) {
    console.log("Sending GoogleInventory items to window");
    const inventoryWindow = await Inventory.getInstance().getWindow();
    const inventoryValues = Array.from(
      GoogleInventory.getInstance().entries.values()
    );
    inventoryWindow.webContents.send("inventoryData", inventoryValues);
    inventoryWindow.webContents.send(
      "inventoryDataLastReload",
      GoogleInventory.state.lastRefreshCompleted
    );
  }
};

export const handleWindowMessage = async (
  _event: IpcMainInvokeEvent,
  mainWindowMessage: string
) => {
  if (mainWindowMessage === "loaded") {
    //should send the data
    sendInventoryData();
  }
};
