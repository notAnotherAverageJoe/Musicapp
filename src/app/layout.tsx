import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Music Mockup App",
    default: "Collaborative Frontend Prototype", 
  },
  description: "A collaborative music creation prototype built with React, Tone.js, and Next.js.",
  
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          
          /* Added Base Styling for a Dark UI */
          min-h-screen 
          bg-black 
          text-gray-50 
          transition-colors 
        `}
      >
        {children}
      </body>
    </html>
  );
}