import { Google } from "../../Google/google";

export async function testGoogle(sheetID: string): Promise<boolean> {
  return new Promise(async (resolve) => {
    const loadedSubject = Google.getLoaded();

    const timeoutId = setTimeout(() => {
      console.log("Could not load API");
      resolve(false);
    }, 4000);

    loadedSubject.subscribe(async (loaded: string[]) => {
      clearTimeout(timeoutId);

      const googleInstance = Google.getInstanceFor(loaded[0]);
      // test googleInstance for sheets and drive
      if (googleInstance.getSheets() && googleInstance.getDrive()) {
        console.log("Testing Sheet ID: ", sheetID);

        try {
          const sheetRead = await googleInstance
            .getSheets()
            .spreadsheets.values.get({
              spreadsheetId: sheetID,
              range: "A1:A1",
            });

          console.log(
            "Sheet Data: ",
            sheetRead.data.values ? sheetRead.data.values[0] : "No Data"
          );
          resolve(true);
        } catch (e) {
          console.log("Error: ");
          resolve(false);
        }
      } else {
        console.log("Could not load API");
        resolve(false);
      }
    });
  });
}
