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

  const itemsNotInInventoryDataColumns = getDistributorItemsNotInInventory();

  const itemsNotInInventory = itemsNotInInventoryDataColumns.data;
  const itemsNotInInventoryColWidths = itemsNotInInventoryDataColumns.colWidths;

  const itemsNotInInventorySheet = XLSX.utils.aoa_to_sheet(itemsNotInInventory);
  itemsNotInInventorySheet["!cols"] = itemsNotInInventoryColWidths;
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

        try {
          XLSX.writeFile(workbook, filePath);
        } catch (error) {
          dialog.showErrorBox(
            "Error",
            `Failed to write file to ${filePath}. ${error.message}`
          );
        }
      }
    })
    .catch((error) => {
      dialog.showErrorBox("Error", error.message);
    });
};

const getDistributorItemsNotInInventory = function () {
  let CoreSetsRoundWidth = 10;
  let BuyInStartWidth = 10;
  let BuyInEndWidth = 10;
  let DeptWidth = 10;
  let CategoryWidth = 10;
  let DistributorWidth = 10;
  let DistributorProductIDWidth = 20;
  let UPCAWidth = 10;
  let FormattedUPCWidth = 10;
  let ReportingUPCWidth = 10;
  let BrandWidth = 10;
  let DescriptionWidth = 10;
  let UnitCountWidth = 10;
  let PackSizeWidth = 10;
  let PromoOIWidth = 10;
  let PromoMCBWidth = 10;
  let RebatePerUnitWidth = 10;
  let SaleCaseCostWidth = 10;
  let SaleUnitCostWidth = 10;
  let EDLPPriceWidth = 10;
  let MarginWidth = 10;
  let LineNotesWidth = 10;
  let ChangesWidth = 10;

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
    CoreSetsRoundWidth = Math.max(
      CoreSetsRoundWidth,
      entry.CoreSetsRound?.length ?? 0
    );
    BuyInStartWidth = Math.max(BuyInStartWidth, entry.BuyInStart?.length ?? 0);
    BuyInEndWidth = Math.max(BuyInEndWidth, entry.BuyInEnd?.length ?? 0);
    DeptWidth = Math.max(DeptWidth, entry.Dept?.length ?? 0);
    CategoryWidth = Math.max(CategoryWidth, entry.Category?.length ?? 0);
    DistributorWidth = Math.max(
      DistributorWidth,
      entry.Distributor?.length ?? 0
    );
    DistributorProductIDWidth = Math.max(
      DistributorProductIDWidth,
      entry.DistributorProductID?.length ?? 0
    );
    UPCAWidth = Math.max(UPCAWidth, entry.UPCA?.length ?? 0);
    FormattedUPCWidth = Math.max(
      FormattedUPCWidth,
      entry.FormattedUPC?.length ?? 0
    );
    ReportingUPCWidth = Math.max(
      ReportingUPCWidth,
      entry.ReportingUPC?.length ?? 0
    );
    BrandWidth = Math.max(BrandWidth, entry.Brand?.length ?? 0);
    DescriptionWidth = Math.max(
      DescriptionWidth,
      entry.Description?.length ?? 0
    );
    UnitCountWidth = Math.max(UnitCountWidth, entry.UnitCount?.length ?? 0);
    PackSizeWidth = Math.max(PackSizeWidth, entry.PackSize?.length ?? 0);
    PromoOIWidth = Math.max(PromoOIWidth, entry.PromoOI?.length ?? 0);
    PromoMCBWidth = Math.max(PromoMCBWidth, entry.PromoMCB?.length ?? 0);
    RebatePerUnitWidth = Math.max(
      RebatePerUnitWidth,
      entry.RebatePerUnit?.length ?? 0
    );
    SaleCaseCostWidth = Math.max(
      SaleCaseCostWidth,
      entry.SaleCaseCost?.length ?? 0
    );
    SaleUnitCostWidth = Math.max(
      SaleUnitCostWidth,
      entry.SaleUnitCost?.length ?? 0
    );
    EDLPPriceWidth = Math.max(EDLPPriceWidth, entry.EDLPPrice?.length ?? 0);
    MarginWidth = Math.max(MarginWidth, entry.Margin?.length ?? 0);
    LineNotesWidth = Math.max(LineNotesWidth, entry.LineNotes?.length ?? 0);
    ChangesWidth = Math.max(ChangesWidth, entry.Changes?.length ?? 0);

    data.push([
      `${entry.CoreSetsRound ?? ""}`,
      `${entry.BuyInStart ?? ""}`,
      `${entry.BuyInEnd ?? ""}`,
      `${entry.Dept ?? ""}`,
      `${entry.Category ?? ""}`,
      `${entry.Distributor ?? ""}`,
      `${entry.DistributorProductID ?? ""}`,
      `${entry.UPCA ?? ""}`,
      `${entry.FormattedUPC ?? ""}`,
      `${entry.ReportingUPC ?? ""}`,
      `${entry.Brand ?? ""}`,
      `${entry.Description ?? ""}`,
      `${entry.UnitCount ?? ""}`,
      `${entry.PackSize ?? ""}`,
      `${entry.PromoOI ?? ""}`,
      `${entry.PromoMCB ?? ""}`,
      `${entry.RebatePerUnit ?? ""}`,
      `${entry.SaleCaseCost ?? ""}`,
      `${entry.SaleUnitCost ?? ""}`,
      `${entry.EDLPPrice ?? ""}`,
      `${entry.Margin ?? ""}`,
      `${entry.LineNotes ?? ""}`,
      `${entry.Changes ?? ""}`,
    ]);
  });

  const colWidths = [
    { wch: CoreSetsRoundWidth },
    { wch: BuyInStartWidth },
    { wch: BuyInEndWidth },
    { wch: DeptWidth },
    { wch: CategoryWidth },
    { wch: DistributorWidth },
    { wch: DistributorProductIDWidth },
    { wch: UPCAWidth },
    { wch: FormattedUPCWidth },
    { wch: ReportingUPCWidth },
    { wch: BrandWidth },
    { wch: DescriptionWidth },
    { wch: UnitCountWidth },
    { wch: PackSizeWidth },
    { wch: PromoOIWidth },
    { wch: PromoMCBWidth },
    { wch: RebatePerUnitWidth },
    { wch: SaleCaseCostWidth },
    { wch: SaleUnitCostWidth },
    { wch: EDLPPriceWidth },
    { wch: MarginWidth },
    { wch: LineNotesWidth },
    { wch: ChangesWidth },
  ];

  return { data: data, colWidths: colWidths };
};
