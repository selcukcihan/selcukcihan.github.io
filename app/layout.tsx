import type { Metadata } from "next"
import { Raleway } from "next/font/google"
import { GoogleAnalytics } from '@next/third-parties/google'
import "./globals.css"

const font = Raleway({ subsets: ["latin"] })

const title = "Selçuk Cihan | Freelance Software Engineer"
const description = "Portfolio of Selçuk Cihan, software engineer."

const images = [{
  url: `https://selcukcihan.com/profile.png`,
  width: 360,
  height: 360,
  alt: title,
}]

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: description,
    description: title,
    applicationName: title,
    openGraph: {
      siteName: title,
      title: description,
      description: title,
      type: 'website',
      url: 'https://selcukcihan.com',
      images,
    },
    twitter: {
      site: '@scihan',
      creator: '@scihan',
      card: 'summary',
      title: description,
      description: title,
      images,
    },
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
    ],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-KG8E2CQLK0" />
      <body className={font.className}>{children}</body>
    </html>
  )
}
