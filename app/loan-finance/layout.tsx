import Header from '@/components/header'

export const metadata = {
  title: 'Loan & Finance | Property Ganj',
  description: 'Expert guidance on home loans, financing options, and financial planning for property buyers.',
}

export default function LoanFinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen relative">
      {/* Video Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover min-w-full min-h-full opacity-80 blur-sm"
          style={{ objectFit: 'cover' }}
        >
          <source src="/blog.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay to enhance text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </main>
  )
}