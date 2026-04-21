import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeBill — Quoting & Invoicing for Small Contractors",
  description:
    "Quote fast, invoice instantly, get paid. The simplest quoting and invoicing tool built for 1–5 person contractor shops. $29/month.",
  openGraph: {
    title: "TradeBill — Quoting & Invoicing for Small Contractors",
    description:
      "Stop losing money to slow quotes and chased invoices. Built by a contractor, for contractors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
