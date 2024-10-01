import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrelineScript from "./components/PrelineScript";
import AuthProvider from "./components/auth/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryClientProvider from "./QueryClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bonas - Discover the Best Deals in Cameroon",
  description:
    "Bonas is Cameroon's leading online classified listing platform. Buy, sell, and find services across categories like electronics, vehicles, real estate, fashion, and more. Connect with local buyers and sellers for the best deals in Douala, Yaoundé, and all of Cameroon.",
  keywords:
    "Cameroon, classified ads, online marketplace, buy, sell, services, jobs, real estate, vehicles, electronics, fashion",
  openGraph: {
    title: "Bonas - Your Trusted Marketplace in Cameroon",
    description:
      "Find the best deals on goods and services across Cameroon. Free ad posting, secure transactions, and a wide range of categories.",
    type: "website",
    locale: "en_CM",
    siteName: "Bonas",
  },
  twitter: {
    // card: "",
    title: "Bonas - Cameroon's Premier Online Marketplace",
    description:
      "Connect with buyers and sellers for the best deals in Cameroon. Explore jobs, housing, cars, services, and more!",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
          <ToastContainer />
        </QueryClientProvider>
      </body>
      <PrelineScript />
    </html>
  );
}
