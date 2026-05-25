import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "../components/ErrorBoundary";

export const metadata: Metadata = {
  title: "ArchGen AI | Agentic AI Architecture-to-Terraform Generator",
  description: "An intelligent, agentic multi-AI platform to analyze application requirements, plan visually optimized cloud topologies, audit complexity, estimate costs, and compile production-grade HCL Terraform templates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-background bg-cyber-grid bg-cyber-grid-size text-gray-100 flex flex-col font-sans">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
