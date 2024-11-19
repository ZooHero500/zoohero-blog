import Provider from './Provider'
import Header from '@/components/Layout/Header'
import Footer from '@/components/footer'

export default function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Provider>
      <Header />
      <main className="w-full flex items-center backdrop-blur-sm">
        <main className="max-w-2xl w-full mt-16 mx-auto relative">
          <main className="mt-20 px-8">{children}</main>
          <Footer />
        </main>
      </main>
    </Provider>
  )
}
