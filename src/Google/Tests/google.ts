import {Google} from '../google'

const loadedSubject = Google.getLoaded()

const loadedSubscription =  loadedSubject.subscribe((loaded : string[]) => {
console.log(loaded)

const googleInstance = Google.getInstanceFor(loaded[0])
})


setTimeout(() => {
    console.log("leaving")
   
  }, 4000);