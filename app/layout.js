import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "@liveblocks/react-ui/styles.css";
const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

const outfitMono = Outfit({
  variable: "--font-outfit-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NOTEZY",
  description: "Developer Kiran Kumar G",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
    <body
      className={`${outfitSans.variable} ${outfitMono.variable} antialiased`}
    >
      <Toaster/>
      {children}
    </body>
  </html>
  </ClerkProvider>
  );
}
