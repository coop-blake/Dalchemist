import React, { useEffect } from "react";
import { useAppSelector } from "../../View/hooks";
import { setItems } from "../View/InventorySlice";
import { store } from "../../View/store";

import InventoryTable from "./InventoryTable";

import { InventoryEntry } from "../../../Google/Inventory/Inventory";
import { LoadingAnimation } from "../../UI/Loading/LoadingAnimation";
import { selectItems } from "./InventorySlice";

export default function InventoryView() {
  const items = useAppSelector(selectItems);
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");
  }, [items]);

  return <>{items.length > 0 ? <InventoryTable /> : <LoadingAnimation />}</>;
}

window.electron.ipcRenderer.on(
  "inventoryData",
  (inventoryItemsArray: Array<InventoryEntry>) => {
    console.log("InventoryEntriesUpdated🟢🟢🟢🟢🟢", inventoryItemsArray);
    if (typeof inventoryItemsArray !== "undefined") {
      console.log(inventoryItemsArray);

      store.dispatch(setItems(inventoryItemsArray));
    }
  }
);
