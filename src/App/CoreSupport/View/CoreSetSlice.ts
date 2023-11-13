import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../View/store";
import {
  CoreSupportPriceListEntry,
  CoreSupportReportEntry
} from "electron/CoreSupport/shared";

// Define a type for the slice state
interface CoreSetsState {
  status: string;
  filePath: string;
  errorMessage: string;
  allEntries: Array<CoreSupportPriceListEntry>;
  selectedDistributorEntries: Array<CoreSupportPriceListEntry>;
  selectedItemsInInventoryEntries: Array<CoreSupportPriceListEntry>;
  reportEntries: Array<CoreSupportReportEntry>;
  availableDistributors: Array<string>;
  selectedDistributors: Array<string>;
}

// Define the initial state using that type
const initialState: CoreSetsState = {
  status: "",
  filePath: "",
  errorMessage: "",
  allEntries: [],
  selectedDistributorEntries: [],
  selectedItemsInInventoryEntries: [],
  reportEntries: [],
  availableDistributors: [],
  selectedDistributors: []
};

export const coreSetSlice = createSlice({
  name: "CoreSets",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setFilePath: (state, action: PayloadAction<string>) => {
      state.filePath = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setAllEntries: (
      state,
      action: PayloadAction<Array<CoreSupportPriceListEntry>>
    ) => {
      state.allEntries = action.payload;
    },

    setSelectedDistributorEntries: (
      state,
      action: PayloadAction<Array<CoreSupportPriceListEntry>>
    ) => {
      state.selectedDistributorEntries = action.payload;
    },
    setReportEntries: (
      state,
      action: PayloadAction<Array<CoreSupportReportEntry>>
    ) => {
      state.reportEntries = action.payload;
    },
    setAvailableDistributors: (state, action: PayloadAction<Array<string>>) => {
      state.availableDistributors = action.payload;
    },
    setSelectedDistributors: (state, action: PayloadAction<Array<string>>) => {
      state.selectedDistributors = action.payload;
    }
  }
});

export const {
  setStatus,
  setFilePath,
  setErrorMessage,
  setAllEntries,
  setSelectedDistributorEntries,
  setReportEntries,
  setAvailableDistributors,
  setSelectedDistributors
} = coreSetSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAllEntries = (state: RootState) => state.CoreSets.allEntries;

export const selectSelectedDistributorEntries = (state: RootState) =>
  state.CoreSets.selectedDistributorEntries;

export const selectSelectedItemsInInventoryEntries = (state: RootState) =>
  state.CoreSets.selectedItemsInInventoryEntries;

export const selectReportEntries = (state: RootState) =>
  state.CoreSets.reportEntries;

export const selectAvailableDistributors = (state: RootState) =>
  state.CoreSets.availableDistributors;

export const selectSelectedDistributors = (state: RootState) =>
  state.CoreSets.selectedDistributors;

export default coreSetSlice.reducer;
