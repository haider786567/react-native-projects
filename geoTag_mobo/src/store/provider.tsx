import { PropsWithChildren, useEffect } from "react";
import { Provider } from "react-redux";
import { restoreSession } from "../features/auth/services/auth.service";
import { sessionRestored, signedOut } from "../features/auth/store/auth.slice";
import { setUnauthorizedHandler } from "../services/api";
import { store } from "./index";

import { bootstrapLanguage, bootstrapTheme } from "./preferences.slice";

const SessionBootstrap = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    setUnauthorizedHandler(() => store.dispatch(signedOut()));
    void restoreSession().then((user) => store.dispatch(sessionRestored(user)));
    void store.dispatch(bootstrapLanguage());
    void store.dispatch(bootstrapTheme());
    return () => setUnauthorizedHandler(null);
  }, []);
  return children;
};

export const AppProvider = ({ children }: PropsWithChildren) => (
  <Provider store={store}>
    <SessionBootstrap>{children}</SessionBootstrap>
  </Provider>
);
