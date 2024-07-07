import { Inter } from "next/font/google";
import { Archivo } from "next/font/google";

import { AuthContextProvider } from "./_utils/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const archivo = Archivo({ subsets: ["latin"] });

export const metadata = {
  title: "Bastet Grocer",
  description: "Create a grocery list the easy way.",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="bumblebee" lang="en">
      <body className={archivo.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
