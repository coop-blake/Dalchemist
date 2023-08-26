import { Inventory, InventoryState, InventoryStatus } from "../Inventory/Inventory";


// const app = electron.app;
// const BrowserWindow = electron.BrowserWindow
const inventoryInstance = Inventory.getInstance();

const statusSubscription = Inventory.state.status$.subscribe((status: InventoryStatus) => {
  console.log(`Inventory status changed: ${status}`);
});


const lastRefreshCompletedSubscription = Inventory.state.lastRefreshCompleted$.subscribe((lastRefreshCompleted: number) => {

    if(lastRefreshCompleted === 0)
    {

    }else{
        const lastRefreshDate = new Date(lastRefreshCompleted);
        const formattedDate = lastRefreshDate.toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        console.log(`Inventory Updated changed: ${formattedDate}`);
    
        let entry = inventoryInstance.getEntryFromScanCode("1551")
        if(entry !== undefined)
        {
            console.log(`Scancoded: 1551 ${entry.Name}`);

        }
    }
    
  });


  setTimeout(() => {
    console.log("leaving")
   
  }, 2000);
