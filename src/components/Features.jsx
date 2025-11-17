import { motion } from 'framer-motion'

const features = [
  {
    title: 'Featherweight',
    desc: 'Advanced materials reduce weight while increasing durability.',
  },
  {
    title: 'Cushion + Air',
    desc: 'Responsive foam and visible Air for soft landings.',
  },
  {
    title: 'Everyday Grip',
    desc: 'Updated outsole pattern keeps you sure‑footed in any condition.',
  },
]

export default function Features() {
  return (
    <section id="collections" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Built For Motion
        </motion.h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
