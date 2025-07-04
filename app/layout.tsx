import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const openRunde = localFont({
  variable: "--font-open-runde",
  display: "swap",
  src: [
    {
      path: "./fonts/OpenRunde-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});


export const metadata: Metadata = {
  title: "Cajaun Campbell",
  description: "Software Enginner passionate about building functional interfaces and solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
         className={`${openRunde.variable} font-sans antialiased bg-white dark:bg-[#11110F]`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
