import type { Metadata } from "next";
import "./globals.css";
import "./styles/navigation.css";
import "./styles/hero.css";
import "./styles/routes.css";
import "./styles/responsive.css";

export const metadata: Metadata = {
  title: "Token Terminal | Fundamentals for crypto",
  description:
    "Measure and evaluate Blockchains and Dapps through traditional financial metrics.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/css/18bo3xybony97.css" />
        <link rel="stylesheet" href="/css/0z-8tf3sp3ovs.css" />
      </head>
      <body className="theme-dark geistsans_d5a4f12f-module__UWyvRW__variable geistmono_157ca88a-module__DG41QG__variable">
        {children}
      </body>
    </html>
  );
}
