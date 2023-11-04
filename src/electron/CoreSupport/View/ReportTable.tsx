import React, { useEffect, useState } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../View/hooks";
import { selectPriceUpdates } from "../View/CoreSetSlice";

import { AttributeChangeEntry } from "../../../Google/addDrop/addDrop";

import { TabulatorFull as Tabulator } from "tabulator-tables";
import "./resources/css/price-updates-table.css";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file
import "./resources/css/add-drop-table.css";

import saveIcon from "./resources/images/save.svg";
import { Button } from "../../UI/Button";

export default function PriceUpdatesTable() {
  const items = useAppSelector(selectPriceUpdates);

  const [table, setTable] = useState<Tabulator | null>(null);
  const [data, setData] = useState<AttributeChangeEntry[]>([]);

  useEffect(() => {
    data.splice(0);
    items.forEach((item) => {
      data.push({ ...item } as AttributeChangeEntry);
    });

    console.log("priceUpdates DataUpdated", data);

    dataUpdated(data);
  }, [items]);

  function dataUpdated(data: AttributeChangeEntry[] = []) {
    console.log("priceUpdatesTable DataUpdated", data);

    if (data.length > 0) {
      if (table === null) {
        setTable(
          new Tabulator("#priceUpdatesTable", {
            data: data, //load row data from array
            movableColumns: true, //allow column order to be changed
            columns: [
              // { title: "Date", field: "Date"},
              { title: "Client", field: "Client", frozen: true },
              { title: "ScanCode", field: "ScanCode", frozen: true },
              { title: "Department", field: "Department" },
              { title: "BasePrice", field: "BasePrice" },
              { title: "UnitCost", field: "UnitCost" },
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
    ""
  ) : (
    <>
      {" "}
      <Button
        name={"Save as TSV"}
        icon={saveIcon}
        active={false}
        onClick={() => {
          savePriceUpdateCSV();
        }}
        style={{ height: "20px" }}
        className={"add-drop-table-button"}
      />
      <div
        id="priceUpdatesTable"
        className="add-drop-table"
        style={{ top: "100px" }}
      />
    </>
  );
}

function savePriceUpdateCSV() {
  window.electron.ipcRenderer.sendMessage(
    "addDropWindowMessage",
    "savePriceCostTSV"
  );
}
