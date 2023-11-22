import { Promos } from "../../Google/Inventory/Promos";
import { Inventory } from "../../Google/Inventory/Inventory";

import { Google } from "../../Google/google";

export async function testPromos(): Promise<boolean> {
  return new Promise(async (resolve) => {
    const timeoutId = setTimeout(() => {
      console.log("Could not load API");
      resolve(false);
    }, 4000);

    const inventoryImporter = Inventory.getInstance();

    await Inventory.state.onLoaded();
    clearTimeout(timeoutId);

    const promoEntries = Promos.getInstance().promosByScancode;
    console.log(promoEntries);

    promoEntries.forEach((promoEntry) => {
      const item = inventoryImporter.getEntryFromScanCode(
        promoEntry[0].ScanCode
      );
      if (item) {
        console.log(item);
      } else {
        console.log("No item for promo entry: ", promoEntry);
      }
    });
  });
}
