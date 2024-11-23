// import { Inter } from "next/font/google";
import { Archivo } from "next/font/google";

import { AuthContextProvider } from "./_utils/auth-context";
import "./globals.css";
import Header from "./components/organisms/header";

// const inter = Inter({ subsets: ["latin"] });
const archivo = Archivo({ subsets: ["latin"] });

export const metadata = {
  title: "Bastet Grocer",
  description: "Create a grocery list the easy way.",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="emerald" lang="en" >
      <body className={`${archivo.className} min-h-screen flex flex-col`}>
        <AuthContextProvider>
          <Header />
          {children}

        </AuthContextProvider>
      </body>
    </html>
  );
}
