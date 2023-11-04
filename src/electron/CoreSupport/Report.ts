import { createCoreSupportWithCatapultPricingTSV } from "./TSVOutputs";
import fs from "fs";
import { dialog } from "electron";

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
