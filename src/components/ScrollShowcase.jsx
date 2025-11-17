import { useEffect, useMemo, useRef, useState, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Spline from '@splinetool/react-spline'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function gradientFromColors(colors = ['#111827', '#2563eb']) {
  const [c1, c2] = colors.length >= 2 ? colors : [colors[0] || '#111827', '#2563eb']
  return `radial-gradient(60% 80% at 70% 30%, ${c1} 0%, ${c2} 45%, #0b1220 100%)`
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch (e) {
    return false
  }
}

export default function ScrollShowcase() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enableSpline, setEnableSpline] = useState(false)
  const [splineFailed, setSplineFailed] = useState(false)

  // Use viewport scroll to drive effects (avoids nested scroll issues)
  const { scrollYProgress } = useScroll()

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 90])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.35, 0.6, 0.35])

  useEffect(() => {
    // Defer enabling Spline until after first paint and only if WebGL is available
    const t = setTimeout(() => {
      if (typeof window !== 'undefined' && isWebGLAvailable()) {
        setEnableSpline(true)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [])

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE}/api/products`)
      const data = await res.json()
      const list = Array.isArray(data.items) ? data.items : []
      if (list.length === 0) {
        await fetch(`${BASE}/api/products/seed`, { method: 'POST' })
        const r2 = await fetch(`${BASE}/api/products`)
        const d2 = await r2.json()
        setItems(Array.isArray(d2.items) ? d2.items : [])
      } else {
        setItems(list)
      }
    } catch (e) {
      // Keep UI visible even if API fails
      setError('')
      setItems([
        // graceful fallback content
        {
          id: 'fallback-1',
          title: 'Air Zoom Pegasus',
          description: 'Lightweight everyday trainer with a responsive ride.',
          category: 'Running',
          price: 119,
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop'],
          colors: ['#1f2937', '#2563eb', '#10b981']
        },
        {
          id: 'fallback-2',
          title: 'Air Force 1',
          description: 'Timeless street classic with premium leather.',
          category: 'Lifestyle',
          price: 99,
          images: ['https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1400&auto=format&fit=crop'],
          colors: ['#111827', '#6b7280', '#e5e7eb']
        }
      ])
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gradients = useMemo(() => items.map(p => gradientFromColors(p.colors)), [items])

  return (
    <section className="relative w-full">
      {/* Background Layer: Always-on gradient to prevent blank flashes */}
      <div className="pointer-events-none absolute inset-0 -z-20" style={{ background: gradients[0] || gradientFromColors() }} />

      {/* Optional Spline Background with safeguards */}
      {enableSpline && !splineFailed && (
        <motion.div className="pointer-events-none absolute inset-0 -z-10" style={{ rotate, scale, opacity }}>
          <Suspense fallback={null}>
            <Spline
              scene="https://prod.spline.design/6lNw7U3f7uQfXc8S/scene.splinecode"
              onLoad={() => {/* loaded */}}
              onError={() => setSplineFailed(true)}
            />
          </Suspense>
        </motion.div>
      )}

      {/* Intro panel */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Glide Through The Collection
          </motion.h2>
          <motion.p
            className="mt-4 text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Scroll to reveal more Nike silhouettes. Background blends with each pair for a smooth, stylish vibe.
          </motion.p>
        </div>
      </div>

      {/* Product panels stacked on the page (no nested scroll) */}
      <div>
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <p className="text-white/90">Loading showcase...</p>
          </div>
        ) : (
          items.map((p, i) => (
            <section key={p.id || i} className="relative h-screen flex items-center">
              <div className="absolute inset-0 -z-10" style={{ background: gradients[i] || gradientFromColors(p.colors) }} />
              <div className="w-full max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 items-center gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      loading="lazy"
                      className="w-full max-w-xl rounded-3xl shadow-2xl border border-white/10"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <motion.div
                      className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur rounded-2xl shadow-xl p-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-sm text-gray-800">{p.category} · Nike</p>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="text-white"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h3 className="text-3xl sm:text-4xl font-extrabold drop-shadow">{p.title}</h3>
                  <p className="mt-4 text-white/85 leading-7 max-w-prose">{p.description}</p>
                  <div className="mt-6 flex items-center gap-3">
                    {Array.isArray(p.colors) && p.colors.slice(0, 3).map((c, idx) => (
                      <span key={idx} className="inline-block w-8 h-8 rounded-full border border-white/40" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <div className="mt-8 flex items-center gap-4">
                    <span className="text-xl font-bold bg-white text-gray-900 px-4 py-2 rounded-full shadow">${p.price}</span>
                    <a href="/shop" className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 transition border border-white/40">Shop now</a>
                  </div>
                </motion.div>
              </div>
            </section>
          ))
        )}
      </div>

      {/* Fallback notice */}
      {(splineFailed || !enableSpline) && (
        <div className="pointer-events-none sticky bottom-4 right-4 mt-10 flex justify-end pr-4 text-xs text-white/70">
          3D disabled to keep the page stable
        </div>
      )}
    </section>
  )
}
