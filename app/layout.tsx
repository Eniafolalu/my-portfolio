import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground min-h-screen antialiased selection:bg-foreground selection:text-background">
        {children}
      </body>
    </html>
  );
}
