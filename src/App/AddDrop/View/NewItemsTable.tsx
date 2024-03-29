import React, { useEffect, useState } from "react";
//import "../../Main/View/resources/css/slickGrid.scss";
import { useAppSelector } from "../../Main/View/hooks";
import { selectNewItems } from "../View/AddDropSlice";

import { NewItemEntry } from "../../../Google/addDrop/addDrop";

import { TabulatorFull as Tabulator } from "tabulator-tables";

import thumbsUpIcon from "./resources/images/thumbs-up.svg";
import "./resources/css/new-items-table.css";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

import "./resources/css/add-drop-table.css";

export default function NewItemsTable() {
  const items = useAppSelector(selectNewItems);
  const [table, setTable] = useState<Tabulator | null>(null);
  const [data] = useState<NewItemEntry[]>([]);

  useEffect(() => {
    data.splice(0);
    items.forEach((item) => {
      data.push({ ...item } as NewItemEntry);
    });

    console.log("newItemsDataUpdated", data);

    dataUpdated(data);
  }, [items]);

  function dataUpdated(data: NewItemEntry[] = []) {
    console.log("newItemsDataUpdated", data);

    if (data.length > 0) {
      if (table === null) {
        setTable(
          new Tabulator("#newItemsTable", {
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
          })
        );
      } else {
        table.setData([...data]);
      }
    }
  }

  return !(items.length > 0) ? (
    <div
      style={{
        position: "absolute",
        top: "50px",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 0,
        margin: 0,
      }}
    >
      <div className="centered-div large-font centered-text">
        <img src={thumbsUpIcon} /> <br />
        No New Items!
      </div>
    </div>
  ) : (
    <>
      <span className="add-drop-title">
        {items.length} New Item Entr{items.length > 1 ? "ies" : "y"}
      </span>
      <div
        id="newItemsTable"
        className="add-drop-table"
        style={{ top: "100px" }}
      />
    </>
  );
}
