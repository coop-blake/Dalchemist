import fs from "fs";
import path from "path";
import { dialog } from "electron";
import {
  CoreSetsAndBasicsPriceListEntry,
  CoreSupportReportEntry,
} from "./shared";
import { CoreSets } from "./CoreSets";
import { Promos } from "../../Google/Inventory/Promos";
import { Inventory } from "../../Google/Inventory/Inventory";

import xlsx from "node-xlsx";

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
  selectedDistributorsEntries.forEach(
    (coreSetsAndBasicsPriceListEntry: CoreSetsAndBasicsPriceListEntry) => {
      const inventoryEntry = inventoryImporter.getEntryFromScanCode(
        coreSetsAndBasicsPriceListEntry.CatapultUPC
      );

      if (inventoryEntry !== undefined) {
        let lowestPricedWorksheetName = "Base Price";
        //Create an export Array for the entry
        let lowestPrice = parseFloat(inventoryEntry.BasePrice.replace("$", ""));
        const priceChanges = promoEntries.get(inventoryEntry.ScanCode);
        if (priceChanges != null) {
          Array.from(priceChanges.values()).forEach((priceChange) => {
            if (priceChange.Worksheet.toLowerCase().includes("basics")) {
              if (
                lowestPrice > parseFloat(priceChange.Price.replace("$", ""))
              ) {
                lowestPrice = parseFloat(priceChange.Price.replace("$", ""));
                lowestPricedWorksheetName = priceChange.Worksheet;
              }
            }
          });
        }

        const reportItem: CoreSupportReportEntry = {
          Program: coreSetsAndBasicsPriceListEntry.Program,
          CostVariation: coreSetsAndBasicsPriceListEntry.CostVariation,
          StockingRequired: coreSetsAndBasicsPriceListEntry.StockingRequired,
          Start: coreSetsAndBasicsPriceListEntry.Start,
          End: coreSetsAndBasicsPriceListEntry.End,
          Distributor: coreSetsAndBasicsPriceListEntry.Distributor,
          UPC: inventoryEntry.ScanCode,
          Brand: inventoryEntry.Brand,
          Description: inventoryEntry.Name,
          Subdepart: inventoryEntry.SubDepartment,
          BasePrice: inventoryEntry.BasePrice,
          LowestPrice: lowestPrice.toString(),
          PriceCeiling: coreSetsAndBasicsPriceListEntry.PriceCeiling,
          NCGNotes: combineNotes(coreSetsAndBasicsPriceListEntry),

          DesiredRetail: "",
          Notes: lowestPricedWorksheetName,
          Dept: inventoryEntry.Department,
          Difference: (
            lowestPrice -
            parseFloat(coreSetsAndBasicsPriceListEntry.PriceCeiling)
          ).toFixed(2),
        };
        returnEntries.push(reportItem);
      }
    }
  );

  CoreSets.state.setReportEntries(returnEntries);
};

const combineNotes = function (
  coreSetsAndBasicsPriceListEntry: CoreSetsAndBasicsPriceListEntry
) {
  if (
    coreSetsAndBasicsPriceListEntry.LineNotes !== "" &&
    coreSetsAndBasicsPriceListEntry.Changes !== ""
  ) {
    return (
      coreSetsAndBasicsPriceListEntry.LineNotes +
      " : " +
      coreSetsAndBasicsPriceListEntry.Changes
    );
  } else {
    return (
      coreSetsAndBasicsPriceListEntry.LineNotes +
      coreSetsAndBasicsPriceListEntry.Changes
    );
  }
};

