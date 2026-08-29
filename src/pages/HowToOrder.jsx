import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'BROWSE',
    subtitle: 'Find Your Perfect Piece',
    description: 'Explore our curated collection of luxury timepieces. Filter by style, price, or features to find the watch that speaks to you.',
    details: ['View high-resolution images', 'Read detailed specifications', 'Compare models side by side']
  },
  {
    number: '02',
    title: 'SELECT',
    subtitle: 'Make Your Choice',
    description: 'Select your preferred model and customization options. Each watch can be personalized to match your unique style.',
    details: ['Choose strap material', 'Select dial color', 'Add personal engraving']
  },
  {
    number: '03',
    title: 'ORDER',
    subtitle: 'Secure Checkout',
    description: 'Complete your purchase with our secure payment system. We accept all major credit cards and offer flexible financing.',
    details: ['Bank-level encryption', 'Multiple payment options', 'Flexible financing available']
  },
  {
    number: '04',
    title: 'RECEIVE',
    subtitle: 'Unbox Luxury',
    description: 'Your timepiece arrives in our signature packaging, complete with certification and warranty documentation.',
    details: ['Premium gift packaging', 'Certificate of authenticity', '5-year international warranty']
  },
]

const faqs = [
  { question: 'How long does shipping take?', answer: 'Express delivery takes 3-5 business days. Standard shipping is 7-14 business days worldwide.' },
  { question: 'Do you offer warranties?', answer: 'Yes, all OLAFLEX timepieces come with a 5-year international warranty covering manufacturing defects.' },
  { question: 'Can I return a watch?', answer: 'We offer a 30-day return policy for unworn timepieces in their original packaging.' },
  { question: 'Do you offer financing?', answer: 'Yes, we partner with leading financial institutions to offer 0% APR financing for up to 24 months.' },
]

export default function HowToOrder() {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen pt-24 bg-white">
      {/* Hero */}
      <section className="relative py-32 sm:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-white" />
        <div className="relative max-w-5xl mx-auto text-center px-5 sm:px-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="h-[1px] bg-brand-400 mx-auto mb-8"
          />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-brand-500 tracking-[0.3em] text-xs uppercase font-medium block mb-4"
          >
            Simple &amp; Secure
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-ink"
          >
            How to <span className="italic text-brand-500">Order</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-ink-muted text-lg md:text-xl max-w-2xl mx-auto"
          >
            Your journey to owning an OLAFLEX timepiece is just four simple steps away
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-surface-alt border border-border rounded-2xl p-8 md:p-10 hover:border-brand-400 hover:shadow-lg transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <span className="text-5xl md:text-7xl font-display font-bold text-brand-200 group-hover:text-brand-300 transition-colors duration-500">
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-display font-bold text-ink group-hover:text-brand-600 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-brand-500 text-sm tracking-wider font-medium">{step.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-ink-secondary text-base leading-relaxed mb-6">
                      {step.description}
                    </p>
                    <ul className="grid sm:grid-cols-3 gap-3">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-ink-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-brand-900 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-display text-4xl sm:text-5xl font-bold text-white"
            >
              Frequently Asked <span className="italic text-brand-400">Questions</span>
            </motion.h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/[0.15] transition-colors duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} className="text-brand-400 flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-6 pb-6 text-white/50 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-surface-alt rounded-3xl p-10 sm:p-16 text-center"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
              Start Your <span className="italic text-brand-500">Journey</span>
            </h2>
            <p className="text-ink-muted mt-4 mb-8 max-w-lg mx-auto">
              Browse our collection and find the perfect timepiece that matches your style
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-10 py-4 bg-brand-500 text-white font-bold tracking-wider text-sm uppercase hover:bg-brand-600 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25"
            >
              Start Shopping <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
