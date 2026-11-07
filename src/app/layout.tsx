import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARKETMAP | Institutional Stock Market Heatmap Terminal",
  description: "Real-time institutional stock market treemap visualizer for Indian (NSE, BSE) and US (NASDAQ, NYSE) markets.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080B10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full bg-[#080B10] text-slate-100 antialiased selection:bg-emerald-500/25 selection:text-emerald-300">
      <body className="min-h-full flex flex-col font-sans bg-[#080B10] text-slate-100">
        {children}
      </body>
    </html>
  );
}
