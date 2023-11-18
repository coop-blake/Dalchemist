import { configureStore } from "@reduxjs/toolkit";
import coreSetsReducer from "../../CoreSupport/View/CoreSetSlice";
import inventoryReducer from "../../Inventory/View/InventorySlice";
import mainReducer from "./MainSlice";

import addDropReducer from "../../AddDrop/View/AddDropSlice";
import priceChangeWorksheetsReducer from "../../PriceChangeWorksheets/View/PriceChangeWorksheetsSlice";

export const store = configureStore({
  reducer: {
    Main: mainReducer,
    CoreSets: coreSetsReducer,
    Inventory: inventoryReducer,
    AddDrop: addDropReducer,
    PriceChangeWorksheets: priceChangeWorksheetsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
