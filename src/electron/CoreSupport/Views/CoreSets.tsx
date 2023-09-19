import React , {useState}  from "react"
import {CoreSupportEntry} from "../shared"

interface CoreSetsViewProps {
    coreSetItems: Array<CoreSupportEntry>; // Adjust the type according to your state
  }

export  function CoreSetsView (props: CoreSetsViewProps){

    const [coreSetItems, setCoreSetItems] = useState<Array<CoreSupportEntry>>([]);

    console.log(props)
    return (
    <div>Core Supports yeah
        
    </div>
    )

}
