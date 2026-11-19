import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/core/api/baseApi";
import { onSessionCleared } from "@/core/auth/session";

export const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

// Never let one user's cached data survive into the next session.
onSessionCleared(() => {
  store.dispatch(baseApi.util.resetApiState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
