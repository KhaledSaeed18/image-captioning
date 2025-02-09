import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "AI Image Captioning | Generate Automatic Image Descriptions",
    template: "%s | AI Image Captioning"
  },
  description: "Generate accurate and detailed captions for your images using AI. Support for JPEG, PNG, WebP, and GIF formats. Free image captioning tool powered by advanced machine learning.",
  keywords: ["image captioning", "AI image description", "automatic image captions", "image to text", "accessibility tools", "image recognition", "machine learning"],
  authors: [{ name: "Khaled Saeed" }],
  creator: "Khaled Saeed",
  publisher: "Khaled Saeed",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://image-captioning-three-tau.vercel.app/"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://image-captioning-three-tau.vercel.app/",
    title: "AI Image Captioning | Generate Automatic Image Descriptions",
    description: "Generate accurate and detailed captions for your images using AI. Support for JPEG, PNG, WebP, and GIF formats.",
    siteName: "AI Image Captioning",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Captioning | Generate Automatic Image Descriptions",
    description: "Generate accurate and detailed captions for your images using AI. Support for JPEG, PNG, WebP, and GIF formats.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}