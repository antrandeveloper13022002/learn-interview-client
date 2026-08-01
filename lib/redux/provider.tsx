"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";
import { SessionBootstrap } from "@/components/auth/SessionBootstrap";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <SessionBootstrap />
      {children}
    </Provider>
  );
}
