import {NewItemEntry, AttributeChangeEntry} from "./addDrop"
import InventoryImporter , { InventoryEntry } from "../../TextImporters/Inventory";


export function getIndex(newItems : [NewItemEntry],
  itemsAlreadyInInventory : [[NewItemEntry, InventoryEntry]], 
  attributeChangeItems : [AttributeChangeEntry],
  priceUpdates:  [AttributeChangeEntry])
{
  const returnString =`
  ${getStyle()}
  <div class="mainAddDrop">
  <div class="newItems">
  <h1>New Items</h1>
  ${
    newItems?.length
      ? ` New Item Entries:  <a href="/newItems"> ${newItems?.length}</a>
      ${
        itemsAlreadyInInventory?.length
          ? `itemsAlreadyInInventory:  <a href="/itemsAlreadyInInventory">${itemsAlreadyInInventory?.length} Link</a>`
          : `✅ No Items with ScanIDs already in inventory`
      }`
      : `✅ New Items Cleared`
  }
  </div>
  <div class="attributeChanges">
  <h1>Price & Attribute Changes</h1>
  ${attributeChangeItems?.length ? `  Attribute Change Entries: ${attributeChangeItems?.length} 
      
  <a href="/priceUpdateInfo"> Price Changes: ${priceUpdates?.length} </a>` : `✅ Price & Attribute Changes Cleared`}
    </div>
      </div>
  
`
return returnString
}

export function getNewItemsReport(newItems : [NewItemEntry]) {
  return `
  ${getStyle()}

<div style="display: block;  border: solid white 5px;">
${newItems
  ?.map(
    (newItem: NewItemEntry) => `
    <div class="from" > From: ${newItem.Client} on ${newItem.Date} </div>

    <div class="description">Item: ${newItem.ScanCode} 
    ${newItem.Brand} ${newItem.Name}  ${newItem.Unit} </div>

    <div class="department" >Department: 
    ${newItem.Department}:${newItem.SubDepartment} </div>

    <div class="buying">Buying: 
    ${newItem.Supplier} ${newItem.SupplierItemID}  ${newItem.Quantity} ${newItem.CaseCost}</div>

    <div class="pricing"> Pricing:
    Margin:${newItem.MARGIN} Shipping:${newItem.ShippingPercent} 
    Proposed Price:${newItem.ProposedPrice} 
    Unit Cost:${newItem.UnitCost} Base Price:${newItem.BasePrice}</div>
   
    <div class="attributes">Attributes:
    Bottle:${newItem.BottleDepositFlag} 
    Local Direct:${newItem.LocalDirectFlag} Local 6:${newItem.LocalSixFlag} 
    Local Oregon:${newItem.LocalORFlag} 
    Organic:${newItem.OGFlag} 
    Flip Chart Add:${newItem.FlipChartAddFlag} </div>
    
    <div class="comments">Comments:
    ${newItem.Comments}  </div>
      `
  )
  .join("\n")}
      
  </div>
  `;
}

export function getItemsAlreadyInInventoryReport(itemsAlreadyInInventory: [[NewItemEntry, InventoryEntry]]) {
  return `
  ${getStyle()}

     <table>
         
        
         ${itemsAlreadyInInventory
           ?.map(
             ([newItem, inventoryItem]) => `
         <tr style=" height: 10px;">
         <td  style=" height: 10px;" colspan=2></td><td style=" height: 10px;" colspan=2></td>
         </tr>
         <tr>
             <td colspan=2>New Item:</td>
             <td colspan=2>Inventory:</td>
         </tr>
         <tr style=" height: 10px;">
         <td  style=" height: 10px;" colspan=2></td><td style=" height: 10px;" colspan=2></td>
         </tr>
             <tr>
                 <td>Scan Code</td><td>${newItem.ScanCode}</td><td>Brand</td><td>${inventoryItem.brand}</td>
             </tr>
             <tr>
                 <td>Name</td><td>${newItem.Name}</td><td>Size</td><td>${inventoryItem.size}</td>
             </tr>
             <tr>
                 <td>Client</td><td>${newItem.Client}</td><td>Receipt Alias</td><td>${inventoryItem.receiptAlias}</td>
             </tr>
             <tr>
                 <td>Supplier</td><td>${newItem.Supplier}</td><td>Ideal Margin</td><td>${inventoryItem.idealMargin}</td>
             </tr>
             <tr>
                 <td>Supplier Item ID</td><td>${newItem.SupplierItemID}</td><td>Subdepartment</td><td>${inventoryItem.subdepartment}</td>
             </tr>
             <tr>
                 <td>Brand</td><td>${newItem.Brand}</td><td>Store Number</td><td>${inventoryItem.storeNumber}</td>
             </tr>
             <tr>
                 <td>Unit</td><td>${newItem.Unit}</td><td>Department</td><td>${inventoryItem.department}</td>
             </tr>
             <tr>
                 <td>Subdepartment</td><td>${newItem.SubDepartment}</td><td>Supplier Unit ID</td><td>${inventoryItem.supplierUnitID}</td>
             </tr>
             <tr>
                 <td>Quantity</td><td>${newItem.Quantity}</td><td>Base Price</td><td>${inventoryItem.basePrice}</td>
             </tr>
             <tr>
                 <td>Case Cost</td><td>${newItem.CaseCost}</td><td>Quantity</td><td>${inventoryItem.quantity}</td>
             </tr>
             <tr>
                 <td>Unit Cost</td><td>${newItem.UnitCost}</td><td>Last Cost</td><td>${inventoryItem.lastCost}</td>
             </tr>
             <tr>
                 <td>Margin</td><td>${newItem.MARGIN}</td><td>Average Cost</td><td>${inventoryItem.averageCost}</td>
             </tr>
             <tr>
                 <td>Shipping Percent</td><td>${newItem.ShippingPercent}</td><td></td><td></td>
             </tr>
             <tr>
                 <td>Proposed Price</td><td>${newItem.ProposedPrice}</td><td>Default Supplier</td><td>${inventoryItem.defaultSupplier}</td>
             </tr>
             <tr>
                 <td>Base Price</td><td>${newItem.BasePrice}</td><td>Unit</td><td>${inventoryItem.unit}</td>
             </tr>
             <tr>
                 <td>Department</td><td>${newItem.Department}</td><td>Last Sold Date</td><td>${inventoryItem.southLastSoldDate}</td>
             </tr>
             <tr>
                 <td>Bottle Deposit Flag</td><td>${newItem.BottleDepositFlag}</td><td></td><td></td>
             </tr>
             <tr>
                 <td>Local Direct Flag</td><td>${newItem.LocalDirectFlag}</td><td></td><td></td>
             </tr>
             <tr>
                 <td>Local Six Flag</td><td>${newItem.LocalSixFlag}</td><td></td><td></td>
             </tr>
             <tr>
                 <td>Local OR Flag</td><td>${newItem.LocalORFlag}</td><td></td><td></td>
             </tr>
             <tr>
                 <td>OG Flag</td><td>${newItem.OGFlag}</td><td></td><td></td>
             </tr>
             <tr>
                 <td>Flip Chart Add Flag</td><td>${newItem.FlipChartAddFlag}</td><td></td><td></td>
             </tr>
             <tr>
                 <td>Comments</td><td>${newItem.Comments}</td><td></td><td></td>
             </tr>
         `
           )
           .join("\n")}
     </table>
 
 
 
 
 
 `;
}

