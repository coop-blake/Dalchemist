import { store } from "../../View/store";
import { useAppSelector } from "../../View/hooks";
import {
  selectAvailableDistributors,
  selectSelectedDistributors,
} from "./CoreSetSlice";

export function DistributorChooser() {
    const availableDistributors = useAppSelector(selectAvailableDistributors); 
    const selectedDistributors = useAppSelector(selectSelectedDistributors);
     return (<>
     {availableDistributors.join(", ")}<br/>
     {selectedDistributors.join(",")}
    </>)
}