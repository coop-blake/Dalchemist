import { Inventory as GoogleInventory } from "../../Google/Inventory/Inventory";
import { Inventory } from "./Inventory";
import { IpcMainInvokeEvent, clipboard } from "electron";

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

export const writeToClipboard = async (data: string) => {
  clipboard.writeText(data);
};

export const handleWindowMessage = async (
  _event: IpcMainInvokeEvent,
  mainWindowMessage: string,
  options?: { text: string }
) => {
  if (mainWindowMessage === "loaded") {
    sendInventoryData();
  } else if (mainWindowMessage === "writeToClipboard" && options) {
    writeToClipboard(options.text);
  }
};
