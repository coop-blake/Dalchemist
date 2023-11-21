import { CoreSupportEntry } from "./CoreSupport";
const ourDistributors = [
  "Equal Exchange - Direct",
  "Tony's Fine Foods - Ridgefield, WA",
  "UNFI - Ridgefield, WA",
  "Ancient Nutrition - Direct"
];

export function entryIsOurDistributor(entry: CoreSupportEntry) {
  if (ourDistributors.includes(entry.Distributor)) {
    return true;
  } else {
    return false;
  }
}
