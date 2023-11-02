import React, { useEffect } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../View/hooks";
import { selectNewItems } from "../View/AddDropSlice";

import { NewItemEntry } from "../../../Google/addDrop/addDrop";

import { CellComponent, TabulatorFull as Tabulator } from "tabulator-tables";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

let table: Tabulator | null = null;
let data: NewItemEntry[] = [];
export default function NewItemsTable() {
  const items = useAppSelector(selectNewItems);

  useEffect(() => {
    data = [];
    items.forEach((item) => {
      data.push({ ...item } as NewItemEntry);
    });

    console.log("newItemsDataUpdated", data);

    dataUpdated(data);
  }, [items]);

  return !(items.length > 0) ? (
    ""
  ) : (
    <>
      <div
        id="newItemsTable"
        style={{ height: "100px", padding: 0, margin: 0 }}
      />
    </>
  );
}

function dataUpdated(data: NewItemEntry[] = []) {
  console.log("inventoryDataUpdated", data);

  if (data.length > 0) {
    if (table === null) {
      table = new Tabulator("#newItemsTable", {
        data: data, //load row data from array
        movableColumns: true, //allow column order to be changed
        columns: [
          { title: "Client", field: "Client", frozen: true },
          { title: "Comments", field: "Comments", frozen: true },
          { title: "ScanCode", field: "ScanCode", frozen: true },
          { title: "Brand", field: "Brand", frozen: true },
          { title: "Name", field: "Name", frozen: true },
          { title: "Unit", field: "Unit", frozen: true },
          { title: "Department", field: "Department" },
          { title: "SubDepartment", field: "SubDepartment" },
          { title: "🍺", field: "BottleDepositFlag" },
          { title: "LD", field: "LocalDirectFlag" },
          { title: "L6", field: "LocalSixFlag" },
          { title: "LOR", field: "LocalORFlag" },
          { title: "OG", field: "OGFlag" },
          { title: "🖥️", field: "FlipChartAddFlag" },
          { title: "BasePrice", field: "BasePrice" },
          { title: "Supplier", field: "Supplier" },
          { title: "SupplierItemID", field: "SupplierItemID" },
          { title: "Quantity", field: "Quantity" },
          { title: "CaseCost", field: "CaseCost" },
          { title: "UnitCost", field: "UnitCost" },
          { title: "MARGIN", field: "MARGIN" },
          { title: "ShippingPercent", field: "ShippingPercent" },
          { title: "ProposedPrice", field: "ProposedPrice" },
        ],
      });
    } else {
      table.setData([...data]);
    }
  }
}
