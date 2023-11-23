import { Promos } from "../../Google/Inventory/Promos";
import { PromoEntry } from "../../Google/Inventory/shared";
import { Inventory } from "../../Google/Inventory/Inventory";

import { Google } from "../../Google/google";

const inventoryImporter = Inventory.getInstance();

export async function testPromos(): Promise<boolean> {
  let multipleItems = 0;
  return new Promise(async (resolve) => {
    const timeoutId = setTimeout(() => {
      console.log("Could not load API");
      resolve(false);
    }, 4000);

    await Inventory.state.onLoaded();
    clearTimeout(timeoutId);

    const promos = Promos.getInstance().getPromosArray();

    const promoEntries = Promos.getInstance().promosByScancode;
    console.log(
      `${promoEntries.size} inventory items from ${promos.length} promo entries`
    );

    promoEntries.forEach((itemEntries) => {
      if (itemEntries.length > 1) {
        multipleItems++;
        const item = inventoryImporter.getEntryFromScanCode(
          itemEntries[0].ScanCode
        );
        if (item) {
          const itemPromoStatus = checkPromoItemPricing(itemEntries);
          if (itemPromoStatus.salesAreLessThenBase == false) {
            console.log(`${item.Name} Price is off`);
          }
        } else {
          console.log("No item for promo entry: ", itemEntries[0]);
        }
      }
    });

    console.log(`${multipleItems} Items with multiple entries`);
    resolve(true);
  });
}

function checkPromoItemPricing(promoEntries: PromoEntry[]) {
  const promoStatus = {
    salesAreLessThenBase: true,
  };

  if (promoEntries.length > 0) {
    const item = inventoryImporter.getEntryFromScanCode(
      promoEntries[0].ScanCode
    );
    promoEntries.forEach((promoEntry) => {
      // console.log(
      //   `${item?.Brand} ${item?.Name} is on ${promoEntry.Worksheet} at ${promoEntry.Price}`
      // );
      if (parseFloat(promoEntry.Price) >= parseFloat(item?.BasePrice ?? "")) {
        console.log("Bad Price");
        promoStatus.salesAreLessThenBase = false;
      }
    });
  }

  return promoStatus;
}

// function that checks if two date ranges overlap
function checkDateRangeOverlap(a: PromoEntry, b: PromoEntry) {
  const aStart = new Date(a.Start);
  const aEnd = new Date(a.End);
  const bStart = new Date(b.Start);
  const bEnd = new Date(b.End);

  return aStart <= bEnd && bStart <= aEnd;
}
