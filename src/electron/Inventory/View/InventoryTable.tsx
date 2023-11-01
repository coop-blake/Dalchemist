import React, { useEffect } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../View/hooks";
import { selectItems } from "../View/InventorySlice";

import { TabulatorFull as Tabulator } from "tabulator-tables";
import { InventoryEntry } from "../../../Google/Inventory/Inventory";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

let inventoryTable: Tabulator | null = null;

const inventoryData: InventoryEntry[] = [];

export default function InventoryTable() {
  const title = "Inventory";
  const items = useAppSelector(selectItems);

  useEffect(() => {
    document.title = title;
    console.log("check", [...items]);
    inventoryDataUpdated(items);
  }, [items]);

  return !(items.length > 0) ? (
    ""
  ) : (
    <>
      <div>Inventory Table</div>
      <div id="inventoryTable" />
    </>
  );
}

function setTableHeightToDocumentHeight() {
  const tableElement = document.getElementById("example-table"); // Replace with the actual ID of your table element
  const documentHeight = document.documentElement.clientHeight;

  // Set the table's height to match the document's height
  if (tableElement !== null) tableElement.style.height = `${documentHeight}px`;
}
setTableHeightToDocumentHeight();
window.addEventListener("resize", setTableHeightToDocumentHeight);

function inventoryDataUpdated(items: Array<InventoryEntry>) {
  if (inventoryData.length > 0) {
    if (inventoryTable === null) {
      inventoryTable = new Tabulator("#inventoryTable", {
        data: inventoryData, //load row data from array
        movableColumns: true, //allow column order to be changed
        columns: [
          {
            title: "ScanCode",
            field: "ScanCode",
            headerFilter: true,
            sorter: "alphanum",
            frozen: true,
          },
          {
            title: "ReceiptAlias",
            field: "ReceiptAlias",
            headerFilter: true,
            frozen: true,
          },
          { title: "Department", field: "Department", headerFilter: true },
          { title: "Brand", field: "Brand", headerFilter: true },
          { title: "Name", field: "Name", headerFilter: true },
          {
            title: "Size",
            field: "Size",
            headerFilter: true,
            sorter: "alphanum",
          },
          {
            title: "BasePrice",
            field: "BasePrice",
            headerFilter: true,
            sorter: "alphanum",
          },
          {
            title: "LastCost",
            field: "LastCost",
            headerFilter: true,
            sorter: "alphanum",
          },
          {
            title: "AverageCost",
            field: "AverageCost",
            headerFilter: true,
            sorter: "alphanum",
          },
          {
            title: "DefaultSupplier",
            field: "DefaultSupplier",
            headerFilter: true,
          },
          {
            title: "SubDepartment",
            field: "SubDepartment",
            headerFilter: true,
          },
          { title: "IdealMargin", field: "IdealMargin", headerFilter: true },
          {
            title: "Quantity",
            field: "Quantity",
            headerFilter: true,
            sorter: "alphanum",
          },
          { title: "Unit", field: "Unit", headerFilter: true },
          {
            title: "SupplierUnitID",
            field: "SupplierUnitID",
            headerFilter: true,
            sorter: "alphanum",
          },
          { title: "N", field: "N", headerFilter: true },
          { title: "S", field: "S", headerFilter: true },
          { title: "NorthLSD", field: "NorthLSD", headerFilter: true },
          { title: "SouthLSD", field: "SouthLSD", headerFilter: true },

          //valuesArray: { visible: false },
        ],
      });
    } else {
      console.log("check", [...items]);

      inventoryTable.setData(items);
    }
  }
}
