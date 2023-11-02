import React, { useEffect } from "react";
import { useAppSelector } from "../../View/hooks";
import {
  setStatus,
  selectNewItems,
  setNewItems,
  setLastRefresh,
  selectLastRefresh,
  setNewItemsInInventoryArray,
  selectNewItemsInInventory,
  setAttributeChanges,
  selectAttributeChanges,
  setPriceUpdates,
  selectPriceUpdates,
} from "../View/AddDropSlice";
import { store } from "../../View/store";
import {
  NewItemEntry,
  AttributeChangeEntry,
} from "../../../Google/addDrop/addDrop";
import { InventoryEntry } from "../../../Google/Inventory/Inventory";

import { LoadingAnimation } from "../../UI/Loading/LoadingAnimation";

import { onReady, show, hide, formatTimestampToMinute } from "../../Utility";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

import { CellComponent, TabulatorFull as Tabulator } from "tabulator-tables";

import NewItemsTable from "./NewItemsTable";
import NewItemsInInventoryTable from "./NewItemsInInventoryTable";
import AttributeChangesTable from "./AttributeChangesTable";
import PriceUpdatesTable from "./PriceUpdatesTable";
export default function AddDropView() {
  const items = useAppSelector(selectNewItems);
  const lastRefresh = useAppSelector(selectLastRefresh);
  const newItemsInInventory = useAppSelector(selectNewItemsInInventory);
  const attributeChangeItems = useAppSelector(selectAttributeChanges);
  const priceUpdates = useAppSelector(selectPriceUpdates);
  useEffect(() => {
    console.log("🔴🔴🔴🔴🔴");
    window.electron.ipcRenderer.sendMessage("addDropWindowMessage", "loaded");
    window.document.title = `AddDrop last retreived: ${formatTimestampToMinute(
      lastRefresh
    )}`;
  }, [items, lastRefresh]);

  return (
    <>
      {items.length > 0 ? (
        <>
          <div>
            Loaded <p>{items.length}</p>
            <p>{newItemsInInventory.length}</p>
            <p>{attributeChangeItems.length}</p>
            <p>{priceUpdates.length}</p>
            <NewItemsTable />
            <NewItemsInInventoryTable />
            <AttributeChangesTable />
            <PriceUpdatesTable />
          </div>
        </>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}

window.electron.ipcRenderer.on(
  "newItemsArray",
  (newItemsArray: Array<NewItemEntry>) => {
    if (typeof newItemsArray !== "undefined") {
      console.log(newItemsArray);
      store.dispatch(setNewItems(newItemsArray));
    }
  }
);

window.electron.ipcRenderer.on(
  "addDropDataLastReload",
  (lastAddDropLastRefresh: number) => {
    window.document.title = `AddDrop last retreived: ${formatTimestampToMinute(
      lastAddDropLastRefresh
    )}`;
    store.dispatch(setLastRefresh(lastAddDropLastRefresh));
  }
);

window.electron.ipcRenderer.on(
  "itemsAlreadyInInventory",
  (newItemsInInventoryArray: Array<[NewItemEntry, InventoryEntry]>) => {
    // eslint-disable-next-line no-console
    console.log("itemsAlreadyInInventory", newItemsInInventoryArray);

    // eslint-disable-next-line no-console
    if (typeof newItemsInInventoryArray !== "undefined") {
      console.log("itemsAlreadyInInventory", newItemsInInventoryArray);
      const newItemsInInventory = newItemsInInventoryArray.map((item) => {
        const newItem = item[0];
        const inventoryItem = item[1];
        const returnItem = {
          ScanCode: inventoryItem.ScanCode,

          inventoryDefaultSupplier: inventoryItem.DefaultSupplier,
          inventoryDepartment: inventoryItem.Department,
          inventoryBrand: inventoryItem.Brand,
          inventoryName: inventoryItem.Name,
          inventorySize: inventoryItem.Size,
          inventoryReceiptAlias: inventoryItem.ReceiptAlias,
          inventoryBasePrice: inventoryItem.BasePrice,
          inventoryLastCost: inventoryItem.LastCost,
          inventoryAverageCost: inventoryItem.AverageCost,
          inventorySubDepartment: inventoryItem.SubDepartment,
          inventoryIdealMargin: inventoryItem.IdealMargin,
          inventoryQuantity: inventoryItem.Quantity,
          inventoryUnit: inventoryItem.Unit,
          inventorySupplierUnitID: inventoryItem.SupplierUnitID,
          inventoryCaseCost: `$${String(
            parseFloat(inventoryItem.Quantity) *
              parseFloat(inventoryItem.LastCost.replace("$", ""))
          )}`,

          newItemDate: newItem.Date,
          newItemClient: newItem.Client,
          newItemScanCode: newItem.ScanCode,
          newItemSupplier: newItem.Supplier,
          newItemSupplierItemID: newItem.SupplierItemID,
          newItemBrand: newItem.Brand,
          newItemName: newItem.Name,
          newItemUnit: newItem.Unit,
          newItemSubDepartment: newItem.SubDepartment,
          newItemQuantity: newItem.Quantity,
          newItemCaseCost: newItem.CaseCost,
          newItemUnitCost: newItem.UnitCost,
          newItemMARGIN: newItem.MARGIN,
          newItemShippingPercent: newItem.ShippingPercent,
          newItemProposedPrice: newItem.ProposedPrice,
          newItemBasePrice: newItem.BasePrice,
          newItemDepartment: newItem.Department,
          newItemBottleDepositFlag: newItem.BottleDepositFlag,
          newItemLocalDirectFlag: newItem.LocalDirectFlag,
          newItemLocalSixFlag: newItem.LocalSixFlag,
          newItemLocalORFlag: newItem.LocalORFlag,
          newItemOGFlag: newItem.OGFlag,
          newItemFlipChartAddFlag: newItem.FlipChartAddFlag,
          newItemComments: newItem.Comments,
        };

        return returnItem;
      });
      store.dispatch(setNewItemsInInventoryArray(newItemsInInventory));
    }
  }
);

//Attribute Changes
window.electron.ipcRenderer.on(
  "attributeChangeItems",
  (changeItemsArray: Array<AttributeChangeEntry>) => {
    store.dispatch(setAttributeChanges(changeItemsArray));
  }
);

//Prive Changes
window.electron.ipcRenderer.on(
  "priceUpdates",
  (priceChangeItemsArray: Array<AttributeChangeEntry>) => {
    // eslint-disable-next-line no-console
    console.log("priceUpdates", priceChangeItemsArray);
    store.dispatch(setPriceUpdates(priceChangeItemsArray));
  }
);
