import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../View/hooks";
import {
  setStatus,
  selectStatus,
  selectNewItems,
  setNewItems,
  setLastRefresh,
  selectLastRefresh,
  setNewItemsInInventory,
  selectNewItemsInInventory,
  setAttributeChanges,
  setPriceUpdates,
} from "../View/AddDropSlice";
import { store } from "../../View/store";
import {
  NewItemEntry,
  AttributeChangeEntry,
} from "../../../Google/addDrop/addDrop";

import { AddDropStatus } from "../../../Google/addDrop/shared";
import { InventoryEntry } from "../../../Google/Inventory/Inventory";

import { LoadingAnimation } from "../../UI/Loading/LoadingAnimation";

import { formatTimestampToMinute } from "../../Utility";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

import NewItemsTable from "./NewItemsTable";
import NewItemsInInventoryTable from "./NewItemsInInventoryTable";
import AttributeChangesTable from "./AttributeChangesTable";
import PriceUpdatesTable from "./PriceUpdatesTable";

import newIcon from "./resources/images/gift.svg";
import updateIcon from "./resources/images/edit.svg";
import priceUpdateIcon from "./resources/images/dollar-sign.svg";

import alertIcon from "./resources/images/alert-triangle.svg";

import { Button } from "../../UI/Button";

export default function AddDropView() {
  const status = useAppSelector(selectStatus);
  const newItems = useAppSelector(selectNewItems);
  const lastRefresh = useAppSelector(selectLastRefresh);
  const newItemsInInventory = useAppSelector(selectNewItemsInInventory);

  const [subView, setSubView] = useState(SubView.NewItems);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage("addDropWindowMessage", "loaded");
    window.document.title = `AddDrop: ${status} ${
      status === AddDropStatus.Running
        ? `last retreived: ${formatTimestampToMinute(lastRefresh)}`
        : ""
    }`;
  }, [newItems, lastRefresh, newItemsInInventory]);

  return (
    <>
      {status === AddDropStatus.Running ? (
        <div className="CoreSetsMainDiv">
          <div className="navMenu">
            <Button
              name={"New Items"}
              icon={newIcon}
              active={subView === SubView.NewItems}
              onClick={() => {
                setSubView(SubView.NewItems);
              }}
            />
            <Button
              name={"Attribute Updates"}
              icon={updateIcon}
              active={subView === SubView.AttributeChanges}
              onClick={() => {
                setSubView(SubView.AttributeChanges);
              }}
            />
            <Button
              name={"Price Updates"}
              icon={priceUpdateIcon}
              active={subView === SubView.PriceUpdates}
              onClick={() => {
                setSubView(SubView.PriceUpdates);
              }}
            />
            {newItemsInInventory.length > 0 && (
              <Button
                name={`Invalid New Items ${newItemsInInventory.length}`}
                icon={alertIcon}
                active={subView === SubView.InvalidNewItems}
                onClick={() => {
                  setSubView(SubView.InvalidNewItems);
                }}
                style={{ color: "#660033" }}
              />
            )}
          </div>
          <div className="mainContent">
            {subView === SubView.NewItems ? (
              <NewItemsTable />
            ) : subView === SubView.AttributeChanges ? (
              <AttributeChangesTable />
            ) : subView === SubView.PriceUpdates ? (
              <PriceUpdatesTable />
            ) : subView === SubView.InvalidNewItems ? (
              <NewItemsInInventoryTable />
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
}

enum SubView {
  NewItems,
  AttributeChanges,
  PriceUpdates,
  InvalidNewItems,
}
window.electron.ipcRenderer.on(
  "addDropStatus",
  (newItemsArray: AddDropStatus) => {
    if (typeof newItemsArray !== "undefined") {
      console.log(newItemsArray);
      store.dispatch(setStatus(newItemsArray));
    }
  }
);

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
      store.dispatch(setNewItemsInInventory(newItemsInInventory));
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
