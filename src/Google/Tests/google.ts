import { Google } from "../google";

const loadedSubject = Google.getLoaded();

loadedSubject.subscribe((loaded: string[]) => {
  console.log(loaded);
  const googleInstance = Google.getInstanceFor(loaded[0]);
  //test googleInstance for sheets and drive
  console.log(googleInstance.getSheets());
});

setTimeout(() => {
  console.log("leaving");
}, 4000);
