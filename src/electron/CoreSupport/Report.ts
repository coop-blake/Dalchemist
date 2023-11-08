import fs from "fs";
import { dialog } from "electron";
import { CoreSupportReportEntry } from "./shared";
import { CoreSets } from "./CoreSets";
import { Promos } from "../../Google/Inventory/Promos";
import { Inventory } from "../../Google/Inventory/Inventory";

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

export const processReportEntries = function () {
  const returnEntries: Array<CoreSupportReportEntry> = [];
  const promoEntries = Promos.getInstance().promosByScancode;
  const inventoryImporter = Inventory.getInstance();

  const selectedDistributorsEntries =
    CoreSets.CoreSupportPriceListState.selectedDistributorsEntries;
  selectedDistributorsEntries.forEach((coreSupportPriceListEntry) => {
    const inventoryEntry = inventoryImporter.getEntryFromScanCode(
      coreSupportPriceListEntry.id
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
