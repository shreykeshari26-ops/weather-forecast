import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ForecastOS — Premium Weather Dashboard",
  description:
    "Next-generation weather application with real-time atmospheric data, glassmorphic design, and immersive motion interactions.",
  keywords: ["weather", "forecast", "dashboard", "atmospheric", "real-time"],
  openGraph: {
    title: "ForecastOS — Premium Weather Dashboard",
    description: "Immersive weather intelligence at your fingertips.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-space-grotesk)]">
        {children}
      </body>
    </html>
  );
}
