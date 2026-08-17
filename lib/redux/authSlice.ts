import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, SessionUser } from "@/lib/types";

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isBootstrapped: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionEstablished(state, action: PayloadAction<{ accessToken: string; user: SessionUser }>) {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.isBootstrapped = true;
    },
    sessionCleared(state) {
      state.accessToken = null;
      state.user = null;
      state.isBootstrapped = true;
    },
    // FU-17 — after a successful PATCH /me/profile, no need to re-fetch or
    // re-establish the whole session over one field.
    displayNameUpdated(state, action: PayloadAction<string | null>) {
      if (state.user) state.user.displayName = action.payload;
    },
  },
});

export const { sessionEstablished, sessionCleared, displayNameUpdated } = authSlice.actions;
export const authReducer = authSlice.reducer;
