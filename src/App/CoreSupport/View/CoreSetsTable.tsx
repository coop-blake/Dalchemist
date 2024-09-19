import { selectSelectedDistributorEntries } from "./CoreSetSlice";
//import "./resources/css/slickGrid.scss";
import { CoreSetsAndBasicsPriceListEntry } from "../shared";
import { useAppSelector } from "../../Main/View/hooks";

import React, { useEffect, useState } from "react";

import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file
import "./resources/css/core-support-table.css";

export default function PriceUpdatesTable() {
  const selectedDistributorEntries = useAppSelector(
    selectSelectedDistributorEntries
  );
  const [table, setTable] = useState<Tabulator | null>(null);
  const [data] = useState<CoreSetsAndBasicsPriceListEntry[]>([]);

  useEffect(() => {
    data.splice(0);
    selectedDistributorEntries.forEach((entry) => {
      data.push({ ...entry } as CoreSetsAndBasicsPriceListEntry);
    });

    console.log("Core Support Distributor entries", data);

    dataUpdated(data);
  }, [selectedDistributorEntries]);

  function dataUpdated(data: CoreSetsAndBasicsPriceListEntry[] = []) {
    console.log("Core Support Distributor DataUpdated", data);

    if (data.length > 0) {
      if (table === null) {
        setTable(
          new Tabulator("#coreSupportDistributorEntriesTable", {
            data: data, //load row data from array
            movableColumns: true, //allow column order to be changed
            columns: [
              // { title: "Brand", field: "Brand" },
              // { title: "BuyInEnd", field: "BuyInEnd" },
              // { title: "BuyInStart", field: "BuyInStart" },
              // { title: "Category", field: "Category" },
              // { title: "Changes", field: "Changes" },
              // { title: "CoreSetsRound", field: "CoreSetsRound" },
              // { title: "Dept", field: "Dept" },
              // { title: "Description", field: "Description" },
              // { title: "Distributor", field: "Distributor" },
              // { title: "DistributorProductID", field: "DistributorProductID" },
              // { title: "EDLPPrice", field: "EDLPPrice" },
              // { title: "FormattedUPC", field: "FormattedUPC" },
              // { title: "LineNotes", field: "LineNotes" },
              // { title: "Margin", field: "Margin" },
              // { title: "PackSize", field: "PackSize" },
              // { title: "PromoMCB", field: "PromoMCB" },
              // { title: "PromoOI", field: "PromoOI" },
              // { title: "RebatePerUnit", field: "RebatePerUnit" },
              // { title: "ReportingUPC", field: "ReportingUPC" },
              // { title: "SaleCaseCost", field: "SaleCaseCost" },
              // { title: "SaleUnitCost", field: "SaleUnitCost" },
              // { title: "UnitCount", field: "UnitCount" },
              // { title: "UPCA", field: "UPCA" },
              { title: "Program", field:"Program"},
              { title: "CostVariation", field:"CostVariation"},
              { title: "StockingRequired", field:"StockingRequired"},
              { title: "Start", field:"Start"},
              { title: "End", field:"End"},
              { title: "Distributor", field:"Distributor"},
              { title: "DistributorProductID", field:"DistributorProductID"},
              { title: "UPCA", field:"UPCA"},
              { title: "CatapultUPC", field:"CatapultUPC"},
              { title: "SMSUPC", field:"SMSUPC"},
              { title: "Brand", field:"Brand"},
              { title: "Description", field:"Description"},
              { title: "Count", field:"Count"},
              { title: "Size", field:"Size"},
              { title: "UOM", field:"UOM"},
              { title: "OI", field:"OI"},
              { title: "MCB", field:"MCB"},
              { title: "UnitRebate", field:"UnitRebate"},
              { title: "CaseCost", field:"CaseCost"},
              { title: "UnitCost", field:"UnitCost"},
              { title: "PriceCeiling", field:"PriceCeiling"},
              { title: "Margin", field:"Margin"},
              { title: "LineNotes", field:"LineNotes"},
              { title: "Changes", field:"Changes"},
              { title: "Department", field:"Department"},
              { title: "Subdepartment", field:"Subdepartment"},
              { title: "Category", field:"Category"},
              { title: "Subcategory", field:"Subcategory"},
            ],
          })
        );
      } else {
        table.setData([...data]);
      }
    }
  }

  return !(selectedDistributorEntries.length > 0) ? (
    ""
  ) : (
    <>
      {" "}
      <div
        id="coreSupportDistributorEntriesTable"
        className="core-support-table"
        style={{ top: "50px" }}
      />
    </>
  );
}