export function getPriceUpdatesInfo(priceUpdates : [AttributeChangeEntry], inventory : InventoryImporter) {
  const returnString = `
  ${getStyle()}
     <table>
         
        
         ${priceUpdates
           ?.map((attributeUpdateEntry) => {
             const inventoryItem = inventory.getEntryFromScanCode(
               attributeUpdateEntry.ScanCode
             );
             const returnString = `
         <tr style=" height: 10px;">
         <td  style=" height: 10px;" colspan=2></td>
         <td style=" height: 10px;" colspan=2></td>
         </tr>
         <tr>
             <td colspan=2>Price Change Request: ${
               attributeUpdateEntry.ScanCode
             }</td>
             <td colspan=2>Inventory: ${
               inventoryItem?.brand ? inventoryItem?.brand : "N/A"
             } ${inventoryItem?.name ? inventoryItem?.name : "N/A"} ${
               inventoryItem?.size ? inventoryItem?.size : "N/A"
             }</td>
         </tr>
         <tr style=" height: 10px;">
         <td  style=" height: 10px;" colspan=2></td><td style=" height: 10px;" colspan=2></td>
         </tr>
             <tr>
                 <td>Requested By:</td><td>${
                   attributeUpdateEntry.Client
                 }</td><td>Brand</td><td>${
                   inventoryItem?.brand ? inventoryItem?.brand : "N/A"
                 }</td>
             </tr>
             <tr>
                 <td>Base Price Entered:</td><td>${
                   attributeUpdateEntry.BasePrice
                 }</td><td>Base PRice</td><td>${
                   inventoryItem?.basePrice ? inventoryItem?.basePrice : "N/A"
                 }</td>
             </tr>
             <tr>
                <td>Unit Cost Entered:</td><td>${
                  attributeUpdateEntry.UnitCost
                }</td><td>Last Cost</td><td>${
                  inventoryItem?.lastCost ? inventoryItem?.lastCost : "N/A"
                }</td>
            </tr>
            <tr>
                <td>Case Cost Entered:</td><td>${
                  attributeUpdateEntry.CaseCost
                }</td><td>Case Cost </td><td>${
                  inventoryItem?.lastCost && inventoryItem?.quantity
                    ? parseFloat(inventoryItem?.lastCost) *
                      parseFloat(inventoryItem?.quantity)
                    : "N/A"
                }</td>
            </tr>
         `;
             return returnString;
           })
           .join("\n")}
     </table>
 <a href="addDropPriceChanges.txt">Get TSV 📊 </a>
 
 
 
 
 `;

  return returnString;
}

export function getStyle() {
  const returnString = `
     <style>
          body {
            background: rgb(208, 185, 185);
            font-family: 'Arial', sans-serif;
            color: black;
          }
          div {
            padding: 5px;
            margin: 5px;
          }
         .mainAddDrop{
          
         }    

         .newItems {
          
         }

         .attributeChanges{
          
         }
         a {
          text-decoration: none;
   }
     </style>
 `;

  return returnString;
}


export function getAddDropPriceUpdatesTSV(priceUpdates : [AttributeChangeEntry]){
  const header = ['Scan Code', 'Base Price', 'Cost'].join('\t');

  // Convert the price updates into TSV rows
  const rows = priceUpdates.map(entry => {
    const scanCode = entry.ScanCode;
    const basePrice = entry.BasePrice;
    const cost = entry.UnitCost;

    return [scanCode, basePrice, cost].join('\t');
  });

  // Combine header and rows
  const tsvContent = [header, ...rows].join('\n');

  return tsvContent;
}