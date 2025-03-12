import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import { setupListeners } from "@reduxjs/toolkit/query";
import {SocketProvider} from "@/providers/socketProvider.tsx";

setupListeners(store.dispatch);

createRoot(document.getElementById("root")!).render(
  <StrictMode>

    <Provider store={store}>
        <SocketProvider>
            <App />
        </SocketProvider>
    </Provider>
  </StrictMode>
);
