import React, { useEffect } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../View/hooks";
import { selectAttributeChanges } from "../View/AddDropSlice";

import { AttributeChangeEntry } from "../../../Google/addDrop/addDrop";

import { TabulatorFull as Tabulator } from "tabulator-tables";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

let table: Tabulator | null = null;
let data: AttributeChangeEntry[] = [];
export default function AttributeChangesTable() {
  const items = useAppSelector(selectAttributeChanges);

  useEffect(() => {
    data = [];
    items.forEach((item) => {
      data.push({ ...item } as AttributeChangeEntry);
    });

    console.log("attributeChanges DataUpdated", data);

    dataUpdated(data);
  }, [items]);

  return !(items.length > 0) ? (
    ""
  ) : (
    <>
      <div
        id="attributeChangesTable"
        style={{ height: "100px", padding: 0, margin: 0 }}
      />
    </>
  );
}

function dataUpdated(data: AttributeChangeEntry[] = []) {
  console.log("attributeChangesTable DataUpdated", data);

  if (data.length > 0) {
    if (table === null) {
      table = new Tabulator("#attributeChangesTable", {
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
          { title: "BestDateForPriceChange", field: "BestDateForPriceChange" },
          { title: "BestTimeForPriceChange", field: "BestTimeForPriceChange" },
        ],
      });
    } else {
      table.setData([...data]);
    }
  }
}
