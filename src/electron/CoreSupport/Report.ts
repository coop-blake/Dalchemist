import fs from "fs";
import { dialog } from "electron";
import { CoreSupportReportEntry, CoreSupportPriceListEntry } from "./shared";
import { CoreSets } from "./CoreSets";
import { Promos } from "../../Google/Inventory/Promos";
import { Inventory } from "../../Google/Inventory/Inventory";
import * as XLSX from "xlsx";

export async function saveCoreSetsTSVPrompt() {
  const contentToSave = reportEntriesAsTSVString();
  dialog.showSaveDialog({ defaultPath: "coreSetReport.txt" }).then((result) => {
    if (!result.canceled && result.filePath) {
      const filePath = result.filePath;
      saveStringToFile(contentToSave, filePath);
    }
  });
}

function saveStringToFile(content: string, filePath: string) {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("File saved successfully.");
  } catch (error) {
    console.error("Error saving file:", error);
  }
}

export const processReportEntries = async function () {
  const returnEntries: Array<CoreSupportReportEntry> = [];
  const promoEntries = Promos.getInstance().promosByScancode;
  const inventoryImporter = Inventory.getInstance();
  await Inventory.state.onLoaded();
  const selectedDistributorsEntries =
    CoreSets.CoreSupportPriceListState.selectedDistributorsEntries;
  selectedDistributorsEntries.forEach((coreSupportPriceListEntry) => {
    const inventoryEntry = inventoryImporter.getEntryFromScanCode(
      coreSupportPriceListEntry.FormattedUPC
    );

    if (inventoryEntry !== undefined) {
      let lowestPricedWorksheetName = "Base Price";
      //Create an export Array for the entry
      let lowestPrice = parseFloat(inventoryEntry.BasePrice.replace("$", ""));
      const priceChanges = promoEntries.get(inventoryEntry.ScanCode);
      if (priceChanges != null) {
        Array.from(priceChanges.values()).forEach((priceChange) => {
          if (lowestPrice > parseFloat(priceChange.Price.replace("$", ""))) {
            lowestPrice = parseFloat(priceChange.Price.replace("$", ""));
            lowestPricedWorksheetName = priceChange.Worksheet;
          }
        });
      }

      const reportItem: CoreSupportReportEntry = {
        UPC: inventoryEntry.ScanCode,
        Brand: inventoryEntry.Brand,
        Description: inventoryEntry.Name,
        Subdepart: inventoryEntry.SubDepartment,
        CurrentBasePrice: inventoryEntry.BasePrice,
        LowestPrice: lowestPrice.toString(),
        CoreSetRetail: coreSupportPriceListEntry.EDLPPrice,
        NCGNotes: coreSupportPriceListEntry.LineNotes,
        DesiredRetail: "",
        Notes: lowestPricedWorksheetName,
        Dept: inventoryEntry.Department,
        Difference: (
          lowestPrice - parseFloat(coreSupportPriceListEntry.EDLPPrice)
        ).toFixed(2),
      };
      returnEntries.push(reportItem);
    }
  });

  CoreSets.state.setReportEntries(returnEntries);
};

export const reportEntriesAsTSVString = function () {
  const reportEntries = CoreSets.state.reportEntries;

  const exportArrayHeader = [
    "UPC",
    "Brand",
    "Description",
    "Subdepart",
    "Current Base Price",
    "Lowest Price",
    "Core Set Retail",
    "NCG Notes",
    "Desired price or leave blank to keep Current Retail",
    "Notes",
    "Dept",
    "Difference",
  ];

  let outputText = exportArrayHeader.join("\t") + "\n";

  reportEntries.forEach((entry) => {
    const exportArray = [
      entry.UPC,
      entry.Brand,
      entry.Description,
      entry.Subdepart,
      entry.CurrentBasePrice,
      entry.LowestPrice,
      entry.CoreSetRetail,
      entry.NCGNotes,
      entry.DesiredRetail,
      entry.Notes,
      entry.Dept,
      entry.Difference,
    ];
    //Add the exportArray to the output Text as a tab seperated value line
    outputText += exportArray.join("\t") + "\n";
  });

  return outputText;
};

