import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const inter = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Selçuk Cihan | Freelance Software Engineer",
  description: "This is the portfolio page of Selçuk Cihan, software engineer.",
  keywords: [
    "selcuk",
    "cihan",
    "software",
    "engineer",
    "freelancer",
    "portfolio",
    "developer",
    "senior",
    "resume",
    "selcuk cihan",
    "selçuk cihan",
    "selcukcihan",
    "cloud",
    "aws",
    "serverless",
    "amazon",
    "architect",
    "technologist",
    "fullstack",
    "web development",
    "python",
    "javascript",
    "java",
    "scala",
    "contractor"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
