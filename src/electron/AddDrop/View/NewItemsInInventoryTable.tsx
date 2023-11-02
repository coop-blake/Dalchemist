import React, { useEffect } from "react";
import "../../Resources/css/slickGrid.scss";
import { useAppSelector } from "../../View/hooks";
import { selectNewItemsInInventory } from "../View/AddDropSlice";

import { CellComponent, TabulatorFull as Tabulator } from "tabulator-tables";
//import { styleFormatter } from "../../UI/Tabulator/Utility";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file

let table: Tabulator | null = null;
let data: NewItemInEnventory[] = [];
export default function NewItemsInInventoryTable() {
  const items = useAppSelector(selectNewItemsInInventory);

  useEffect(() => {
    data = [];
    items.forEach((item) => {
      data.push({ ...item } as NewItemInEnventory);
    });

    console.log("newItemsInInventoryDataUpdated", data);

    dataUpdated(data);
  }, [items]);

  return !(items.length > 0) ? (
    ""
  ) : (
    <>
      <div
        id="alreadyItemsTable"
        style={{ height: "100px", padding: 0, margin: 0 }}
      />
    </>
  );
}

function dataUpdated(data: NewItemInEnventory[] = []) {
  console.log("inventoryDataUpdated", data);

  if (data.length > 0) {
    if (table === null) {
      const newEntryTextColor = "#2b292b";
      const newEntryBackgroundColor = "rgba(144, 238, 144, 0.514)";
      const inventoryEntryTextColor = "#2b292b";
      const inventoryEntryBackgroundColor = "rgb(221, 178, 219)";

      table = new Tabulator("#alreadyItemsTable", {
        data: data, //load row data from array
        movableColumns: true, //allow column order to be changed
        columns: [
          { title: "Client", field: "newItemClient", frozen: true },
          { title: "Comments", field: "newItemComments", frozen: true },
          { title: "ScanCode", field: "ScanCode", frozen: true },

          {
            title: "New Brand",
            field: "newItemBrand",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },
          {
            title: "New Name",
            field: "newItemName",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },
          {
            title: "New Unit",
            field: "newItemUnit",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },

          {
            title: "Brand",
            field: "inventoryBrand",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
          {
            title: "Name",
            field: "inventoryName",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
          {
            title: "Unit",
            field: "inventorySize",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },

          {
            title: "New Department",
            field: "newItemDepartment",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },
          {
            title: "New SubDepartment",
            field: "newItemSubDepartment",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },

          {
            title: "Department",
            field: "inventoryDepartment",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
          {
            title: "SubDepartment",
            field: "inventorySubDepartment",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },

          {
            title: "New Price",
            field: "newItemProposedPrice",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },
          {
            title: "New Cost",
            field: "newItemUnitCost",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },

          {
            title: "Price",
            field: "inventoryBasePrice",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
          {
            title: "Cost",
            field: "inventoryLastCost",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },

          {
            title: "New Supplier",
            field: "newItemSupplier",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },
          {
            title: "New SupItemID",
            field: "newItemSupplierItemID",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },
          {
            title: "New Quantity",
            field: "newItemQuantity",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },
          {
            title: "New CaseCost",
            field: "newItemCaseCost",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },
          {
            title: "New Margin",
            field: "newItemMARGIN",
            formatter: styleFormatter,
            formatterParams: {
              textColor: newEntryTextColor,
              backgroundColor: newEntryBackgroundColor,
            },
          },

          {
            title: "Supplier",
            field: "inventoryDefaultSupplier",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
          {
            title: "SupItemID",
            field: "inventorySupplierUnitID",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
          {
            title: "Quantity",
            field: "inventoryQuantity",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
          {
            title: "CaseCost",
            field: "inventoryCaseCost",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
          {
            title: "Margin",
            field: "inventoryIdealMargin",
            formatter: styleFormatter,
            formatterParams: {
              textColor: inventoryEntryTextColor,
              backgroundColor: inventoryEntryBackgroundColor,
            },
          },
        ],
      });
    } else {
      table.setData([...data]);
    }
  }
}

export function styleFormatter(
  cell: CellComponent,
  formatterParams: { textColor: string; backgroundColor: string }
) {
  formatterParams.textColor
    ? (cell.getElement().style.color = formatterParams.textColor)
    : null;
  formatterParams.backgroundColor
    ? (cell.getElement().style.backgroundColor =
        formatterParams.backgroundColor)
    : null;
  return cell.getValue();
}

type NewItemInEnventory = {
  ScanCode: string;

  inventoryDefaultSupplier: string;
  inventoryDepartment: string;
  inventoryBrand: string;
  inventoryName: string;
  inventorySize: string;
  inventoryReceiptAlias: string;
  inventoryBasePrice: string;
  inventoryLastCost: string;
  inventoryAverageCost: string;
  inventorySubDepartment: string;
  inventoryIdealMargin: string;
  inventoryQuantity: string;
  inventoryUnit: string;
  inventorySupplierUnitID: string;
  inventoryCaseCost: string;

  newItemDate: string;
  newItemClient: string;
  newItemScanCode: string;
  newItemSupplier: string;
  newItemSupplierItemID: string;
  newItemBrand: string;
  newItemName: string;
  newItemUnit: string;
  newItemSubDepartment: string;
  newItemQuantity: string;
  newItemCaseCost: string;
  newItemUnitCost: string;
  newItemMARGIN: string;
  newItemShippingPercent: string;
  newItemProposedPrice: string;
  newItemBasePrice: string;
  newItemDepartment: string;
  newItemBottleDepositFlag: string;
  newItemLocalDirectFlag: string;
  newItemLocalSixFlag: string;
  newItemLocalORFlag: string;
  newItemOGFlag: string;
  newItemFlipChartAddFlag: string;
  newItemComments: string;
};