export const reportEntriesAsXLSX = function () {
  const reportEntries = CoreSets.state.reportEntries;

  const exportArrayHeader = [
    "UPC",
    "Brand",
    "Description",
    "Sub Department",
    "Current Base Price",
    "Lowest Price",
    "Core Retail",
    "NCG Notes",
    "Desired price or leave blank to keep Current Retail",
    "Notes",
    "Dept",
    "Difference",
  ];

  const data = [exportArrayHeader];

  let UPCWidth = 3;
  let BrandWidth = 5;
  let DescriptionWidth = 14;
  let SubdepartWidth = 19;
  let CurrentBasePriceWidth = 12;
  let LowestPriceWidth = 12;
  let CoreSetRetailWidth = 12;
  let NCGNotesWidth = 9;
  let DesiredRetailWidth = 51;
  let NotesWidth = 5;
  let DeptWidth = 4;
  let DifferenceWidth = 10;

  const UPCMap: Map<string, CoreSupportReportEntry> = reportEntries.reduce(
    (map, obj) => {
      map.set(obj.UPC, obj);
      return map;
    },
    new Map<string, CoreSupportReportEntry>()
  );

  const items = Array.from(UPCMap.values());

  items.forEach((entry) => {
    const exportArray = [
      entry.UPC,
      entry.Brand,
      entry.Description,
      entry.Subdepart,
      entry.CurrentBasePrice,
      entry.LowestPrice,
      entry.CoreSetRetail,
      entry.NCGNotes,
      entry.DesiredRetail,
      entry.Notes,
      entry.Dept,
      entry.Difference,
    ];

    UPCWidth = Math.max(UPCWidth, entry.UPC?.length);
    BrandWidth = Math.max(BrandWidth, entry.Brand?.length);
    DescriptionWidth = Math.max(DescriptionWidth, entry.Description?.length);
    SubdepartWidth = Math.max(SubdepartWidth, entry.Subdepart?.length);
    CurrentBasePriceWidth = Math.max(
      CurrentBasePriceWidth,
      entry.CurrentBasePrice?.toString().length
    );
    LowestPriceWidth = Math.max(LowestPriceWidth, entry.LowestPrice.length);
    CoreSetRetailWidth = Math.max(
      CoreSetRetailWidth,
      entry.CoreSetRetail?.toString().length
    );
    NCGNotesWidth = Math.max(NCGNotesWidth, entry.NCGNotes?.length ?? 0);
    DesiredRetailWidth = Math.max(
      DesiredRetailWidth,
      entry.DesiredRetail?.toString().length
    );
    NotesWidth = Math.max(NotesWidth, entry.Notes?.length);
    DeptWidth = Math.max(DeptWidth, entry.Dept?.length);
    DifferenceWidth = Math.max(
      DifferenceWidth,
      entry.Difference?.toString().length
    );

    data.push(exportArray);
  });

  const reportSheet = XLSX.utils.aoa_to_sheet(data);

  reportSheet["!cols"] = [
    { wch: UPCWidth },
    { wch: BrandWidth },
    { wch: DescriptionWidth },
    { wch: SubdepartWidth },
    { wch: CurrentBasePriceWidth },
    { wch: LowestPriceWidth },
    { wch: CoreSetRetailWidth },
    { wch: NCGNotesWidth },
    { wch: DesiredRetailWidth },
    { wch: NotesWidth },
    { wch: DeptWidth },
    { wch: DifferenceWidth },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, reportSheet, "Report Data");
  reportSheet["A2"].s = { patternType: "solid", fgColor: { rgb: "FFFF00" } };

  const itemsNotInInventory = getDistributorItemsNotInInventory();

  const itemsNotInInventorySheet = XLSX.utils.aoa_to_sheet(itemsNotInInventory);

  XLSX.utils.book_append_sheet(
    workbook,
    itemsNotInInventorySheet,
    "Items not in Inventory"
  );

  dialog
    .showSaveDialog({ defaultPath: "coreSetReport.xlsx" })
    .then((result) => {
      if (!result.canceled && result.filePath) {
        const filePath = result.filePath;
        XLSX.writeFile(workbook, filePath);
      }
    });
};

const getDistributorItemsNotInInventory = function () {
  const selectedDistributorsEntries =
    CoreSets.CoreSupportPriceListState.selectedDistributorsEntries;
  const reportEntries = CoreSets.state.reportEntries;

  const UPCMap: Map<string, CoreSupportReportEntry> = reportEntries.reduce(
    (map, obj) => {
      map.set(obj.UPC, obj);
      return map;
    },
    new Map<string, CoreSupportReportEntry>()
  );

  const itemsNotInInventory = selectedDistributorsEntries.filter((item) => {
    return UPCMap.get(item.FormattedUPC) === undefined;
  });

  const exportArrayHeader = [
    "CoreSetsRound",
    "BuyInStart",
    "BuyInEnd",
    "Dept",
    "Category",
    "Distributor",
    "DistributorProductID",
    "UPCA",
    "FormattedUPC",
    "ReportingUPC",
    "Brand",
    "Description",
    "UnitCount",
    "PackSize",
    "PromoOI",
    "PromoMCB",
    "RebatePerUnit",
    "SaleCaseCost",
    "SaleUnitCost",
    "EDLPPrice",
    "Margin",
    "LineNotes",
    "Changes",
  ];

  const data = [exportArrayHeader];

  itemsNotInInventory.forEach((entry) => {
    data.push([
      `${entry.CoreSetsRound}`,
      `${entry.BuyInStart}`,
      `${entry.BuyInEnd}`,
      `${entry.Dept}`,
      `${entry.Category}`,
      `${entry.Distributor}`,
      `${entry.DistributorProductID}`,
      `${entry.UPCA}`,
      `${entry.FormattedUPC}`,
      `${entry.ReportingUPC}`,
      `${entry.Brand}`,
      `${entry.Description}`,
      `${entry.UnitCount}`,
      `${entry.PackSize}`,
      `${entry.PromoOI}`,
      `${entry.PromoMCB}`,
      `${entry.RebatePerUnit}`,
      `${entry.SaleCaseCost}`,
      `${entry.SaleUnitCost}`,
      `${entry.EDLPPrice}`,
      `${entry.Margin}`,
      `${entry.LineNotes}`,
      `${entry.Changes}`,
    ]);
  });

  return data;
};
