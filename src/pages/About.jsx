import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-4xl font-extrabold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            About Meer Shoes
          </motion.h1>
          <motion.p
            className="mt-6 text-gray-700 leading-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            We craft a smooth shopping experience with a love for movement. Our focus is Nike footwear—where design, comfort and performance meet. Browse our curated picks and feel the difference underfoot.
          </motion.p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
