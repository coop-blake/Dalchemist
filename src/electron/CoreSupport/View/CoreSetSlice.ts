import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../View/store";
import {
  CoreSupportEntry,
  CoreSupportReportEntry,
} from "electron/CoreSupport/shared";

// Define a type for the slice state
interface CoreSetsState {
  status: string;
  filePath: string;
  errorMessage: string;
  availableItems: Array<CoreSupportEntry>;
  ourItems: Array<CoreSupportEntry>;
  reportEntries: Array<CoreSupportReportEntry>;
}

// Define the initial state using that type
const initialState: CoreSetsState = {
  status: "",
  filePath: "",
  errorMessage: "",
  availableItems: [],
  ourItems: [],
  reportEntries: [],
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
    setAvailableItems: (
      state,
      action: PayloadAction<Array<CoreSupportEntry>>
    ) => {
      state.availableItems = action.payload;
    },
    setReportEntries: (
      state,
      action: PayloadAction<Array<CoreSupportReportEntry>>
    ) => {
      state.reportEntries = action.payload;
    },
  },
});

export const {
  setStatus,
  setFilePath,
  setErrorMessage,
  setAvailableItems,
  setReportEntries,
} = coreSetSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAvailableItems = (state: RootState) =>
  state.CoreSets.availableItems;

export const selectReportEntries = (state: RootState) =>
  state.CoreSets.reportEntries;

export default coreSetSlice.reducer;
