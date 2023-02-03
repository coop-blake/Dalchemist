// Importer for price change worksheets
// creates TextImport for each worksheet in input directory
// Loads each data line of worksheet as an entry
import TextImporter from './TextImporter.js'
import * as fs from 'node:fs/promises';

class PriceChangeWorksheets {
    //Set the path to the Price Change Worksheets Input Directory
    worksheetsDirectory = "./Data/Inputs/Price Change Worksheets/"
    //Create empty array of worksheets
    priceChangeWorksheets = []
   
    async initialize(){
        //Load all worksheets
        await this.loadWorksheets()
    }

    async loadWorksheets(){
        //Cycle through Price Change Worksheets Directory 
        //and attempt to load each file found as a price change worksheet
            try{
                const worksheetFiles = await fs.readdir(this.worksheetsDirectory)
                for( const worksheetFile of worksheetFiles ){
                    await this.loadWorksheet(worksheetFile)
                }
            } catch (error){
                console.log(error)
            }
    }

    async loadWorksheet(fileName){
        // Create new text import for worksheet 
        let newWorksheetImporter = new TextImporter()
        //Set Filename and textFilePath
        newWorksheetImporter.fileName = fileName
        newWorksheetImporter.textFilePath = this.worksheetsDirectory+fileName
        //Set processLine and entryFromValueArray functions to this class's versions
        newWorksheetImporter.processLine = this.processLine
        newWorksheetImporter.entryFromValueArray = this.entryFromValueArray
        //Create empty processedValues Object
        newWorksheetImporter.processedValues = {}
        //Start reading and processing the file
        await newWorksheetImporter.start()
        //Add the worksheet to the array
        this.priceChangeWorksheets.push(newWorksheetImporter)
    }
    

    forEachWorksheet(forEachFunction){
        //convienince function for executing a function on each worksheet
        this.priceChangeWorksheets.forEach(priceChangeWorksheet => {
            forEachFunction(priceChangeWorksheet)
        })
    }
   
    processLine(line){
        switch(this.lineCount)
        {
            case 1:
                //First line
                if(line.trim() != "Price Change"){
                    throw(`First line of worksheet not expected: ${line}`)
                }
                break;
            case 2:
                //second line
                if(line.trim() != "[WORKSHEETINFO]"){
                    throw(`Second line of worksheet not expected: ${line}`)
                }
                break;
            case 3:{
                //third line
                let values = line.split("\t")
                this.worksheetStartDate = new Date(values[1])
                this.worksheetEndDate = new Date(values[2])
                }
                break;
            case 4:
                //fourth line
                if(line.trim() != "[Records]"){
                    throw(`Fourth line of worksheet not expected: ${line}`)
                }
                break;
            default:
                //Past header lines, proccess values
                {
                    let values = line.split("\t")
                    let entry = this.entryFromValueArray(values)
                    this.processedValues[entry.scanCode] = entry
                }
        }
       
  
     }

     entryFromValueArray = function (valueArray){
        //Creates an entry from the value array
         let entry = {}

         entry.scanCode = valueArray[0].trim()
         entry.receiptAlias = valueArray[1] && valueArray[1].trim() ? valueArray[1].trim() : "NO ALIAS!"
         entry.modifiedPrice = valueArray[6] && valueArray[6].trim()? parseFloat(valueArray[6].trim()).toFixed(2) : 0
       
        if (entry.receiptAlias == "NO ALIAS!"){
            console.log("NO ALIAS! \n")
        }

        return entry
    }
  
}

export default PriceChangeWorksheets