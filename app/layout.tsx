import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "M Hasan | Full-Stack Developer & Tech Enthusiast",
  description: "Portfolio of M Hasan - Full-Stack Developer specializing in React, Next.js, Node.js, AI/ML, and Cloud Technologies. Building innovative solutions with modern web technologies.",
  keywords: ["M Hasan", "Full-Stack Developer", "Web Developer", "React", "Next.js", "Node.js", "TypeScript", "AI/ML", "Cloud Computing"],
  authors: [{ name: "M Hasan" }],
  creator: "M Hasan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mahedi-hasan-p2.vercel.app",
    title: "M Hasan | Full-Stack Developer",
    description: "Portfolio of M Hasan - Building innovative solutions with modern web technologies",
    siteName: "M Hasan Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "M Hasan | Full-Stack Developer",
    description: "Portfolio of M Hasan - Building innovative solutions with modern web technologies",
    creator: "@m_hasan_11",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