export const reportEntriesAsTSVString = function () {
  const reportEntries = CoreSets.state.reportEntries;

  const exportArrayHeader = [
    "Program",
    "CostVariation",
    "StockingRequired",
    "Start",
    "End",
    "Distributor",
    "UPC",
    "Brand",
    "Description",
    "Sub Department",
    "Base Price",
    "Lowest Price",
    "Price Ceiling",
    "NCG Notes",
    "Desired price or leave blank to keep Current Retail",
    "Notes",
    "Dept",
    "Difference",
  ];

  let outputText = exportArrayHeader.join("\t") + "\n";

  reportEntries.forEach((entry) => {
    const exportArray = [
      entry.Program,
      entry.CostVariation,
      entry.StockingRequired,
      entry.Start,
      entry.End,
      entry.Distributor,
      entry.UPC,
      entry.Brand,
      entry.Description,
      entry.Subdepart,
      entry.BasePrice,
      entry.LowestPrice,
      entry.PriceCeiling,
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
    "Program",
    "CostVariation",
    "StockingRequired",
    "Start",
    "End",
    "Distributor",
    "UPC",
    "Brand",
    "Description",
    "Sub Department",
    "Base Price",
    "Lowest Price",
    "Price Ceiling",
    "NCG Notes",
    "Desired price or leave blank to keep Current Retail",
    "Notes",
    "Dept",
    "Difference",
  ];

  const data = [exportArrayHeader];

  let ProgramWidth = 10;
  let CostVariationWidth = 10;
  let StockingRequiredWidth = 10;
  let StartWidth = 10;
  let EndWidth = 10;
  let DistributorWidth = 10;
  let UPCWidth = 3;
  let BrandWidth = 5;
  let DescriptionWidth = 14;
  let SubdepartWidth = 19;
  let BasePriceWidth = 12;
  let LowestPriceWidth = 12;
  let PriceCeilingWidth = 12;
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
      entry.Program,
      entry.CostVariation,
      entry.StockingRequired,
      entry.Start,
      entry.End,
      entry.Distributor,
      entry.UPC,
      entry.Brand,
      entry.Description,
      entry.Subdepart,
      entry.BasePrice,
      entry.LowestPrice,
      entry.PriceCeiling,
      entry.NCGNotes,
      entry.DesiredRetail,
      entry.Notes,
      entry.Dept,
      entry.Difference,
    ];

    ProgramWidth = Math.max(ProgramWidth, entry.UPC?.length);
    CostVariationWidth = Math.max(
      CostVariationWidth,
      entry.CostVariation?.length
    );
    StockingRequiredWidth = Math.max(
      StockingRequiredWidth,
      entry.StockingRequired?.length
    );
    StartWidth = Math.max(StartWidth, entry.Start?.length);
    EndWidth = Math.max(EndWidth, entry.End?.length);
    DistributorWidth = Math.max(DistributorWidth, entry.Distributor?.length);
    UPCWidth = Math.max(UPCWidth, entry.UPC?.length);
    BrandWidth = Math.max(BrandWidth, entry.Brand?.length);
    DescriptionWidth = Math.max(DescriptionWidth, entry.Description?.length);
    SubdepartWidth = Math.max(SubdepartWidth, entry.Subdepart?.length);
    BasePriceWidth = Math.max(
      BasePriceWidth,
      entry.BasePrice?.toString().length
    );
    LowestPriceWidth = Math.max(LowestPriceWidth, entry.LowestPrice.length);
    PriceCeilingWidth = Math.max(
      PriceCeilingWidth,
      entry.PriceCeiling?.toString().length
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

  const reportSheetColWidths = [
    { wch: ProgramWidth },
    { wch: CostVariationWidth },
    { wch: StockingRequiredWidth },
    { wch: StartWidth },
    { wch: EndWidth },
    { wch: DistributorWidth },
    { wch: UPCWidth },
    { wch: BrandWidth },
    { wch: DescriptionWidth },
    { wch: SubdepartWidth },
    { wch: BasePriceWidth },
    { wch: LowestPriceWidth },
    { wch: PriceCeilingWidth },
    { wch: NCGNotesWidth },
    { wch: DesiredRetailWidth },
    { wch: NotesWidth },
    { wch: DeptWidth },
    { wch: DifferenceWidth },
  ];

  const itemsNotInInventoryDataColumns = getDistributorItemsNotInInventory();

  const itemsNotInInventory = itemsNotInInventoryDataColumns.data;
  const itemsNotInInventoryColWidths = itemsNotInInventoryDataColumns.colWidths;

  const buffer = xlsx.build(
    [
      {
        name: "Report Data",
        data: data,
        options: {
          "!cols": reportSheetColWidths,
        },
      },
      {
        name: "Items not in Inventory",
        data: itemsNotInInventory,
        options: { "!cols": itemsNotInInventoryColWidths },
      },
    ],
    {}
  );

  dialog
    .showSaveDialog({
      defaultPath: "coreSetReport.xlsx",
      title: "Save file as",
      filters: [
        {
          name: "Spreadsheets",
          extensions: ["xlsx"],
        },
      ],
    })
    .then(async (result) => {
      if (!result.canceled && result.filePath) {
        const filePath = path.resolve(result.filePath);
        fs.writeFileSync(filePath, buffer);
      }
    })
    .catch((error) => {
      dialog.showErrorBox(
        "Error",
        `Something happened during write ${error.message}`
      );
    });
};

const getDistributorItemsNotInInventory = function () {
  let ProgramWidth = 10;
  let CostVariationWidth = 10;
  let StockingRequiredWidth = 10;
  let StartWidth = 10;
  let EndWidth = 10;
  let DistributorWidth = 10;
  let DistributorProductIDWidth = 10;
  let UPCAWidth = 10;
  let CatapultUPCWidth = 10;
  let SMSUPCWidth = 10;
  let BrandWidth = 10;
  let DescriptionWidth = 10;
  let CountWidth = 10;
  let SizeWidth = 10;
  let UOMWidth = 10;
  let OIWidth = 10;
  let MCBWidth = 10;
  let UnitRebateWidth = 10;
  let CaseCostWidth = 10;
  let UnitCostWidth = 10;
  let PriceCeilingWidth = 10;
  let MarginWidth = 10;
  let LineNotesWidth = 10;
  let ChangesWidth = 10;
  let DepartmentWidth = 10;
  let SubdepartmentWidth = 10;
  let CategoryWidth = 10;
  let SubcategoryWidth = 10;

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
    "Program",
    "CostVariation",
    "StockingRequired",
    "Start",
    "End",
    "Distributor",
    "DistributorProductID",
    "UPCA",
    "CatapultUPC",
    "SMSUPC",
    "Brand",
    "Description",
    "Count",
    "Size",
    "UOM",
    "OI",
    "MCB",
    "UnitRebate",
    "CaseCost",
    "UnitCost",
    "PriceCeiling",
    "Margin",
    "LineNotes",
    "Changes",
    "Department",
    "Subdepartment",
    "Category",
    "Subcategory",
  ];

  const data = [exportArrayHeader];

  itemsNotInInventory.forEach((entry: CoreSetsAndBasicsPriceListEntry) => {
    ProgramWidth = Math.max(ProgramWidth, entry.Program?.length ?? 0);
    CostVariationWidth = Math.max(
      CostVariationWidth,
      entry.CostVariation?.length ?? 0
    );
    StockingRequiredWidth = Math.max(
      StockingRequiredWidth,
      entry.StockingRequired?.length ?? 0
    );
    StartWidth = Math.max(StartWidth, entry.Start?.length ?? 0);
    EndWidth = Math.max(EndWidth, entry.End?.length ?? 0);
    CatapultUPCWidth = Math.max(
      CatapultUPCWidth,
      entry.CatapultUPC?.length ?? 0
    );
    SMSUPCWidth = Math.max(SMSUPCWidth, entry.SMSUPC?.length ?? 0);
    CountWidth = Math.max(CountWidth, entry.Count?.length ?? 0);
    SizeWidth = Math.max(SizeWidth, entry.Size?.length ?? 0);
    UOMWidth = Math.max(UOMWidth, entry.UOM?.length ?? 0);
    OIWidth = Math.max(OIWidth, entry.OI?.length ?? 0);
    MCBWidth = Math.max(MCBWidth, entry.MCB?.length ?? 0);
    UnitRebateWidth = Math.max(UnitRebateWidth, entry.UnitRebate?.length ?? 0);
    CaseCostWidth = Math.max(CaseCostWidth, entry.CaseCost?.length ?? 0);
    UnitCostWidth = Math.max(UnitCostWidth, entry.UnitCost?.length ?? 0);
    PriceCeilingWidth = Math.max(
      PriceCeilingWidth,
      entry.PriceCeiling?.length ?? 0
    );
    DepartmentWidth = Math.max(DepartmentWidth, entry.Department?.length ?? 0);
    SubdepartmentWidth = Math.max(
      SubdepartmentWidth,
      entry.Subdepartment?.length ?? 0
    );
    SubcategoryWidth = Math.max(
      SubcategoryWidth,
      entry.Subcategory?.length ?? 0
    );

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

    BrandWidth = Math.max(BrandWidth, entry.Brand?.length ?? 0);
    DescriptionWidth = Math.max(
      DescriptionWidth,
      entry.Description?.length ?? 0
    );

    MarginWidth = Math.max(MarginWidth, entry.Margin?.length ?? 0);
    LineNotesWidth = Math.max(LineNotesWidth, entry.LineNotes?.length ?? 0);
    ChangesWidth = Math.max(ChangesWidth, entry.Changes?.length ?? 0);
    data.push([
      `${entry.Program ?? ""}`,
      `${entry.CostVariation ?? ""}`,
      `${entry.StockingRequired ?? ""}`,
      `${entry.Start ?? ""}`,
      `${entry.End ?? ""}`,
      `${entry.Distributor ?? ""}`,
      `${entry.DistributorProductID ?? ""}`,
      `${entry.UPCA ?? ""}`,
      `${entry.CatapultUPC ?? ""}`,
      `${entry.SMSUPC ?? ""}`,
      `${entry.Brand ?? ""}`,
      `${entry.Description ?? ""}`,
      `${entry.Count ?? ""}`,
      `${entry.Size ?? ""}`,
      `${entry.UOM ?? ""}`,
      `${entry.OI ?? ""}`,
      `${entry.MCB ?? ""}`,
      `${entry.UnitRebate ?? ""}`,
      `${entry.CaseCost ?? ""}`,
      `${entry.UnitCost ?? ""}`,
      `${entry.PriceCeiling ?? ""}`,
      `${entry.Margin ?? ""}`,
      `${entry.LineNotes ?? ""}`,
      `${entry.Changes ?? ""}`,
      `${entry.Department ?? ""}`,
      `${entry.Subdepartment ?? ""}`,
      `${entry.Category ?? ""}`,
      `${entry.Subcategory ?? ""}`,
    ]);
  });
  const colWidths = [
    { wch: ProgramWidth },
    { wch: CostVariationWidth },
    { wch: StockingRequiredWidth },
    { wch: StartWidth },
    { wch: EndWidth },
    { wch: DistributorWidth },
    { wch: DistributorProductIDWidth },
    { wch: UPCAWidth },
    { wch: CatapultUPCWidth },
    { wch: SMSUPCWidth },
    { wch: BrandWidth },
    { wch: DescriptionWidth },
    { wch: CountWidth },
    { wch: SizeWidth },
    { wch: UOMWidth },
    { wch: OIWidth },
    { wch: MCBWidth },
    { wch: UnitRebateWidth },
    { wch: CaseCostWidth },
    { wch: UnitCostWidth },
    { wch: PriceCeilingWidth },
    { wch: MarginWidth },
    { wch: LineNotesWidth },
    { wch: ChangesWidth },
    { wch: DepartmentWidth },
    { wch: SubdepartmentWidth },
    { wch: CategoryWidth },
    { wch: SubcategoryWidth },
  ];

  return { data: data, colWidths: colWidths };
};
