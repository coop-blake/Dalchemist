//When ran this file returns a list of lines with duplicate Values
//in the first coloumn of a tab seperated file
//
//Can be used to check Sale imports that are copied from NCG files
//
//Todo: Add arguments to chose which column contains the unique id
//and an argument for checking a file by path

//Import the Inventory And Pricebook Importers
import TextImporter from "../TextImporters/TextImporter.js";

//Create new Import object

const DupCheckImport = new TextImporter();

let entryDups = {};
let dupEntries = {};
DupCheckImport.processedValues = {};

DupCheckImport.textFilePath = "./Data/Inputs/CheckForDups.txt";
DupCheckImport.processLine = function (line) {
  let values = line.split("\t");
  //Split lines into an array of values

  let entry = this.entryFromValueArray(values);
  let scanCode = entry.scanCode;
  if (scanCode && !this.processedValues[scanCode]) {
    //There is a scancode and we haven't processed it yet
    this.processedValues[scanCode] = entry;

    dupEntries[scanCode] = [entry];
  } else {
    //Already Proccessed this scanCode
    //if there is no value stored, set to 1
    let entrycount = entryDups[scanCode] ? entryDups[scanCode] : 1;
    //Add 1 and store
    entryDups[scanCode] = entrycount + 1;

    dupEntries[scanCode].push(entry);
  }
};

DupCheckImport.entryFromValueArray = function (valueArray) {
  //Based off of expected Values as outlined in
  // Data/Inputs/README.md
  let entry = {};

  entry.scanCode = valueArray[0].trim();
  entry.price = valueArray[1].trim();
  //All values as array as received
  entry.valuesArray = valueArray;

  return entry;
};
//Tell them to load their entries
await DupCheckImport.start();

// //Output the string to the console

Object.entries(entryDups).forEach((entry) => {
  console.log(`${entry[0]} was in document ${entry[1]} times`);

  // console.log(JSON.stringify(dupEntries[entry[0]]))

  dupEntries[entry[0]].forEach((dupEntry) => {
    console.log(`Price: ${dupEntry.price}`);
  });
});

console.log(`${Object.entries(entryDups).length} Duplicated Entries`);
