import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ReduxProvider, AuthProvider } from "@/providers";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header/header";

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Poster-Parlor",
  description: "CEO Pankaj",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${robotoMono.variable}  antialiased `}>
        <ReduxProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Header />
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
