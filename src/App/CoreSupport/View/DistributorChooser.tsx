import { useAppSelector } from "../../Main/View/hooks";
import {
  selectAvailableDistributors,
  selectSelectedDistributors,
} from "./CoreSetSlice";
import { CheckboxList } from "App/UI/CheckboxList";
import "./resources/css/distributor-checkbox.css";
export function DistributorChooser() {
  const availableDistributors = useAppSelector(selectAvailableDistributors);
  const selectedDistributors = useAppSelector(selectSelectedDistributors);
  return (
    <>
      <CheckboxList
        items={availableDistributors}
        toggledItems={selectedDistributors}
        onCheckboxChange={(toggledItems: Array<string>) => {
          setCoreSetDistributors(toggledItems);
        }}
      />
    </>
  );
}

export function setCoreSetDistributors(distributors: Array<string>) {
  window.coreSets.ipcRenderer.sendMessage(
    "setCoreSetsDistributors",
    distributors
  );
}
