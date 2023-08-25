
import { start } from "./addDrop/addDrop"


start()
  .then(() => {
    console.log("Checking Add Drop");
   

  })
  .catch((error: { message: any; }) => {
    console.error(error.message);
  });

