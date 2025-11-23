import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { ThemeProvider } from '@/components/theme-provider'
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'
import { Toaster } from '@/components/ui/toaster'
import ClientLayoutWrapper from './ClientLayoutWrapper'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'PropertyGanj',
  description: 'Made by Satvik Mudgal',
  generator: 'Satvik Mudgal',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <StyledComponentsRegistry>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
            <Toaster />
          </ThemeProvider>
        </StyledComponentsRegistry>
        <Analytics />
        <script id="chatway" async={true} src="https://cdn.chatway.app/widget.js?id=9BKWx7BtTYy3"></script>
      </body>
    </html>
  )
}
