import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],

  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: {
    template: "B.C.I. Interactive Map",
    default: "B.C.I. Interactive Map",
  },
  description: "Welcome to my Next.js application.",
  openGraph: {
    title: "B.C.I. Interactive Map",
    description: "Beyond-Extraterrestrial Interactive Map",
    siteName: "B.C.I. Interactive Map",
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
