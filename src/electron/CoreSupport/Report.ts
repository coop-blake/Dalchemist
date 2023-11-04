import { createCoreSupportWithCatapultPricingTSV } from "./TSVOutputs";
import fs from "fs";
import { dialog } from "electron";
import { CoreSupportReportEntry } from "./shared";
import { CoreSets } from "./CoreSets";
import { Promos } from "../../Google/Inventory/Promos";
import { Inventory } from "../../Google/Inventory/Inventory";

export async function saveCoreSetsTSVPrompt() {
  const contentToSave = await createCoreSupportWithCatapultPricingTSV();
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

export const createReportEntries = function (): Array<CoreSupportReportEntry> {
  const returnEntries: Array<CoreSupportReportEntry> = [];
  const promoEntries = Promos.getInstance().promosByScancode;
  const coreSupport = CoreSets.getInstance().getCoreSupport();
  const inventoryImporter = Inventory.getInstance();

  const ourItems = CoreSets.state.coreSetItems;
  ourItems.forEach((coreSupportEntry) => {
    const inventoryEntry = inventoryImporter.getEntryFromScanCode(
      coreSupportEntry.id
    );

    if (inventoryEntry !== undefined) {
      let lowestPricedWorksheetName = "Base Price";
      //Create an export Array for the entry
      let lowestPrice = parseFloat(inventoryEntry.BasePrice.replace("$", ""));
      const priceChanges = promoEntries.get(inventoryEntry.ScanCode);
      if (priceChanges != null) {
        Array.from(priceChanges.values()).forEach((priceChange) => {
          if (lowestPrice > parseFloat(priceChange.Price)) {
            lowestPrice = parseFloat(priceChange.Price);
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
        CoreSetRetail: coreSupportEntry.EDLPPrice,
        NCGNotes: coreSupportEntry.LineNotes,
        DesiredRetail: "",
        Notes: lowestPricedWorksheetName,
        Dept: inventoryEntry.Department,
        Difference: (
          lowestPrice - parseFloat(coreSupportEntry.EDLPPrice)
        ).toFixed(2)
      };
      returnEntries.push(reportItem);
    }
  });

  return returnEntries;
};
