import React, { useEffect } from "react";
//import "../../Main/View/resources/css/slickGrid.scss";
import { useAppSelector } from "../../Main/View/hooks";
import { selectItems } from "../View/InventorySlice";

import { TabulatorFull as Tabulator } from "tabulator-tables";
import { InventoryEntry } from "../../../Google/Inventory/Inventory";

import "./resources/css/inventory-table.css";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

let inventoryTable: Tabulator | null = null;
let inventoryData: InventoryEntry[] = [];
export default function InventoryTable() {
  const items = useAppSelector(selectItems);

  useEffect(() => {
    document.title = "Inventory";
    inventoryData = [];
    items.forEach((item) => {
      inventoryData.push({ ...item } as InventoryEntry);
    });

    console.log("inventoryDataUpdated", inventoryData);

    inventoryDataUpdated(inventoryData);
  }, [items]);

  return !(items.length > 0) ? (
    ""
  ) : (
    <>
      <div
        id="inventoryTable"
        style={{ height: "100vh", padding: 0, margin: 0 }}
      />
    </>
  );
}

function inventoryDataUpdated(data: InventoryEntry[] = []) {
  console.log("inventoryDataUpdated", data);

  if (data.length > 0) {
    if (inventoryTable === null) {
      inventoryTable = new Tabulator("#inventoryTable", {
        data: data, //load row data from array
        movableColumns: true, //allow column order to be changed
        clipboard: "copy",
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
        ],
      });
    } else {
      console.log("check", [...data]);

      inventoryTable.setData([...data]);
    }
  }
}
