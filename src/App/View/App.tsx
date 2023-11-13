//React
import { useEffect } from "react";
// State
import { Provider } from "react-redux";
import { store } from "./store";
// HTML and CSS
import MainView from "./Main";
import CoreSetsView from "../CoreSupport/View/CoreSets";
import InventoryView from "../Inventory/View/Inventory";
import AddDropView from "../AddDrop/View/AddDrop";
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