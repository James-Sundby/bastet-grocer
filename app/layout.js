import { Archivo } from "next/font/google";

import { AuthContextProvider } from "./_utils/auth-context";
import "./globals.css";
import Header from "./components/organisms/header";

const archivo = Archivo({ subsets: ["latin"] });

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#66cc8a",
};

export const metadata = {
  title: "Bastet Grocer",
  description: "Create a grocery list the easy way.",
  authors: [{ name: 'James' }],
  creator: 'James',
  publisher: 'James',

  appleWebApp: {
    capable: true,
    title: "Grocer",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    title: 'Bastet Grocer',
    description: 'Create a grocery list the easy way.',
    url: 'https://grocer.jsundby.dev/',
    siteName: 'Bastet Grocer',
    images: [
      {
        url: 'https://grocer.jsundby.dev/card-image.jpg',
        width: 1200,
        height: 600,
        alt: 'A grocery stand with fruits and vegetables in baskets.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bastet Grocer',
    description: 'Create a grocery list the easy way.',
    images: ['https://grocer.jsundby.dev/card-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="emerald-custom">
      <body className={`${archivo.className} flex min-h-dvh flex-col bg-base-200`}>
        <AuthContextProvider>
          <Header />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
