import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../Main/View/store";
import {
  InventoryStatus,
  InventoryEntry,
} from "../../../Google/Inventory/shared";

// Define a type for the slice state
interface InventoryState {
  status: InventoryStatus;
  items: Array<InventoryEntry>;
}

// Define the initial state using that type
const initialState: InventoryState = {
  status: InventoryStatus.Starting,
  items: [],
};

export const inventorySlice = createSlice({
  name: "Inventory",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<InventoryStatus>) => {
      state.status = action.payload;
      console.log(state.status);
    },
    setItems: (state, action: PayloadAction<Array<InventoryEntry>>) => {
      state.items = action.payload;
    },
  },
});

export const { setStatus, setItems } = inventorySlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectItems = (state: RootState) => state.Inventory.items;

export default inventorySlice.reducer;
