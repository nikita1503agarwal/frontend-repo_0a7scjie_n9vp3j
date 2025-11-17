import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NikeShowcase from '../components/NikeShowcase'

export default function Shop() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Keep site nav at top, showcase renders its own Nike-style top bar inside */}
      <Navbar />
      <main className="pt-16">
        <NikeShowcase />
      </main>
      <Footer />
    </div>
  )
}
