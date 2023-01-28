import process from 'node:process';

import InventoryTextImporter from '../TextImporters/Inventory.js' 
import PriceChangeWorksheetsImporter from '../TextImporters/PriceChangeWorksheets.js'


class PriceChangeWorksheetInventoryComparison {
    InventoryImport = new InventoryTextImporter()
    PriceChangeWorksheetsImporter = new PriceChangeWorksheetsImporter()
   
    worksheetsByName = {}

    items = {}
    itemsOnMultipleSheets = {}
    itemsWithDifferentSalePrices = {}
    itemsWithHigherSalePrices = {}
    itemsWithSameSalePrices = {}
    


     async initialize(){
       //load data into importers
        await this.PriceChangeWorksheetsImporter.initialize()
        await this.InventoryImport.start()
        
        //cycle through each price change worksheet
        this.PriceChangeWorksheetsImporter.forEachWorksheet((worksheet) => {
            this.worksheetsByName[worksheet.textFilePath] = worksheet

                worksheet.forEachEntry((entry) => {
                 //   console.log(entry)
                    let item = {}

                    if(this.items[entry.scanCode.toString()]){
                        //already processed this item from other worksheet
                        item = this.items[entry.scanCode.toString()]
                    }else{      
                         //first time we have proccessed this item, create empty worksheetEntries     
                        item.worksheetEntries = {}     
                        //add inventory entry to item  
                        item.inventoryEntry = this.InventoryImport.getEntryFromScanCode( entry.scanCode)
                        if(!item.inventoryEntry){
                            console.log("🌋🌋🌋🌋🌋Shouldn't happen!")
                        }
                   
                    }
                    //add worksheet name to entry
                    entry.worksheetName = worksheet.textFilePath.split(`/`).pop();

        
                    //check worksheet against base Price
                    if (parseFloat(item.inventoryEntry.basePrice) == parseFloat(entry.modifiedPrice)){
                        entry.salePriceVsBasePrice = "same"
                        this.itemsWithSameSalePrices[entry.scanCode.toString()] = entry.scanCode.toString()
                    }
                    if (parseFloat(item.inventoryEntry.basePrice) < parseFloat(entry.modifiedPrice)){
                            entry.salePriceVsBasePrice = "higher"
                            this.itemsWithHigherSalePrices[entry.scanCode.toString()] = entry.scanCode.toString()
                    }
                  
                    //add worksheet entry to item worksheetEntries
                    item.worksheetEntries[worksheet.textFilePath] = entry
                    //add item to items
                    this.items[entry.scanCode.toString()] = item

                    //if more then one worksheet entry, check price consitency
                    if(Object.keys(item.worksheetEntries).length >1)
                    {
                        //add to itemsOnMultipleSheets Object
                        this.itemsOnMultipleSheets[entry.scanCode.toString()] = entry.scanCode.toString()
                    
                        //map worksheet entries and check prices on all worksheets match
                        let worksheetConsitencyCheck =  this.areMultipleWorksheetPricesConsitent( Object.entries(item.worksheetEntries).map(worksheetEntry => {
                            return worksheetEntry[1]
                        }))
                        //if prices don't match, add to itemsWithDifferentSalePrices
                            if(!worksheetConsitencyCheck){
                                this.itemsWithDifferentSalePrices[entry.scanCode.toString()] = entry.scanCode.toString()
                            }
                        }
                    })
        })
       
     }

areMultipleWorksheetPricesConsitent(worksheetEntries)
{
    //Function checks worksheetEntries array for price consistency
    //returns true or false
    let lastPrice = null
    let isConsitent = true
    worksheetEntries.forEach( entry =>{
        if(lastPrice === null || parseFloat(lastPrice) == parseFloat(entry.modifiedPrice)){
            lastPrice =  entry.modifiedPrice
        }else{
            isConsitent =  false
        }
    })
    return isConsitent
}


getTextInventoryDescriptionAndPrices(items){
    let returnText = "" 
    Object.keys(items).forEach(item => {
        returnText += `     ${this.items[item].inventoryEntry.brand} ${this.items[item].inventoryEntry.name}  ${this.items[item].inventoryEntry.size}\n`
        returnText += `     ${this.items[item].inventoryEntry.basePrice} Base Price \n`
            Object.entries(this.items[item].worksheetEntries).forEach(worksheetEntryObject =>{
             let   worksheetEntry = worksheetEntryObject[1]
             returnText += `     ${worksheetEntry.modifiedPrice} ${worksheetEntry.worksheetName} \n`
            })
   })
   return returnText
}

getOutput(){
//Start with blank output
let outputText = ""

//Check args and include output based on user input
if (process.argv.includes("--show-multiple-worksheet-items")){
    outputText += `👻Multiple Worksheet items👻\n`
    outputText += this.getTextInventoryDescriptionAndPrices(this.itemsOnMultipleSheets)
}

if (process.argv.includes("--show-same-priced-items")){
    outputText += `👻 Same priced Items 👻\n`
    outputText += this.getTextInventoryDescriptionAndPrices(this.itemsWithSameSalePrices)
}

if (!process.argv.includes("--hide-higher-priced-items")){
    outputText += `🙃Higher Priced Sale Items🙃\n`
    outputText += this.getTextInventoryDescriptionAndPrices(this.itemsWithHigherSalePrices)
}

if (!process.argv.includes("--hide-items-with-inconsitent-worksheets")){
    outputText += `🧨Different Sale Prices🧨 \n`
    outputText += this.getTextInventoryDescriptionAndPrices(this.itemsWithDifferentSalePrices)
}
  
if(outputText == "")
{
    outputText += `No Output shown:
     Accepted Arguments:
    --show-multiple-worksheet-items
    --show-same-priced-items
    --hide-higher-priced-items
    --hide-items-with-inconsitent-worksheets
    `
}

return outputText

}

}


export default PriceChangeWorksheetInventoryComparison
