import React, { useEffect, useState } from "react";
//import "../../Main/View/resources/css/slickGrid.scss";
import { useAppSelector } from "../../Main/View/hooks";
import { selectReportEntries } from "./CoreSetSlice";

import { CoreSupportReportEntry } from "../shared";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file
import "./resources/css/core-support-table.css";

export default function CoreSetReportTable() {
  const items = useAppSelector(selectReportEntries);

  const [table, setTable] = useState<Tabulator | null>(null);
  const [data] = useState<CoreSupportReportEntry[]>([]);

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

    const UPCMap: Map<string, CoreSupportReportEntry> = data.reduce(
      (map, obj) => {
        map.set(obj.UPC, obj);
        return map;
      },
      new Map<string, CoreSupportReportEntry>()
    );

    const reducedData = Array.from(UPCMap.values());

    if (reducedData.length > 0) {
      if (table === null) {
        setTable(
          new Tabulator("#coreSetsReportTable", {
            data: reducedData, //load row data from array
            movableColumns: true, //allow column order to be changed
            columns: [
              // { title: "Date", field: "Date"},
              { title: "Program", field: "Program", frozen: true },
              { title: "CostVariation", field: "CostVariation", frozen: true },
              {
                title: "StockingRequired",
                field: "StockingRequired",
                frozen: true,
              },
              { title: "Start", field: "Start", frozen: true },
              { title: "End", field: "End", frozen: true },
              { title: "Distributor", field: "Distributor", frozen: true },
              { title: "UPC", field: "UPC", frozen: true },
              { title: "Brand", field: "Brand", frozen: true },
              { title: "Description", field: "Description", frozen: true },
              { title: "Sub Department", field: "Subdepart" },
              { title: "Base Price", field: "BasePrice" },
              {
                title: "Lowest Price",
                field: "LowestPrice",
              },
              {
                title: "Price Ceiling",
                field: "PriceCeiling",
              },
              { title: "Desired Retail", field: "DesiredRetail" },
              { title: "NCGNotes", field: "NCGNotes" },
              { title: "Notes", field: "Notes" },
              { title: "Dept", field: "Dept" },
              { title: "Difference", field: "Difference" },
            ],
          })
        );
      } else {
        table.setData([...reducedData]);
      }
    }
  }

  return !(items.length > 0) ? (
    ""
  ) : (
    <>
      <div
        id="coreSetsReportTable"
        className="core-support-table"
        style={{ top: "100px" }}
      />
    </>
  );
}
