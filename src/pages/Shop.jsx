import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Shop() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/api/products`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const seed = async () => {
    try {
      await fetch(`${BASE}/api/products/seed`, { method: 'POST' })
      await fetchItems()
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold">Nike at Meer Shoes</h1>
              <p className="text-gray-600 mt-2">Smooth browsing, smooth cushioning. Explore our selection.</p>
            </div>
            <button onClick={seed} className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700">
              Seed Nike Products
            </button>
          </div>

          {loading ? (
            <p className="mt-10 text-gray-600">Loading products...</p>
          ) : (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p, i) => (
                <motion.div
                  key={p.id || i}
                  className="rounded-2xl border border-gray-200 bg-white overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{p.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">{p.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-bold">${p.price}</span>
                      <span className="text-xs text-gray-500">{p.category} · Nike</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
