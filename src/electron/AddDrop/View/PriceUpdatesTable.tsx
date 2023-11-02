import React, { useEffect } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../View/hooks";
import { selectPriceUpdates } from "../View/AddDropSlice";

import { AttributeChangeEntry } from "../../../Google/addDrop/addDrop";

import { TabulatorFull as Tabulator } from "tabulator-tables";

import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

let table: Tabulator | null = null;
let data: AttributeChangeEntry[] = [];
export default function PriceUpdatesTable() {
  const items = useAppSelector(selectPriceUpdates);

  useEffect(() => {
    data = [];
    items.forEach((item) => {
      data.push({ ...item } as AttributeChangeEntry);
    });

    console.log("priceUpdates DataUpdated", data);

    dataUpdated(data);
  }, [items]);

  return !(items.length > 0) ? (
    ""
  ) : (
    <>
      <div
        id="priceUpdatesTable"
        style={{ height: "100px", padding: 0, margin: 0 }}
      />
    </>
  );
}

function dataUpdated(data: AttributeChangeEntry[] = []) {
  console.log("priceUpdatesTable DataUpdated", data);

  if (data.length > 0) {
    if (table === null) {
      table = new Tabulator("#priceUpdatesTable", {
        data: data, //load row data from array
        movableColumns: true, //allow column order to be changed
        columns: [
          // { title: "Date", field: "Date"},
          { title: "Client", field: "Client", frozen: true },
          { title: "ScanCode", field: "ScanCode", frozen: true },
          { title: "Department", field: "Department" },
          { title: "BasePrice", field: "BasePrice" },
          { title: "UnitCost", field: "UnitCost" },
          { title: "BestDateForPriceChange", field: "BestDateForPriceChange" },
          { title: "BestTimeForPriceChange", field: "BestTimeForPriceChange" },
        ],
      });
    } else {
      table.setData([...data]);
    }
  }
}
