import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html suppressHydrationWarning={true} lang="en">
        <body
          suppressHydrationWarning={true}
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
