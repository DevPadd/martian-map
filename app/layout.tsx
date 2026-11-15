import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],

  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: {
    template: "M.A.R.S Interactive Map",
    default: "M.A.R.S Interactive Map",
  },
  description: "Welcome to my Next.js application.",
  openGraph: {
    title: "M.A.R.S Interactive Map",
    description: "Welcome to my Next.js application.",
    siteName: "M.A.R.S Interactive Map",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>{children}</body>
    </html>
  );
}
