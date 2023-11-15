import { useEffect, useState } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../View/hooks";
import { selectPriceUpdates } from "../View/AddDropSlice";

import { AttributeChangeEntry } from "../../../Google/addDrop/addDrop";

import { TabulatorFull as Tabulator } from "tabulator-tables";
import "./resources/css/price-updates-table.css";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file
import "./resources/css/add-drop-table.css";
import thumbsUpIcon from "./resources/images/thumbs-up.svg";

export default function PriceUpdatesTable() {
  const items = useAppSelector(selectPriceUpdates);

  const [table, setTable] = useState<Tabulator | null>(null);
  const [data] = useState<AttributeChangeEntry[]>([]);

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
        No Price Changes!
      </div>
    </div>
  ) : (
    <>
      {" "}
      <span
        id="savePriceUpdateCSVButton"
        className="interfaceButton"
        onClick={savePriceUpdateCSV}
      >
        Save TSV
      </span>
      <span className="add-drop-title">
        {items.length} Price/Cost Entr{items.length > 1 ? "ies" : "y"}
      </span>
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
