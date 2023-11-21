import { Inventory as GoogleInventory } from "../Inventory";

export const returnUserScancodeSearch = (input: string): string => {
  const inventory = GoogleInventory.getInstance();

  function getLineFromScanCode(ScanCode: string): string {
    const entry = inventory.getEntryFromScanCode(ScanCode);
    return entry ? entry.valuesArray.join(" | ") : "No Item Found: " + ScanCode;
  }

  if (input.includes(",")) {
    const scanCodes = input.split(",").map((code) => code.trim());
    let returnString = "";
    scanCodes.forEach((ScanCode) => {
      returnString += getLineFromScanCode(ScanCode);
    });
    return returnString;
  } else {
    return getLineFromScanCode(input.trim());
  }
};
