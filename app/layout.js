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
  authors: [{ name: 'James' }],
  creator: 'James',
  publisher: 'James',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'icon', url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  openGraph: {
    title: 'Bastet Grocer',
    description: 'Create a grocery list the easy way.',
    url: 'https://grocer.jsundby.dev/',
    siteName: 'Bastet Grocer',
    images: [
      {
        url: 'https://grocer.jsundby.dev/card-image.jpeg',
        width: 800,
        height: 400,
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
    images: ['https://grocer.jsundby.dev/card-image.jpeg'],
  },
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
