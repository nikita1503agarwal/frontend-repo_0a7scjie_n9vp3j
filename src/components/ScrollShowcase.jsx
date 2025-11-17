import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function gradientFromColors(colors = ['#111827', '#2563eb']) {
  const [c1, c2, c3] = [
    colors?.[0] || '#111827',
    colors?.[1] || '#2563eb',
    colors?.[2] || '#0ea5e9'
  ]
  // Layered linear + radial for rich background tied to shoe palette
  return `radial-gradient(60% 80% at 70% 30%, ${c1} 0%, ${c2} 50%, #0b1220 100%), linear-gradient(120deg, ${c1} 0%, ${c3} 100%)`
}

function useTilt() {
  const ref = useRef(null)
  const state = useRef({ rx: 0, ry: 0 })
  const handle = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width - 0.5
    const py = y / rect.height - 0.5
    state.current = { rx: py * -12, ry: px * 12 }
    el.style.setProperty('--rx', `${state.current.rx}deg`)
    el.style.setProperty('--ry', `${state.current.ry}deg`)
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', `0deg`)
    el.style.setProperty('--ry', `0deg`)
  }
  return { ref, handle, reset }
}

export default function ScrollShowcase() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Scroll progress to create subtle parallax on the decorative box
  const { scrollYProgress } = useScroll()
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 25])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.25, 0.5, 0.35])

  const load = async () => {
    setLoading(true)
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
      // graceful fallback content
      setItems([
        {
          id: 'fallback-1',
          title: 'Air Zoom Pegasus',
          description: 'Lightweight everyday trainer with a responsive ride.',
          category: 'Running',
          price: 119,
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop'],
          colors: ['#ef4444', '#7c2d12', '#0f172a']
        },
        {
          id: 'fallback-2',
          title: 'Air Force 1',
          description: 'Timeless street classic with premium leather.',
          category: 'Lifestyle',
          price: 99,
          images: ['https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1600&auto=format&fit=crop'],
          colors: ['#111827', '#6b7280', '#e5e7eb']
        },
        {
          id: 'fallback-3',
          title: 'Air Max 270',
          description: 'Big Air for all‑day comfort with bold style.',
          category: 'Lifestyle',
          price: 149,
          images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop'],
          colors: ['#2563eb', '#1e3a8a', '#0b1220']
        }
      ])
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const gradients = useMemo(() => items.map(p => gradientFromColors(p.colors)), [items])

  return (
    <section className="relative w-full">
      {/* Intro panel */}
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: gradients[0] || gradientFromColors() }}>
        <motion.div className="absolute inset-0 -z-10" style={{ opacity }} />
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
            Scroll to reveal Nike silhouettes. Each section blends the page with the shoe’s own colors.
          </motion.p>
        </div>
      </div>

      {/* Product panels */}
      <div>
        {loading ? (
          <div className="h-screen flex items-center justify-center" style={{ background: gradientFromColors() }}>
            <p className="text-white/90">Loading showcase...</p>
          </div>
        ) : (
          items.map((p, i) => {
            const { ref, handle, reset } = useTilt()
            return (
              <section key={p.id || i} className="relative h-screen flex items-center overflow-hidden" style={{ background: gradients[i] || gradientFromColors(p.colors) }}>
                {/* Soft global glow */}
                <motion.div
                  className="absolute -z-10 inset-0"
                  style={{ opacity }}
                />

                <div className="w-full max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 items-center gap-10">
                  {/* Visual side with faux 3D box and shadow */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.4 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    {/* Perspective wrapper for tilt */}
                    <div
                      ref={ref}
                      onMouseMove={handle}
                      onMouseLeave={reset}
                      className="relative w-full max-w-xl mx-auto [perspective:1200px]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* 3D box frame */}
                      <motion.div
                        className="relative rounded-[28px] border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]"
                        style={{
                          transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
                          transformStyle: 'preserve-3d'
                        }}
                        animate={{ rotateZ: 0 }}
                        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
                      >
                        {/* inner shadows to feel like inside a box */}
                        <div className="absolute inset-0 rounded-[28px] pointer-events-none"
                          style={{
                            boxShadow:
                              'inset 0 30px 80px rgba(255,255,255,0.06), inset 0 -30px 80px rgba(0,0,0,0.35)'
                          }}
                        />
                        {/* floating gradient planes to give depth */}
                        <motion.div
                          className="absolute -inset-6 rounded-[40px] blur-3xl"
                          style={{ background: `radial-gradient(60% 80% at 70% 30%, ${p.colors?.[1] || '#2563eb'}40 0%, transparent 70%)`, translateZ: '-40px' }}
                          aria-hidden
                        />

                        {/* Shoe image on a platform */}
                        <div className="relative p-6 sm:p-8" style={{ transform: 'translateZ(40px)' }}>
                          {/* platform shadow */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-6 h-10 w-3/4 rounded-full blur-2xl" style={{ background: '#000', opacity: 0.25 }} />
                          <img
                            src={p.images?.[0]}
                            alt={p.title}
                            loading="lazy"
                            className="relative z-10 w-full rounded-2xl shadow-2xl border border-white/10 select-none"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        </div>

                        {/* Decorative rotating ring behind image */}
                        <motion.div
                          className="absolute inset-0 rounded-[28px]"
                          style={{
                            background: `conic-gradient(from 0deg, transparent, ${p.colors?.[0] || '#111827'}44, transparent 70%)`,
                            mixBlendMode: 'screen',
                            translateZ: '-20px'
                          }}
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
                          aria-hidden
                        />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Text side */}
                  <motion.div
                    className="text-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <h3 className="text-3xl sm:text-4xl font-extrabold drop-shadow">{p.title}</h3>
                    <p className="mt-4 text-white/85 leading-7 max-w-prose">{p.description}</p>
                    <div className="mt-6 flex items-center gap-3">
                      {Array.isArray(p.colors) && p.colors.slice(0, 4).map((c, idx) => (
                        <span key={idx} className="inline-block w-8 h-8 rounded-full border border-white/40" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                      <span className="text-xl font-bold bg-white text-gray-900 px-4 py-2 rounded-full shadow">${p.price}</span>
                      <a href="/shop" className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 transition border border-white/40">Shop now</a>
                    </div>
                  </motion.div>
                </div>

                {/* subtle parallax block behind everything */}
                <motion.div
                  className="absolute -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vmin] h-[110vmin] rounded-[3rem] border border-white/10"
                  style={{ rotate, opacity, boxShadow: '0 60px 120px -40px rgba(0,0,0,0.5)' }}
                />
              </section>
            )
          })
        )}
      </div>
    </section>
  )
}
