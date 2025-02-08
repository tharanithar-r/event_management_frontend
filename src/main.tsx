import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";
import store from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <main className="font-Urbanist dark text-foreground bg-background min-h-screen">
          <App />
        </main>
      </HeroUIProvider>
    </Provider>
  </StrictMode>
);
