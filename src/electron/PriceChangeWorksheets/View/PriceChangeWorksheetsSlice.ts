import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../View/store";

import { PriceChangeWorksheetEntry } from "TextImporters/PriceChangeWorksheet";

// Define a type for the slice state
interface PriceChangeWorksheetsState {
  status: string;
  folderPath: string;
  errorMessage: string;
  worksheets: Array<PriceChangeWorksheetEntry>;
}

// Define the initial state using that type
const initialState: PriceChangeWorksheetsState = {
  status: "",
  folderPath: "",
  errorMessage: "",
  worksheets: [],
};

export const priceChangeWorksheetsSlice = createSlice({
  name: "PriceChangeWorksheets",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    setFolderPath: (state, action: PayloadAction<string>) => {
      state.folderPath = action.payload;
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setWorksheets: (
      state,
      action: PayloadAction<Array<PriceChangeWorksheetEntry>>
    ) => {
      state.worksheets = action.payload;
    },
  },
});
export const selectWorksheets = (state: RootState) =>
  state.PriceChangeWorksheets.worksheets;

export const { setStatus, setFolderPath, setErrorMessage } =
  priceChangeWorksheetsSlice.actions;

export default priceChangeWorksheetsSlice.reducer;
