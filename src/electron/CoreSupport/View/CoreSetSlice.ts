import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../View/store";
import { CoreSupportEntry } from "electron/CoreSupport/shared";

// Define a type for the slice state
interface CoreSetsState {
  status: string;
  filePath: string;
  errorMessage: string;
  availableItems: Array<CoreSupportEntry>;
  ourItems: Array<CoreSupportEntry>;
}

// Define the initial state using that type
const initialState: CoreSetsState = {
  status: "",
  filePath: "",
  errorMessage: "",
  availableItems: [],
  ourItems: []
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
    setOurItems: (state, action: PayloadAction<Array<CoreSupportEntry>>) => {
      state.ourItems = action.payload;
    }
  }
});

export const {
  setStatus,
  setFilePath,
  setErrorMessage,
  setAvailableItems,
  setOurItems
} = coreSetSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAvailableItems = (state: RootState) =>
  state.CoreSets.availableItems;
export const selectOurItems = (state: RootState) =>
  state.CoreSets.availableItems;

export default coreSetSlice.reducer;
