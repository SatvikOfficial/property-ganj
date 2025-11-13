import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { ThemeProvider } from '@/components/theme-provider'
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'

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
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body className={`font-sans antialiased`}>
        <StyledComponentsRegistry>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </StyledComponentsRegistry>
        <Analytics />
      </body>
    </html>
  )
}
