//TextImporter for UNFI Pricebook file
//Import TextImporter Class
import TextImporter from './TextImporter.js'

class PricebookTextImporter extends TextImporter{
    //Set Path Of Pricebook File
    textFilePath = "./Data/Inputs/pb003116.txt"
    //Create empty Object for storing processed Values
    processedValues = {}
   
    constructor(){
    //call TextImporter Parent Constructor
       super();
    }
    
    processLine(line){
      let values = line.split("\t")
      //Split lines into an array of values
      if(this.lineCount == 1 && values[0] == "Dept" ){
      //    header line, don't process
     }else{
      let entry = this.entryFromValueArray(values)
      let UPC = entry.UPC
      if(UPC && !this.processedValues[UPC])
      {
         //There is a UPC and we haven't processed it yet
          this.processedValues[UPC] = entry
      }else{
         //This shouldn't happend unless there are duplicate values or no UPC code
         this.invalidLines.push(line)
         this.invalidEntries.push(entry)
      }
     }
     }
     
     getEntryFromUPC(UPC){
      //convenience function for getting entry from UPC
        return this.processedValues[UPC]
     }
     entryFromValueArray = function (valueArray){
      //Based off of expected Values of UNFI Pricebook file
      
        let entry = {}
        entry.department = valueArray[0]
        entry.brand = valueArray[1]
        entry.supplierID = valueArray[2]
        entry.size = valueArray[3]
        entry.flag1 = valueArray[4]
        entry.flag2 = valueArray[5]
        entry.flag3 = valueArray[6]
        entry.description = valueArray[7]
        entry.eachPrice = valueArray[8]
        entry.casePrice = valueArray[9]
        entry.UPC = String(valueArray[10]).replace(/-/g, "")
        entry.weight = valueArray[11]
        entry.flag4 = valueArray[12]
        entry.taxable = valueArray[13]
        entry.MSRP = valueArray[14]
        entry.SRP = valueArray[15]
        entry.margin = valueArray[16]
    
        entry.valuesArray = valueArray
    
        return entry
    }
   
}

export default PricebookTextImporter