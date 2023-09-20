import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../View/store'
import { AddDropStatus, NewItemEntry, AttributeChangeEntry } from "../../Google/addDrop/shared"




// Define a type for the slice state
interface AddDropState {
    status: AddDropStatus,
  NewItems:  Array<NewItemEntry>,
  AttributeChanges:   Array<AttributeChangeEntry>,
}

// Define the initial state using that type
const initialState: AddDropState = {
    status: AddDropStatus.Starting,
    NewItems:   [],
    AttributeChanges : []
}

export const addDropSlice = createSlice({
  name: 'AddDrop',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
setStatus:(state, action: PayloadAction<AddDropStatus>) => {
    state.status = action.payload
    console.log(state.status)
  },
    setNewItems: (state, action: PayloadAction<Array<NewItemEntry>>) => {
      state.NewItems = action.payload
    },
    setAttributeChanges: (state, action: PayloadAction<Array<AttributeChangeEntry>>) => {
      state.AttributeChanges = action.payload
    }
  }
})

export const { setStatus, setNewItems, setAttributeChanges  } = addDropSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectNewItems = (state: RootState) => state.AddDrop.NewItems

export default addDropSlice.reducer