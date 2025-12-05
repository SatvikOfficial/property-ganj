import Header from '@/components/header'
import DynamicBackground from '@/components/DynamicBackground'

export const metadata = {
  title: 'Blog | Property Ganj',
  description: 'Latest real estate insights, property tips, and market analysis.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen relative">
      {/* Video Background */}
      {/* Dynamic Background */}
      <DynamicBackground variant="blog" />

      <div className="relative z-10">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </main>
  )
}