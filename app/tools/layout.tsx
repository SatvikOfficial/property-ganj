import Header from '@/components/header'
import DynamicBackground from '@/components/DynamicBackground'

export const metadata = {
  title: 'Property Tools | Property Ganj',
  description: 'Plan EMIs, mortgages, rent budgets and yields with our quick calculators.',
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen relative">
      {/* Video Background with blur effect */}
      {/* Dynamic Background */}
      <DynamicBackground variant="tools" />

      <div className="relative z-10">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </main>
  )
}