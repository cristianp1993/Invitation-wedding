import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond, Playfair_Display, Montserrat, Allura } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const allura = Allura({
  weight: "400",
  variable: "--font-allura",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cristian & Valentina - Nuestra Boda",
  description: "Estás invitado a celebrar nuestra unión. Cristian Camilo & Valentina.",
  icons: {
    icon: [{ url: "/images/FOTO_2.jpeg", type: "image/jpeg" }],
    shortcut: [{ url: "/images/FOTO_2.jpeg", type: "image/jpeg" }],
    apple: [{ url: "/images/FOTO_2.jpeg", type: "image/jpeg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${greatVibes.variable} ${cormorant.variable} ${playfair.variable} ${montserrat.variable} ${allura.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
