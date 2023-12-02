import React, { useEffect, useState } from "react";
//import "../../Main/View/resources/css/slickGrid.scss";
import { useAppSelector } from "../../Main/View/hooks";
import {
  selectNewItemsInInventory,
  selectNewItemsInInventoryWithSupplierID,
} from "../View/AddDropSlice";

import {
  CellComponent,
  Formatter,
  EmptyCallback,
  TabulatorFull as Tabulator,
} from "tabulator-tables";
//import { styleFormatter } from "../../UI/Tabulator/Utility";
import "tabulator-tables/dist/css/tabulator_bootstrap4.css";
import "tabulator-tables/dist/css/tabulator.min.css"; // Import the CSS file
import "./resources/css/add-drop-table.css";
import "./resources/css/new-items-already-table.css";

export default function NewItemsInInventoryTable() {
  const items = useAppSelector(selectNewItemsInInventory);
  const supplierIdItems = useAppSelector(
    selectNewItemsInInventoryWithSupplierID
  );

  const [table, setTable] = useState<Tabulator | null>(null);
  const [data] = useState<NewItemInInventory[]>([]);

  useEffect(() => {
    data.splice(0);
    items.forEach((item) => {
      data.push({ ...item } as NewItemInInventory);
    });

    console.log("newItemsInInventoryDataUpdated", data);

    dataUpdated(data);
  }, [items]);

  useEffect(() => {
    data.splice(0);
    supplierIdItems.forEach((item) => {
      console.log("item", item);
    });

    console.log("newItemsInInventoryDataUpdated", data);

    //dataUpdated(data);
  }, [supplierIdItems]);

  function dataUpdated(data: NewItemInInventory[] = []) {
    console.log("inventoryDataUpdated", data);

    if (data.length > 0) {
      if (table === null) {
        const newEntryTextColor = "#2b292b";
        const newEntryBackgroundColor = "rgba(144, 238, 144, 0.514)";
        const inventoryEntryTextColor = "#2b292b";
        const inventoryEntryBackgroundColor = "rgb(221, 178, 219)";

        setTable(
          new Tabulator("#alreadyItemsTable", {
            data: data, //load row data from array
            movableColumns: true, //allow column order to be changed
            columns: [
              { title: "Client", field: "newItemClient", frozen: true },
              { title: "Comments", field: "newItemComments", frozen: true },
              { title: "ScanCode", field: "ScanCode", frozen: true },

              {
                title: "New Brand",
                field: "newItemBrand",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },
              {
                title: "New Name",
                field: "newItemName",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },
              {
                title: "New Unit",
                field: "newItemUnit",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },

              {
                title: "Brand",
                field: "inventoryBrand",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
              {
                title: "Name",
                field: "inventoryName",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
              {
                title: "Unit",
                field: "inventorySize",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },

              {
                title: "New Department",
                field: "newItemDepartment",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },
              {
                title: "New SubDepartment",
                field: "newItemSubDepartment",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },

              {
                title: "Department",
                field: "inventoryDepartment",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
              {
                title: "SubDepartment",
                field: "inventorySubDepartment",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },

              {
                title: "New Price",
                field: "newItemBasePrice",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },
              {
                title: "New Cost",
                field: "newItemUnitCost",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },

              {
                title: "Price",
                field: "inventoryBasePrice",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
              {
                title: "Cost",
                field: "inventoryLastCost",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },

              {
                title: "New Supplier",
                field: "newItemSupplier",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },
              {
                title: "New SupItemID",
                field: "newItemSupplierItemID",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },
              {
                title: "New Quantity",
                field: "newItemQuantity",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },
              {
                title: "New CaseCost",
                field: "newItemCaseCost",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },
              {
                title: "New Margin",
                field: "newItemMARGIN",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: newEntryTextColor,
                  backgroundColor: newEntryBackgroundColor,
                },
              },

              {
                title: "Supplier",
                field: "inventoryDefaultSupplier",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
              {
                title: "SupItemID",
                field: "inventorySupplierUnitID",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
              {
                title: "Quantity",
                field: "inventoryQuantity",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
              {
                title: "CaseCost",
                field: "inventoryCaseCost",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
              {
                title: "Margin",
                field: "inventoryIdealMargin",
                formatter: styleFormatter as Formatter,
                formatterParams: {
                  textColor: inventoryEntryTextColor,
                  backgroundColor: inventoryEntryBackgroundColor,
                },
              },
            ],
          })
        );
      } else {
        table.setData([...data]);
      }
    }
  }

  const itemTableStyle = { bottom: supplierIdItems.length > 0 ? "50%" : "0" };
  return !(items.length > 0) ? (
    ""
  ) : (
    <>
      <div
        id="alreadyItemsTable"
        className="add-drop-table"
        style={itemTableStyle}
      />
      <div style={{ position: "absolute", bottom: "0" }}>
        {supplierIdItems.map(
          ([newItemEntry, supplierIDEntry, currentItemEntry]) => {
            console.log("newItemEntry", newItemEntry);
            return (
              <div>{`${newItemEntry.Supplier} ${newItemEntry.SupplierItemID} Already used in ${currentItemEntry.Brand} ${currentItemEntry.Name} ${currentItemEntry.Size} ${newItemEntry.ScanCode}`}</div>
            );
          }
        )}
      </div>
    </>
  );
}

export function styleFormatter(
  cell: CellComponent,
  formatterParams: { textColor: string; backgroundColor: string },
  onRendered: EmptyCallback
): string {
  formatterParams.textColor
    ? (cell.getElement().style.color = formatterParams.textColor)
    : null;
  formatterParams.backgroundColor
    ? (cell.getElement().style.backgroundColor =
        formatterParams.backgroundColor)
    : null;
  onRendered(() => {});
  return cell.getValue() as string;
}

type NewItemInInventory = {
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
