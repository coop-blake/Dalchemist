import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../View/store'
import { CoreSetsStatus, CoreSupportEntry } from "electron/CoreSupport/shared";




// Define a type for the slice state
interface CoreSetsState {
    status: string,
    errorMessage: string,
  availableItems:  Array<CoreSupportEntry>,
  ourItems: Array<CoreSupportEntry>
}

// Define the initial state using that type
const initialState: CoreSetsState = {
    status: "",
    errorMessage: "",
    availableItems: [],
    ourItems: [],
}

export const coreSetSlice = createSlice({
  name: 'CoreSets',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
setStatus:(state, action: PayloadAction<string>) => {
    state.status = action.payload
    console.log(state.status)
  },
  setErrorMessage:(state, action: PayloadAction<string>) => {
    state.errorMessage = action.payload
    console.log(state.status)
  },
    setAvailableItems: (state, action: PayloadAction<Array<CoreSupportEntry>>) => {
      state.availableItems = action.payload
    },
    setOurItems: (state, action: PayloadAction<Array<CoreSupportEntry>>) => {
        state.ourItems = action.payload
      },
  }
})

export const { setStatus, setErrorMessage, setAvailableItems, setOurItems } = coreSetSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAvailableItems = (state: RootState) => state.CoreSets.availableItems
export const selectOurItems = (state: RootState) => state.CoreSets.availableItems

export default coreSetSlice.reducer