import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import searchReducer from "./searchSlice";
import authReducer from "./auth/authSlice";
import eventReducer from "./event/eventSlice";
import { AnyAction } from "redux";

const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    search: searchReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
export default store;
