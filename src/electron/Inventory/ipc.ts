import { Inventory as GoogleInventory } from "../../Google/Inventory/Inventory";
import { Inventory } from "./Inventory";

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
    console.log(
      "Sending GoogleInventory items to window",
      GoogleInventory.getInstance().entries.values()
    );
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
