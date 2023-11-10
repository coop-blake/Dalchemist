import React, { useEffect, useState } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../View/hooks";
import { selectReportEntries } from "../View/CoreSetSlice";

import { CoreSupportReportEntry } from "../shared";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file
import "./resources/css/core-support-table.css";

import saveIcon from "./resources/images/save.svg";
import { Button } from "../../UI/Button";

export default function CoreSetReportTable() {
  const items = useAppSelector(selectReportEntries);

  const [table, setTable] = useState<Tabulator | null>(null);
  const [data, setData] = useState<CoreSupportReportEntry[]>([]);

  useEffect(() => {
    data.splice(0);
    items.forEach((item) => {
      data.push({ ...item } as CoreSupportReportEntry);
    });

    console.log("coreSetsReportTable DataUpdated", data);

    dataUpdated(data);
  }, [items]);

  function dataUpdated(data: CoreSupportReportEntry[] = []) {
    console.log("coreSetsReportTable DataUpdated", data);

    if (data.length > 0) {
      if (table === null) {
        setTable(
          new Tabulator("#coreSetsReportTable", {
            data: data, //load row data from array
            movableColumns: true, //allow column order to be changed
            columns: [
              // { title: "Date", field: "Date"},
              { title: "UPC", field: "UPC", frozen: true },
              { title: "Brand", field: "Brand", frozen: true },
              { title: "Description", field: "Description" },
              { title: "Subdepart", field: "Subdepart" },
              { title: "CurrentBasePrice", field: "CurrentBasePrice" },
              {
                title: "LowestPrice",
                field: "LowestPrice",
              },
              {
                title: "CoreSetRetail",
                field: "CoreSetRetail",
              },
              { title: "DesiredRetail", field: "DesiredRetail" },
              { title: "NCGNotes", field: "NCGNotes" },
              { title: "Notes", field: "Notes" },
              { title: "Dept", field: "Dept" },
              { title: "Difference", field: "Difference" },
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
      <div
        id="coreSetsReportTable"
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
