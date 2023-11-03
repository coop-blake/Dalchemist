import React, { useEffect, useState } from "react";
import { selectAvailableItems } from "./CoreSetSlice";
import "../../Resources/css/slickGrid.scss";
import {  CoreSupportEntry } from "../shared";
import { useAppSelector } from "../../View/hooks";

import {
  Column,
  MultipleSelectOption,
  OperatorType,
  FieldType,
  Filters,
  GridOption,
  SlickgridReact,
} from "slickgrid-react";

export interface Props {
  availableItems: Array<CoreSupportEntry>;
  availableItemsLength: number;
}

export interface State {
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
    enableSorting: true,
    enableFiltering: true,
    forceFitColumns: true,
    enableCellNavigation: true,
    enableColumnReorder: false,
    multiColumnSort: true,
    asyncEditorLoading: true,
  } as GridOption);

  useEffect(() => {
    document.title = title;
    console.log("check", [...availableItems]);
  }, [availableItems]);

  return !(availableItems.length > 0) ? (
    ""
  ) : (
    <SlickgridReact
      gridId="CoreSetSlickGrid"
      columnDefinitions={columnDefinitions}
      gridOptions={gridOptions!}
      dataset={[...availableItems]}
      class="core-support-table"      
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
      filterable: true,
      filter: selectFilter(),
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

const selectFilter = function ()  {
  return {
    model: Filters.multipleSelect,
    collection: [
      "Equal Exchange - Direct",
      "Tony's Fine Foods - Ridgefield, WA",
      "UNFI - Ridgefield, WA",
      "Ancient Nutrition - Direct",
    ],
    // We can load the "collection" asynchronously (on first load only, after that we will simply use "collection")
    // 3 ways are supported (react-http-client, react-fetch-client OR even Promise)

    // 1- USE HttpClient from "react-http-client" to load collection asynchronously
    // collectionAsync: this.http.createRequest(URL_SAMPLE_COLLECTION_DATA).asGet().send(),

    // OR 2- use "react-fetch-client", they are both supported
    // collectionAsync: fetch(URL_SAMPLE_COLLECTION_DATA),

    // collectionFilterBy & collectionSortBy accept a single or multiple options
    // we can exclude certains values 365 & 360 from the dropdown filter
    collectionFilterBy: [
      {
        property: "value",
        operator: OperatorType.notEqual,
        value: 360,
      },
      {
        property: "value",
        operator: OperatorType.notEqual,
        value: 365,
      },
    ],

    // sort the select dropdown in a descending order
    collectionSortBy: {
      property: "value",
      sortDesc: true,
      fieldType: FieldType.number,
    },
    customStructure: {
      value: "value",
      label: "label",
      optionLabel: "value", // if selected text is too long, we can use option labels instead
      labelSuffix: "text",
    },
    collectionOptions: {
      separatorBetweenTextLabels: " ",
      filterResultAfterEachPass: "chain", // options are "merge" or "chain" (defaults to "chain")
    },
    // we could add certain option(s) to the "multiple-select" plugin
    filterOptions: {
      maxHeight: 250,
      width: 175,

      // if we want to display shorter text as the selected text (on the select filter itself, parent element)
      // we can use "useSelectOptionLabel" or "useSelectOptionLabelToHtml" the latter will parse html
      useSelectOptionLabelToHtml: true,
    } as MultipleSelectOption,
  };
};
