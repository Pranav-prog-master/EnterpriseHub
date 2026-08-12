import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { AppearanceProvider } from "@/components/ui/AppearanceProvider";

export const metadata: Metadata = {
  title: "EnterpriseHub AI",
  description: "Enterprise-grade management platform for business operations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-density="comfortable" data-fontsize="medium">
      <body>
        <Providers>
          <AppearanceProvider>
            {children}
          </AppearanceProvider>
        </Providers>
      </body>
    </html>
  );
}
