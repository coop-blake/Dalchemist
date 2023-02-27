/**
 
 * When ran this file returns a list of lines with duplicate Values
 * in the first coloumn of a tab seperated file
 * 
 * Can be used to check Sale imports that are copied from NCG files
 * 
 * Todo: Add arguments to chose which column contains the unique id
 * and an argument for checking a file by path
 * 
 * Import the Inventory And PriceBook Importers
 * 
 * @module DuplicateEntriesCheck
 * @category Utility
 * 
 */




import DuplicateEntry, {DupCheckEntry} from "../TextImporters/DuplicateEntry"

const DupCheckImport = new DuplicateEntry();

DupCheckImport.start()
  .then(() => {
    const entries = DupCheckImport.entries;
    DupCheckImport.dupEntries.forEach((entry) => {
      const originalEntry = entries.get(entry[0].scanCode);
      if (originalEntry != null) {
        console.log(
          `${entry[0].scanCode} was in document ${entry.length + 1} times`
        );
        console.log(
          `Frist    :${originalEntry.scanCode}:${originalEntry.price} times`
        );

        entry.forEach((dupEntry) => {
          console.log(
            `         :${originalEntry.scanCode}:${originalEntry.price} times`
          );
        });
      }
    });
    console.log(`${DupCheckImport.dupEntries.size} Duplicated Entries`);
  })
  .catch((error) => {
    console.error;
  });
