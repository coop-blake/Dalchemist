import { Promos } from "../../Google/Inventory/Promos";
import { PromoEntry } from "../../Google/Inventory/shared";
import { Inventory } from "../../Google/Inventory/Inventory";

import { Google } from "../../Google/google";

import chalk from "chalk";

// Use different colors for different log levels
const info = chalk.blue;
const warn = chalk.yellow;
const error = chalk.red;

const inventoryImporter = Inventory.getInstance();

export async function testPromos(): Promise<boolean> {
  let multipleItems = 0;
  return new Promise(async (resolve) => {
    const timeoutId = setTimeout(() => {
      console.log("Could not load API");
      resolve(false);
    }, 10000);

    await Inventory.state.onLoaded();
    clearTimeout(timeoutId);

    const promos = Promos.getInstance().getPromosArray();

    const promoEntries = Promos.getInstance().promosByScancode;
    console.log(
      info(
        `${promoEntries.size} inventory items from ${promos.length} promo entries`
      )
    );

    const worksheets = Promos.getInstance().getWorksheets();
    console.log(`${worksheets.length} worksheets`);
    worksheets.forEach((worksheet) => {
      console.log(worksheet);
    });

    promoEntries.forEach((itemEntries) => {
      if (itemEntries.length > 1) {
        multipleItems++;
      }

      if (itemEntries.length === 1) {
        const item = inventoryImporter.getEntryFromScanCode(
          itemEntries[0].ScanCode
        );
        if (item) {
          const itemPromoStatus = checkPromoItemPricing(itemEntries);
          if (itemPromoStatus.salesAreLessThenBase === false) {
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
    promoIsEqualToBase: false,
    promoPriceConsitency: true,
  };

  if (promoEntries.length > 0) {
    const item = inventoryImporter.getEntryFromScanCode(
      promoEntries[0].ScanCode
    );
    promoEntries.forEach((promoEntry) => {
      const promoPrice = parseFloat(promoEntry.Price.replace("$", ""));
      const basePrice = parseFloat(item?.BasePrice.replace("$", "") ?? "");
      // console.log(
      //   `${item?.Brand} ${item?.Name} is on ${promoEntry.Worksheet} at ${promoEntry.Price}`
      // );
      if (promoPrice > basePrice) {
        console.log(error("Bad Price"), promoPrice, basePrice);

        promoStatus.salesAreLessThenBase = false;
      } else if (promoPrice === basePrice) {
        if (promoEntry.Discount === "") {
          console.log(
            warn("Equal Price"),
            promoPrice,
            basePrice,
            `${item?.Brand} ${item?.Name}`
          );
          promoStatus.promoIsEqualToBase = false;
        }
      }

      promoEntries.forEach((checkPromoEntry) => {
        const checkPromoPrice = parseFloat(
          checkPromoEntry.Price.replace("$", "")
        );
        if (checkPromoPrice !== promoPrice) {
          console.log(
            warn("Promo Inconsitency in Price"),
            checkPromoPrice,
            promoPrice,
            basePrice,
            `${item?.Brand} ${item?.Name}`
          );
          promoStatus.promoPriceConsitency = false;
        }
      });
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
