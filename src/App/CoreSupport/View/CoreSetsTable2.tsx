import React, { useEffect, useState } from "react";
import { selectAvailableItems } from "./CoreSetSlice";
import "../../Resources/css/slickGrid.scss";
import { CoreSupportEntry } from "../shared";
import { useAppSelector } from "../../Main/View/hooks";

import { Column, GridOption, SlickgridReact } from "slickgrid-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  availableItems: Array<CoreSupportEntry>;
  availableItemsLength: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface State {
  name: string;
  subTitle: string;
  gridOptions?: GridOption;
  columnDefinitions: Column[];
  dataset: CoreSupportEntry[];
}

export default function CoreSetsTable() {
  const title = "Core Sets";
  const availableItems = useAppSelector(selectAvailableItems);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columnDefinitions, setColumnDefinitions] = useState(defineGrids());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gridOptions, setGridOptions] = useState({
    gridHeight: 500,
    gridWidth: 1900,
    enableAutoResize: true,
    enableSorting: true,
    enableFiltering: true,
  } as GridOption);

  useEffect(() => {
    document.title = title;
  }, [availableItems]);

  return !gridOptions ? (
    ""
  ) : (
    <SlickgridReact
      gridId="CoreSetSlickGrid"
      columnDefinitions={columnDefinitions}
      gridOptions={gridOptions!}
      dataset={[...availableItems]}
    />
  );
}

/* Define grid Options and Columns */
const defineGrids = function () {
  const columns: Column[] = [
    { id: "Brand", name: "Brand", field: "Brand", sortable: true },
    {
      id: "BuyInEnd",
      name: "BuyInEnd",
      field: "BuyInEnd",
      sortable: true,
      filterable: true,
    },
    {
      id: "BuyInStart",
      name: "BuyInStart",
      field: "BuyInStart",
      sortable: true,
      filterable: true,
    },
    {
      id: "Category",
      name: "Category",
      field: "Category",
      sortable: true,
    },
    { id: "Changes", name: "Changes", field: "Changes", sortable: true },
    {
      id: "CoreSetsRound",
      name: "CoreSetsRound",
      field: "CoreSetsRound",
      sortable: true,
    },
    { id: "Dept", name: "Dept", field: "Dept", sortable: true },
    {
      id: "Description",
      name: "Description",
      field: "Description",
      sortable: true,
    },
    {
      id: "Distributor",
      name: "Distributor",
      field: "Distributor",
      sortable: true,
    },
    {
      id: "DistributorProductID",
      name: "DistributorProductID",
      field: "DistributorProductID",
      sortable: true,
    },
    {
      id: "EDLPPrice",
      name: "EDLPPrice",
      field: "EDLPPrice",
      sortable: true,
    },
    {
      id: "FormattedUPC",
      name: "FormattedUPC",
      field: "FormattedUPC",
      sortable: true,
    },
    { id: "id", name: "id", field: "id", sortable: true },
    {
      id: "LineNotes",
      name: "LineNotes",
      field: "LineNotes",
      sortable: true,
    },
    { id: "Margin", name: "Margin", field: "Margin", sortable: true },
    {
      id: "PackSize",
      name: "PackSize",
      field: "PackSize",
      sortable: true,
    },
    {
      id: "PromoMCB",
      name: "PromoMCB",
      field: "PromoMCB",
      sortable: true,
    },
    { id: "PromoOI", name: "PromoOI", field: "PromoOI", sortable: true },
    {
      id: "RebatePerUnit",
      name: "RebatePerUnit",
      field: "RebatePerUnit",
      sortable: true,
    },
    {
      id: "ReportingUPC",
      name: "ReportingUPC",
      field: "ReportingUPC",
      sortable: true,
    },
    {
      id: "SaleCaseCost",
      name: "SaleCaseCost",
      field: "SaleCaseCost",
      sortable: true,
    },
    {
      id: "SaleUnitCost",
      name: "SaleUnitCost",
      field: "SaleUnitCost",
      sortable: true,
    },
    {
      id: "UnitCount",
      name: "UnitCount",
      field: "UnitCount",
      sortable: true,
    },
    { id: "UPCA", name: "UPCA", field: "UPCA", sortable: true },
  ];
  return columns;
};
