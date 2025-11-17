import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y, FreeMode, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import gsap from 'gsap'

const BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop'

function gradientFromColors(colors = ['#0f172a', '#111827', '#374151']) {
  const [c1, c2, c3] = [
    colors?.[0] || '#0f172a',
    colors?.[1] || '#111827',
    colors?.[2] || '#374151'
  ]
  return `radial-gradient(80% 100% at 50% 40%, ${c2} 0%, ${c1} 60%, #0b1220 100%), linear-gradient(120deg, ${c1} 0%, ${c3} 100%)`
}

function shade(color, percent) {
  try {
    const c = color.startsWith('#') ? color.slice(1) : color
    const num = parseInt(c, 16)
    let r = (num >> 16) + percent
    let g = ((num >> 8) & 0x00ff) + percent
    let b = (num & 0x0000ff) + percent
    r = Math.max(Math.min(255, r), 0)
    g = Math.max(Math.min(255, g), 0)
    b = Math.max(Math.min(255, b), 0)
    return `#${(b | (g << 8) | (r << 16)).toString(16).padStart(6, '0')}`
  } catch {
    return color
  }
}

function useProducts() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${BASE}/api/products`)
        const data = await res.json()
        let list = Array.isArray(data.items) ? data.items : []
        if (list.length === 0) {
          await fetch(`${BASE}/api/products/seed`, { method: 'POST' })
          const r2 = await fetch(`${BASE}/api/products`)
          const d2 = await r2.json()
          list = Array.isArray(d2.items) ? d2.items : []
        }
        if (mounted) setItems(list)
      } catch (e) {
        console.error(e)
        // Robust fallback catalog (10 items) with reliable images
        if (mounted) setItems([
          {
            id: 'fallback-1',
            title: 'Air Zoom Pegasus 40',
            description: 'Lightweight everyday trainer with a responsive ride.',
            category: 'Running',
            price: 119,
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#ef4444', '#7c2d12', '#0f172a']
          },
          {
            id: 'fallback-2',
            title: 'Air Force 1 Low',
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
            images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#2563eb', '#1e3a8a', '#0b1220']
          },
          {
            id: 'fallback-4',
            title: 'Air Jordan 1',
            description: 'Iconic high‑top heritage with modern comfort.',
            category: 'Basketball',
            price: 169,
            images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#dc2626', '#111827', '#f59e0b']
          },
          {
            id: 'fallback-5',
            title: 'Blazer Mid 77',
            description: 'Vintage hoops style with clean lines.',
            category: 'Lifestyle',
            price: 99,
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#f3f4f6', '#6b7280', '#111827']
          },
          {
            id: 'fallback-6',
            title: 'Metcon 8',
            description: 'Stable base and durable upper for training.',
            category: 'Training',
            price: 129,
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#10b981', '#065f46', '#0b1220']
          },
          {
            id: 'fallback-7',
            title: 'React Infinity Run',
            description: 'Plush cushioning to help reduce injury and keep you running.',
            category: 'Running',
            price: 159,
            images: ['https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#f59e0b', '#7c2d12', '#111827']
          },
          {
            id: 'fallback-8',
            title: 'Air Max 90',
            description: 'Classic visible Air with everyday comfort.',
            category: 'Lifestyle',
            price: 129,
            images: ['https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#06b6d4', '#0e7490', '#0b1220']
          },
          {
            id: 'fallback-9',
            title: 'Air Huarache',
            description: 'Hug your foot with a snug neoprene sleeve.',
            category: 'Lifestyle',
            price: 119,
            images: ['https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#a78bfa', '#6d28d9', '#0b1220']
          },
          {
            id: 'fallback-10',
            title: 'ZoomX Vaporfly',
            description: 'Race‑day speed with responsive carbon plate.',
            category: 'Running',
            price: 249,
            images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop'],
            colors: ['#22c55e', '#14532d', '#0b1220']
          }
        ])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return { items, loading }
}

export default function NikeShowcase() {
  const { items } = useProducts()
  const [activeIndex, setActiveIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)
  const swiperRef = useRef(null)
  const bigTextRef = useRef(null)
  const bgRef = useRef(null)

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const slides = useMemo(() => {
    if (!items || items.length === 0) return []
    const arr = [...items]
    while (arr.length < 8) arr.push(...items)
    return arr.slice(0, 10)
  }, [items])

  const bgGradient = useMemo(() => {
    const shoe = slides[activeIndex]
    const cols = shoe?.colors || ['#0f172a', '#111827', '#334155']
    const base = cols[colorIndex % cols.length] || cols[0]
    const darker = shade(base, -40)
    const lighter = shade(base, 40)
    return gradientFromColors([darker, base, lighter])
  }, [slides, activeIndex, colorIndex])

  useEffect(() => {
    if (!bgRef.current) return
    if (prefersReduced) {
      bgRef.current.style.background = bgGradient
      return
    }
    gsap.to(bgRef.current, { duration: 0.8, ease: 'power2.out', background: bgGradient })
  }, [bgGradient, prefersReduced])

  const animateBigText = () => {
    if (!bigTextRef.current) return
    if (prefersReduced) return
    const tl = gsap.timeline()
    tl.to(bigTextRef.current, { x: -30, opacity: 0.0, duration: 0.25, ease: 'power1.out' })
      .set(bigTextRef.current, { x: 30 })
      .to(bigTextRef.current, { x: 0, opacity: 0.08, duration: 0.55, ease: 'power2.out' })
  }

  const onSlideChange = (idx) => {
    setActiveIndex(idx)
    setColorIndex(0)
    animateBigText()
  }

  // Tilt effect setup
  const containerRef = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 120, damping: 12, mass: 0.2 })
  const sy = useSpring(ry, { stiffness: 120, damping: 12, mass: 0.2 })
  const rotateX = useTransform(sy, [ -15, 15 ], [ 8, -8 ])
  const rotateY = useTransform(sx, [ -15, 15 ], [ -8, 8 ])

  const handleMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const dx = (x / rect.width) * 30 - 15
    const dy = (y / rect.height) * 30 - 15
    rx.set(dx)
    ry.set(dy)
  }
  const handleLeave = () => { rx.set(0); ry.set(0) }

  const handleImageError = (ev) => {
    const img = ev?.currentTarget
    if (!img) return
    if (img.dataset.fallbackApplied === 'true') return
    img.dataset.fallbackApplied = 'true'
    img.src = FALLBACK_IMAGE
  }

  const NikeSwoosh = ({ className = 'w-24 h-8' }) => (
    <svg viewBox="0 0 100 40" className={className} aria-hidden="true">
      <path fill="currentColor" d="M98.7 6.2c-5.4 2.3-36.7 16-63.2 27.3C22.7 38.6 15.6 40 10 37.8 5.8 36.1 3.4 33 3.1 29.3c-.5-5.9 4.8-11.6 13.3-14.3 3.6-1.1 7.4-1.7 11.4-1.6-5.3 1.5-9.1 3.8-11.3 6.5-2.8 3.4-2.2 6.5.9 7.9 3.4 1.6 9.8.7 19.5-3 24.7-9.4 50.4-18.7 61.8-23.3z" opacity=".18" />
    </svg>
  )

  const active = slides[activeIndex]

  return (
    <section ref={bgRef} className="relative min-h-[100svh] w-full overflow-hidden bg-[#0b1220] transition-[background] duration-700 will-change-[background]">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/90 to-white/40 shadow-[0_0_30px_rgba(255,255,255,0.35)]" />
            <span className="text-white font-black tracking-widest text-sm">NIKE AIR</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-white/80 text-sm">
            <a href="#" className="hover:text-white">New & Featured</a>
            <a href="#" className="hover:text-white">Men</a>
            <a href="#" className="hover:text-white">Women</a>
            <a href="#" className="hover:text-white">Kids</a>
          </div>
          <div className="text-white/80 text-sm">Free Shipping</div>
        </div>
      </div>

      {/* Big background text */}
      <div ref={bigTextRef} className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        <h2 className="text-[16vmin] sm:text-[18vmin] leading-none font-black tracking-tight text-white/10">
          NIKE AIR
        </h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10">
        {/* Slider */}
        <Swiper
          modules={[Navigation, Pagination, A11y, FreeMode, EffectCoverflow]}
          onSwiper={(s) => (swiperRef.current = s)}
          onSlideChange={(s) => onSlideChange(s.activeIndex)}
          slidesPerView={1}
          breakpoints={{ 640: { slidesPerView: 1 }, 1024: { slidesPerView: 1 } }}
          spaceBetween={24}
          centeredSlides
          loop
          grabCursor
          speed={600}
          resistanceRatio={0.85}
          touchRatio={1.1}
          followFinger
          longSwipesRatio={0.2}
          pagination={{ clickable: true }}
          coverflowEffect={{ rotate: 8, stretch: 0, depth: 120, modifier: 0.6, slideShadows: false }}
          className="[--swiper-pagination-color:theme(colors.white)]"
        >
          {slides.map((p, i) => (
            <SwiperSlide key={(p.id || i) + '-slide'}>
              <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[70vh]">
                {/* Visual */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div ref={containerRef} className="relative [perspective:1200px]" onMouseMove={handleMove} onMouseLeave={handleLeave}>
                    <motion.div
                      style={{ transformStyle: 'preserve-3d', rotateX, rotateY, willChange: 'transform' }}
                      whileHover={{ scale: 1.05, rotateZ: 0.15 }}
                      animate={prefersReduced ? {} : { y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: prefersReduced ? 0 : Infinity, ease: 'easeInOut' }}
                      className="relative rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_60px_140px_-50px_rgba(0,0,0,0.9)] overflow-hidden"
                    >
                      {/* Glow */}
                      <div className="absolute -inset-10 blur-3xl opacity-60"
                           style={{ background: `radial-gradient(60% 80% at 70% 30%, ${(p.colors?.[1]||'#2563eb')}55 0%, transparent 70%)`, transform: 'translateZ(-40px)' }} />

                      {/* Back box with Nike logo */}
                      <div className="relative p-6 sm:p-10" style={{ transform: 'translateZ(40px)' }}>
                        <div className="relative w-full rounded-2xl border border-white/10 bg-white/5/50 backdrop-blur-sm overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center text-white/15">
                            <NikeSwoosh className="w-40 h-12" />
                          </div>
                          <div className="p-3 sm:p-6">
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 h-10 sm:h-12 w-3/4 rounded-full blur-2xl" style={{ background: '#000', opacity: 0.3 }} />
                            <img
                              src={p.images?.[0] || FALLBACK_IMAGE}
                              onError={handleImageError}
                              alt={p.title}
                              className="relative z-10 w-full rounded-xl sm:rounded-2xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.65)] select-none will-change-[transform,filter]"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Rotating sheen */}
                      <motion.div
                        className="absolute inset-0"
                        style={{ background: `conic-gradient(from 0deg, transparent, ${(p.colors?.[0]||'#fff')}40, transparent 70%)`, mixBlendMode: 'screen', transform: 'translateZ(-20px)' }}
                        animate={prefersReduced ? {} : { rotate: [0, 180, 360] }}
                        transition={{ duration: 16, ease: 'linear', repeat: prefersReduced ? 0 : Infinity }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Details */}
                <div className="text-white">
                  <motion.h3
                    key={(p.id || i) + '-title'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-5xl font-black tracking-tight"
                  >
                    {p.title}
                  </motion.h3>
                  <div className="mt-2 text-white/70 text-sm">{p.category}</div>
                  <p className="mt-4 text-white/80 max-w-prose">{p.description}</p>

                  {/* Color selector */}
                  <div className="mt-6">
                    <div className="text-white/70 text-sm mb-2">Color</div>
                    <div className="flex items-center gap-3">
                      {(p.colors || ['#fff']).slice(0, 6).map((c, idx) => (
                        <button
                          key={`${p.id||i}-c-${idx}`}
                          onClick={() => setColorIndex(idx)}
                          className={`w-9 h-9 rounded-full border transition-transform duration-200 ease-out active:scale-95 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${idx === colorIndex ? 'ring-2 ring-white ring-offset-2 ring-offset-white/10 border-white' : 'border-white/30'}`}
                          style={{ backgroundColor: c }}
                          aria-label={`color ${idx+1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size selector */}
                  <div className="mt-6">
                    <div className="text-white/70 text-sm mb-2">Size</div>
                    <select className="bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2">
                      {[6,6.5,7,7.5,8,8.5,9,9.5,10,10.5,11,12].map((s) => (
                        <option key={s} value={s} className="bg-slate-900">{s} US</option>
                      ))}
                    </select>
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-8 flex items-center gap-4">
                    <span className="text-2xl font-extrabold bg-white text-gray-900 px-4 py-2 rounded-full shadow">${active?.price ?? p.price}</span>
                    <button className="px-6 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white font-semibold backdrop-blur transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
