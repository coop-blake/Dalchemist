//React
import { useEffect } from "react";
// State
import { Provider } from "react-redux";
import { store } from "./store";
// HTML and CSS
const MainView = React.lazy(() => import("./Main"));

const CoreSetsView = React.lazy(
  () => import("../../CoreSupport/View/CoreSets")
);

const InventoryView = React.lazy(
  () => import("../../Inventory/View/Inventory")
);

const AddDropView = React.lazy(() => import("../../AddDrop/View/AddDrop"));
import React from "react";

//App
export default function App(props: { onLoad: () => void }) {
  const windowHash = window.location.hash ?? "";
  useEffect(() => {
    props.onLoad();
  }, [props.onLoad]);
  return (
    <Provider store={store}>
      {windowHash.startsWith("#/CoreSets") ? (
        <CoreSetsView />
      ) : windowHash.startsWith("#/Inventory") ? (
        <InventoryView />
      ) : windowHash.startsWith("#/AddDrop") ? (
        <AddDropView />
      ) : (
        <MainView />
      )}
    </Provider>
  );
}
