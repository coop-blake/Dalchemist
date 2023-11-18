import React, { useEffect } from "react";
import { useAppSelector } from "../../Main/View/hooks";
import { setItems } from "../View/InventorySlice";
import { store } from "../../Main/View/store";

import "./resources/css/inventory.css";
import InventoryTable from "./InventoryTable";

import { InventoryEntry } from "../../../Google/Inventory/Inventory";
import { LoadingAnimation } from "../../UI/Loading/LoadingAnimation";
import { selectItems } from "./InventorySlice";

export default function InventoryView() {
  const items = useAppSelector(selectItems);
  useEffect(() => {
    items.length > 0
      ? (document.title = `Inventory: ${items.length} Entries`)
      : (document.title = "Inventory Loading");
  }, [items]);

  useEffect(() => {
    window.inventory.ipcRenderer.sendMessage(
      "inventoryWindowMessage",
      "loaded"
    );
  }, []);

  return <>{items.length > 0 ? <InventoryTable /> : <LoadingAnimation />}</>;
}

window.inventory.ipcRenderer.on(
  "inventoryData",
  (inventoryItemsArray: Array<InventoryEntry>) => {
    console.log("InventoryEntriesUpdated🟢🟢🟢🟢🟢", inventoryItemsArray);
    if (typeof inventoryItemsArray !== "undefined") {
      console.log(inventoryItemsArray);

      store.dispatch(setItems(inventoryItemsArray));
    }
  }
);
