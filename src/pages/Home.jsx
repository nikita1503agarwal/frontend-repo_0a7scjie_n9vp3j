import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import ScrollShowcase from '../components/ScrollShowcase'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main>
        <Hero />
        <ScrollShowcase />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
