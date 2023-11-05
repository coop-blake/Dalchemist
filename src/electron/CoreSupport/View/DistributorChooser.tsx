import { store } from "../../View/store";
import { useAppSelector } from "../../View/hooks";
import {
  selectAvailableDistributors,
  selectSelectedDistributors,
} from "./CoreSetSlice";
import { CheckboxList } from "electron/UI/CheckboxList";

export function DistributorChooser() {
  const availableDistributors = useAppSelector(selectAvailableDistributors);
  const selectedDistributors = useAppSelector(selectSelectedDistributors);
  return (
    <>
      {availableDistributors.join(", ")}
      <br />
      {selectedDistributors.join(",")}
      <div
        onClick={() => {
          setCoreSetDistributors(["foo", "bar"]);
        }}
        style={{ border: "1px solid black", width: "100px", height: "100px" }}
      >
        Click me
      </div>

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
  window.electron.ipcRenderer.sendMessage(
    "setCoreSetsDistributors",
    distributors
  );
}
