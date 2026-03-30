import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ClientLayoutWrapper from './ClientLayoutWrapper'

export const metadata: Metadata = {
  title: 'PropertyGanj',
  description: 'Made by Satvik Mudgal',
  generator: 'Satvik Mudgal',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased w-full overflow-x-hidden`}>
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
        <Script
          id="chatway"
          src="https://cdn.chatway.app/widget.js?id=9BKWx7BtTYy3"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
