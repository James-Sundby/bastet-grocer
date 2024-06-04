import { Inter } from "next/font/google";
import { AuthContextProvider } from "./_utils/auth-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bastet Grocer",
  description: "Create a grocery list the easy way.",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="bumblebee" lang="en">
      <body className={inter.className}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
