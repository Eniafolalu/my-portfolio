import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Enioluwa Afolalu — Product Designer · UI/UX Designer",
    template: "%s | Enioluwa Afolalu",
  },
  description:
    "Product Designer focused on creating intuitive, scalable and visually refined digital experiences across mobile apps, websites, and enterprise dashboards.",
  keywords: [
    "Product Designer",
    "UI/UX Designer",
    "Design Systems",
    "Mobile App Design",
    "SaaS Design",
    "Enioluwa Afolalu",
  ],
  authors: [{ name: "Enioluwa Afolalu" }],
  creator: "Enioluwa Afolalu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://enioluwa.design",
    siteName: "Enioluwa Afolalu Portfolio",
    title: "Enioluwa Afolalu — Product Designer · UI/UX Designer",
    description:
      "Product Designer focused on creating intuitive, scalable and visually refined digital experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enioluwa Afolalu — Product Designer · UI/UX Designer",
    description:
      "Product Designer focused on creating intuitive, scalable and visually refined digital experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${manrope.variable}`}>
      <body className="bg-background text-foreground font-sans min-h-screen antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
