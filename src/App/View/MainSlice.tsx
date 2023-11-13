import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'



// Define a type for the slice state
interface MainState {
    status: string,
    errorMessage: string,
}

// Define the initial state using that type
const initialState: MainState = {
    status: "",
    errorMessage: "",
}

export const mainSlice = createSlice({
  name: 'Main',
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
  }
  }
})

export const { setStatus, setErrorMessage } = mainSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectStatus = (state: RootState) => state.Main.status
export const selectErrorMessages = (state: RootState) => state.Main.errorMessage

export default mainSlice.reducer