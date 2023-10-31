
import React, { useEffect } from "react";
import { useAppSelector } from "../../View/hooks";
import {setItems} from "../View/InventorySlice";
import { store } from "../../View/store";

import { InventoryEntry } from "../../../Google/Inventory/Inventory";

import {
  selectItems
} from "./InventorySlice";

export default function InventoryView() {

  const inventoryItems = useAppSelector(selectItems);
  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("coreSetsWindowMessage", "loaded");
  }, [inventoryItems]);

  return (<>
  <div>InventoryView</div>
  <div>{inventoryItems.length}</div>
  </>)
}



window.electron.ipcRenderer.on(
  "inventoryData",
  (inventoryItemsArray: Array<InventoryEntry>) => {
    console.log("InventoryEntriesUpdated🟢🟢🟢🟢🟢",inventoryItemsArray);
    if (typeof inventoryItemsArray !== "undefined") {
      console.log(inventoryItemsArray);

      store.dispatch(setItems(inventoryItemsArray));
    }
  }
);

