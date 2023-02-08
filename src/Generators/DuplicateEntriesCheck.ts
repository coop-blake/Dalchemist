//When ran this file returns a list of lines with duplicate Values
//in the first coloumn of a tab seperated file
//
//Can be used to check Sale imports that are copied from NCG files
//
//Todo: Add arguments to chose which column contains the unique id
//and an argument for checking a file by path

//Import the Inventory And Pricebook Importers
import TextImporter from "../TextImporters/TextImporter";

//Create new Import object

class InventoryTextImporter extends TextImporter {
  //Set Path Of Inventory File
  textFilePath = "./Data/Inputs/CheckForDups.txt";
  invalidEntries = new Array<DupCheckEntry>();
  entries = new Map<string, DupCheckEntry>();

  dupEntries = new Map<string, Array<DupCheckEntry>>();

  constructor() {
    //call TextImporter Parent Constructor
    super();
  }

  processLine = (line: string) => {
    const values = line.split("\t");
    //Split lines into an array of values

    const entry = this.entryFromValueArray(values);
    const scanCode = entry?.scanCode;
    if (scanCode && !this.entries.get(scanCode)) {
      //There is a scancode and we haven't processed it yet
      this.entries.set(scanCode, entry);
    } else {
      //Already Proccessed this scanCode
      //push to duplicate entries list
      const scanCodeDupList =
        this.dupEntries.get(scanCode) || Array<DupCheckEntry>();

      scanCodeDupList.push(entry);
      this.dupEntries.set(scanCode, scanCodeDupList);
    }
  };

  entryFromValueArray = function (valueArray: Array<string>): DupCheckEntry {
    //Based off of expected Values as outlined in
    // Data/Inputs/README.md
    const entry: DupCheckEntry = {
      scanCode: valueArray[0].trim(),
      price: valueArray[1].trim(),
      //All values as array as received
      valuesArray: valueArray,
    };

    return entry;
  };
}

export type DupCheckEntry = {
  scanCode: string;
  price: string;

  valuesArray: Array<string>;
};

const DupCheckImport = new InventoryTextImporter();

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
