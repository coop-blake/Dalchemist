//Import TextImporter Class
import TextImporter from './TextImporter.js'

class InventoryTextImporter extends TextImporter{
    //Set Path Of Inventory File
    textFilePath = "./Data/Inputs/Inventory.txt"
    //Create empty Object for storing processed Values
    processedValues = {}
   

    constructor(){
    //call TextImporter Parent Constructor
       super();
    }
    
    processLine(line){
        let values = line.split("\t")
        //Split lines into an array of values
        if(this.lineCount == 1 && values[0] == "Scan Code" ){
        //       header line, don't process
        }else{
            let entry = this.entryFromValueArray(values)
            let scanCode = entry.scanCode
            if(scanCode && !this.processedValues[scanCode])
            {   
                //There is a scancode and we haven't processed it yet
                this.processedValues[scanCode] = entry
            }else{
                //This shouldn't happend unless there are duplicate values or no scan code
                this.invalidLines.push(line)
                this.invalidEntries.push(entry)
            }
        }
     }

     entryFromValueArray = function (valueArray){
        //Based off of expected Values as outlined in 
        // Data/Inputs/README.md
        let entry = {}
    
        entry.scanCode = valueArray[0].trim()
        entry.brand = valueArray[1].trim()
        entry.name = valueArray[2].trim()
        entry.size = valueArray[3].trim()
        entry.receiptAlias = valueArray[4].trim()
        entry.invDiscontinued = valueArray[5].trim()
        entry.subdepartment = valueArray[6].trim()
        entry.storeNumber = valueArray[7].trim()
        entry.department = valueArray[8].trim()
        entry.supplierUnitID = valueArray[9].trim()
        entry.basePrice = valueArray[10].trim()
        entry.quantity = valueArray[11].trim()
        entry.lastCost = valueArray[12].trim()
        entry.averageCost = valueArray[13].trim()
        entry.idealMargin = valueArray[14].trim()
        entry.defaultSupplier = valueArray[15].trim()
        entry.unit = valueArray[16].trim()
        entry.southLastSoldDate = valueArray[17].trim()
    
        //All values as array as received
        entry.valuesArray = valueArray
    
        return entry
    }
}

export default InventoryTextImporter