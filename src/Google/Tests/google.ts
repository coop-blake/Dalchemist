import {Google} from '../google'

const loadedSubject = Google.getLoaded()

loadedSubject.subscribe((loaded : string[]) => {
console.log(loaded)

 Google.getInstanceFor(loaded[0])
})


setTimeout(() => {
    console.log("leaving")
   
  }, 4000);