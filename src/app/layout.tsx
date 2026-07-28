import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlazeWallet — Your Favorite Desktop Wallet",
  description:
    "Your native macOS command center to manage, trade, and view your crypto without the friction of browser extensions. Execute transactions instantly using just your @username.",
  keywords: [
    "GlazeWallet",
    "macOS crypto wallet",
    "smart account wallet",
    "ERC-4337",
    "Coinbase Developer Platform",
    "gasless wallet",
    "desktop crypto wallet",
  ],
  authors: [{ name: "GlazeWallet" }],
  openGraph: {
    title: "Your Favorite Desktop Wallet",
    description:
      "Your native macOS command center to manage, trade, and view your crypto without the friction of browser extensions.",
    type: "website",
    siteName: "GlazeWallet",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GlazeWallet — Your Favorite Desktop Wallet" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GlazeWallet — Your Favorite Desktop Wallet",
    description:
      "Your native macOS command center to manage, trade, and view your crypto without the friction of browser extensions.",
    creator: "@GlazeWallet",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/app-icon.png",
    apple: "/app-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-foreground">
        {children}
      </body>
    </html>
  );
}
