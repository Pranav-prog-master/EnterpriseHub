"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { store } from "@/store/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60 * 2, retry: 1, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111111",
              color: "#f5f5f0",
              border: "2px solid #1a1a1a",
              borderRadius: "0",
              fontFamily: "var(--font-space-mono)",
              fontSize: "11px",
              padding: "10px 14px",
            },
            success: { iconTheme: { primary: "#00c853", secondary: "#111111" } },
            error:   { iconTheme: { primary: "#ff3b00", secondary: "#111111" } },
          }}
        />
      </QueryClientProvider>
    </Provider>
  );
}
