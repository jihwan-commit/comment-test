import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app";
import { QueryClientProvider } from "@tanstack/react-query";

import "@/app/index.css";

import { queryClient } from "@/shared/config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
