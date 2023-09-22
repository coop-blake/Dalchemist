import React from "react";
import { selectAvailableItems } from "./CoreSetSlice";
import "../../Resources/css/slickGrid.scss";
import { CoreSetsStatus, CoreSupportEntry } from "electron/CoreSupport/shared";

import {
  Column,
  Formatters,
  GridOption,
  SlickgridReact,
} from "slickgrid-react";

const NB_ITEMS = 995;

interface Props {
  availableItems: Array<CoreSupportEntry>;
  availableItemsLength: number;
}

interface State {
  name: string;
  subTitle: string;
  gridOptions?: GridOption;
  columnDefinitions: Column[];
  dataset: CoreSupportEntry[];
}





export default class CoreSetsTable extends React.Component<Props, State> {
  constructor(public readonly props: Props) {
    super(props);
   // console.log(props);
    //console.log(this.mockData(12));
   
    this.state = {
      title: "Core Sets",
      gridOptions: undefined,
      columnDefinitions: [],
      dataset: [...props.availableItems],
    };
  }

  componentDidMount() {
    document.title = this.state.title;

    // define the grid options & columns and then create the grid itself
    this.defineGrids();

    // // mock some data (different in each dataset)
    // this.setState((state: State, props: Props) => ({
    //   dataset: this.mockData(NB_ITEMS),
    // }));
  }



  /* Define grid Options and Columns */
  defineGrids() {
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
    const gridOptions: GridOption = {
      gridHeight: 500,
      gridWidth: 1900,
      enableAutoResize: false,
      enableSorting: true,
    };

    this.setState((state: State) => ({
      ...state,
      columnDefinitions: columns,
      gridOptions,
    }));
  }


  render() {
    return !this.state.gridOptions ? (
      ""
    ) : (
      <SlickgridReact
        gridId="CoreSetSlickGrid"
        columnDefinitions={this.state.columnDefinitions}
        gridOptions={this.state.gridOptions!}
        dataset={this.state.dataset}
      />
    );
  }
}
