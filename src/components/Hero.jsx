import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <motion.div
          className="absolute -top-24 -right-24 w-[40rem] h-[40rem] bg-blue-200/40 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] bg-indigo-200/40 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <motion.h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Elevate Every Step
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover the latest Nike collection at Meer Shoes. Smooth, modern and made for motion.
          </motion.p>

          <motion.div
            className="mt-8 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/shop"
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition"
            >
              Shop Nike
            </Link>
            <a
              href="#collections"
              className="px-6 py-3 rounded-full bg-white text-gray-800 font-semibold border border-gray-200 hover:bg-gray-50"
            >
              Explore
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80&auto=format&fit=crop"
            alt="Nike shoe"
            className="w-full rounded-3xl shadow-2xl"
          />
          <motion.div
            className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm text-gray-600">Featured: Nike Air Max</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
