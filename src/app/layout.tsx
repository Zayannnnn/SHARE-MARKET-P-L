import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARKETMAP | Professional Stock Market Heatmap & Analytics",
  description: "Real-time stock market heatmap visualization for Indian (NSE/BSE) and US (NASDAQ/NYSE) markets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full bg-[#090D14] text-slate-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      <body className="min-h-full flex flex-col font-sans bg-[#090D14] text-slate-200">
        {children}
      </body>
    </html>
  );
}
