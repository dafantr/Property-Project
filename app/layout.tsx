import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
//import { Provider } from "@radix-ui/react-toast";
import Providers from "./providers";
import {ClerkProvider} from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin']})

export const metadata: Metadata = {
  title: "Property Project",
  description: "The keys to your home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <Providers>
          <Navbar />
          <main className="container py-10">{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
    
   
  );
}
