import type { ReactNode } from "react";

export const metadata = {
  title: "CV vocal — POC",
  description: "Créez votre CV en parlant à une IA",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "#F7F6F2",
          color: "#2C2C2A",
        }}
      >
        {children}
      </body>
    </html>
  );
}
