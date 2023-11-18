import React, { useEffect, useState } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../Main/View/hooks";
import { selectAttributeChanges } from "../View/AddDropSlice";

import { AttributeChangeEntry } from "../../../Google/addDrop/addDrop";
import thumbsUpIcon from "./resources/images/thumbs-up.svg";

import "./resources/css/attribute-changes-table.css";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "./resources/css/add-drop-table.css";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

export default function AttributeChangesTable() {
  const items = useAppSelector(selectAttributeChanges);

  const [table, setTable] = useState<Tabulator | null>(null);
  const [data] = useState<AttributeChangeEntry[]>([]);
  useEffect(() => {
    data.splice(0);
    items.forEach((item) => {
      data.push({ ...item } as AttributeChangeEntry);
    });

    console.log("attributeChanges DataUpdated", data);

    dataUpdated(data);
  }, [items]);

  function dataUpdated(data: AttributeChangeEntry[] = []) {
    console.log("attributeChangesTable DataUpdated", data);

    if (data.length > 0) {
      if (table === null) {
        setTable(
          new Tabulator("#attributeChangesTable", {
            data: data, //load row data from array
            movableColumns: true, //allow column order to be changed
            columns: [
              // { title: "Date", field: "Date"},
              { title: "Client", field: "Client", frozen: true },
              { title: "ScanCode", field: "ScanCode", frozen: true },
              { title: "Comments", field: "Comments", frozen: true },
              { title: "ChangeOne", field: "ChangeOne", frozen: true },
              { title: "ChangeTwo", field: "ChangeTwo", frozen: true },
              { title: "ChangeThree", field: "ChangeThree", frozen: true },
              { title: "ChangeFour", field: "ChangeFour", frozen: true },
              { title: "Supplier", field: "Supplier" },
              { title: "Sup Item ID", field: "SupplierItemID" },
              { title: "Brand", field: "Brand" },
              { title: "Name", field: "Name" },
              { title: "Unit", field: "Unit" },
              { title: "SubDepartment", field: "SubDepartment" },
              { title: "Quantity", field: "Quantity" },
              { title: "CaseCost", field: "CaseCost" },
              { title: "UnitCost", field: "UnitCost" },
              { title: "MARGIN", field: "MARGIN" },
              { title: "ShippingPercent", field: "ShippingPercent" },
              { title: "ProposedPrice", field: "ProposedPrice" },
              { title: "BasePrice", field: "BasePrice" },
              { title: "Department", field: "Department" },
              { title: "BottleDepositFlag", field: "BottleDepositFlag" },
              { title: "LocalDirectFlag", field: "LocalDirectFlag" },
              { title: "LocalSixFlag", field: "LocalSixFlag" },
              { title: "LocalORFlag", field: "LocalORFlag" },
              { title: "OGFlag", field: "OGFlag" },
              {
                title: "BestDateForPriceChange",
                field: "BestDateForPriceChange",
              },
              {
                title: "BestTimeForPriceChange",
                field: "BestTimeForPriceChange",
              },
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
        No Attribute Changes!
      </div>
    </div>
  ) : (
    <>
      <span className="add-drop-title">
        {items.length} Attribute Change{items.length > 1 ? "s" : ""}
      </span>
      <div id="attributeChangesTable" className="add-drop-table" />
    </>
  );
}
