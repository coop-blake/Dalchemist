import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../Main/View/store";
import {
  AddDropStatus,
  NewItemEntry,
  AttributeChangeEntry,
} from "../../../Google/addDrop/shared";

import {
  SupplierIDEntry,
  InventoryEntry,
} from "../../../Google/Inventory/shared";

import { NewItemInInventory } from "./shared";

// Define a type for the slice state
interface AddDropState {
  status: AddDropStatus;
  NewItems: Array<NewItemEntry>;
  AttributeChanges: Array<AttributeChangeEntry>;
  lastRefresh: number;
  newItemsInInventory: Array<NewItemInInventory>;
  itemsAlreadyInInventoryWithSupplierID: Array<
    [NewItemEntry, SupplierIDEntry, InventoryEntry]
  >;
  priceUpdates: Array<AttributeChangeEntry>;
}

// Define the initial state using that type
const initialState: AddDropState = {
  status: AddDropStatus.Starting,
  NewItems: [],
  AttributeChanges: [],
  lastRefresh: 0,
  newItemsInInventory: [],
  itemsAlreadyInInventoryWithSupplierID: [],
  priceUpdates: [],
};

export const addDropSlice = createSlice({
  name: "AddDrop",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<AddDropStatus>) => {
      state.status = action.payload;
      console.log(state.status);
    },
    setNewItems: (state, action: PayloadAction<Array<NewItemEntry>>) => {
      state.NewItems = action.payload;
    },
    setAttributeChanges: (
      state,
      action: PayloadAction<Array<AttributeChangeEntry>>
    ) => {
      state.AttributeChanges = action.payload;
    },
    setLastRefresh: (state, action: PayloadAction<number>) => {
      state.lastRefresh = action.payload;
      console.log(state.status);
    },
    setNewItemsInInventory: (
      state,
      action: PayloadAction<Array<NewItemInInventory>>
    ) => {
      state.newItemsInInventory = action.payload;
    },
    setItemsAlreadyInInventoryWithSupplierID: (
      state,
      action: PayloadAction<
        Array<[NewItemEntry, SupplierIDEntry, InventoryEntry]>
      >
    ) => {
      state.itemsAlreadyInInventoryWithSupplierID = action.payload;
    },
    setPriceUpdates: (
      state,
      action: PayloadAction<Array<AttributeChangeEntry>>
    ) => {
      state.priceUpdates = action.payload;
    },
  },
});

export const {
  setStatus,
  setNewItems,
  setAttributeChanges,
  setLastRefresh,
  setNewItemsInInventory,
  setItemsAlreadyInInventoryWithSupplierID,
  setPriceUpdates,
} = addDropSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectStatus = (state: RootState) => state.AddDrop.status;

export const selectNewItems = (state: RootState) => state.AddDrop.NewItems;

export const selectLastRefresh = (state: RootState) =>
  state.AddDrop.lastRefresh;

export const selectNewItemsInInventory = (state: RootState) =>
  state.AddDrop.newItemsInInventory;

export const selectNewItemsInInventoryWithSupplierID = (state: RootState) =>
  state.AddDrop.itemsAlreadyInInventoryWithSupplierID;

export const selectPriceUpdates = (state: RootState) =>
  state.AddDrop.priceUpdates;

export const selectAttributeChanges = (state: RootState) =>
  state.AddDrop.AttributeChanges;

export default addDropSlice.reducer;
