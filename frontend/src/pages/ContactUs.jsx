import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBook,
  FaHeart,
  FaUsers,
  FaPaperPlane,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-toastify";

/* ── animation helpers ─────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:  { once: true },
  transition:{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const stagger = {
  initial:   {},
  whileInView: {},
  viewport:  { once: true },
  transition:{ staggerChildren: 0.12 },
};

const PILLARS = [
  {
    icon: FaBook,
    title: "Our Mission",
    text:  "We're dedicated to making quality books accessible to everyone. Our platform connects readers with their next favourite read.",
  },
  {
    icon: FaHeart,
    title: "What We Offer",
    text:  "A curated collection of books, personalised recommendations, and a seamless experience for every book lover.",
  },
  {
    icon: FaUsers,
    title: "Our Community",
    text:  "Join thousands of readers, share your thoughts, and discover new perspectives through the enduring power of books.",
  },
];

const INFO = [
  { icon: FaEnvelope, label: "Email",    value: "support@libraryofheaven.com", href: "mailto:support@libraryofheaven.com" },
  { icon: FaPhone,    label: "Phone",    value: "+1 (555) 123-4567",           href: "tel:+15551234567"                  },
  { icon: FaMapMarkerAlt, label:"Address", value:"123 Book Street, Reading City",href: null                              },
  { icon: FaClock,    label: "Hours",    value: "Mon – Sat · 9 AM – 6 PM",     href: null                               },
];

const ContactUs = () => {
  const [form, setForm]           = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message sent! We'll be in touch soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 transition-colors duration-300">

      {/* ── Hero ────────────────────────────────── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-wine-600/8 dark:bg-wine-500/6 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-toffee-500/10 dark:bg-toffee-400/6 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p className="section-subheading mb-4" {...fadeUp(0)}>
            Get in Touch
          </motion.p>
          <motion.h1
            className="font-serif text-5xl md:text-6xl font-bold text-parchment-900 dark:text-parchment-100 mb-6 leading-tight"
            {...fadeUp(0.1)}
          >
            We&apos;d Love to{" "}
            <span className="italic text-wine-600 dark:text-wine-400">Hear</span>{" "}
            from You
          </motion.h1>
          <motion.p
            className="font-sans text-lg text-toffee-700 dark:text-parchment-400 max-w-2xl mx-auto leading-relaxed"
            {...fadeUp(0.2)}
          >
            Whether you have a question, feedback, or just want to say hello — our
            team is always happy to help.
          </motion.p>
        </div>
      </section>

      {/* ── About pillars ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          {...stagger}
        >
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              className="group bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 p-7 shadow-card dark:shadow-card-dark hover:border-wine-400 dark:hover:border-wine-700 hover:shadow-card-hover transition-all duration-300 cursor-default"
              {...fadeUp()}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-12 h-12 rounded-xl bg-wine-600/10 dark:bg-wine-500/15 flex items-center justify-center mb-5 group-hover:bg-wine-600/20 transition-colors duration-300">
                <Icon className="w-5 h-5 text-wine-600 dark:text-wine-400" />
              </div>
              <h3 className="font-serif text-lg font-bold text-parchment-900 dark:text-parchment-100 mb-2">{title}</h3>
              <p className="font-sans text-sm text-toffee-700 dark:text-parchment-400 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Contact info + Form ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Info column */}
          <motion.div className="lg:col-span-2 space-y-4" {...fadeUp(0.1)}>
            <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card p-7">
              <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100 mb-6">
                Contact Details
              </h2>
              <div className="space-y-5">
                {INFO.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-wine-600/10 dark:bg-wine-500/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-wine-600 dark:text-wine-400" />
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold text-toffee-600 dark:text-toffee-400 uppercase tracking-widest mb-0.5" style={{ letterSpacing: "0.1em" }}>
                        {label}
                      </p>
                      {href ? (
                        <a href={href} className="font-sans text-sm text-parchment-800 dark:text-parchment-200 hover:text-wine-600 dark:hover:text-wine-400 transition-colors duration-200">
                          {value}
                        </a>
                      ) : (
                        <p className="font-sans text-sm text-parchment-800 dark:text-parchment-200">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote card */}
            <div className="bg-gradient-wine rounded-2xl p-7 shadow-glow-wine">
              <blockquote className="font-serif text-xl italic text-parchment-100 leading-relaxed mb-4">
                &quot;Not all those who wander are lost… but they do find the best books.&quot;
              </blockquote>
              <p className="font-sans text-xs text-wine-200 tracking-wide">— Library of Heaven Team</p>
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div className="lg:col-span-3" {...fadeUp(0.2)}>
            <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card p-7 md:p-10">
              <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100 mb-2">
                Send a Message
              </h2>
              <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 mb-8">
                Fill out the form and we&apos;ll respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="field-label" htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Austen"
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="field-label" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what's on your mind…"
                    required
                    rows={5}
                    className="input-field resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={[
                    "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-sans font-semibold text-sm text-parchment-50 tracking-wide shadow-md transition-all duration-300",
                    isSubmitting
                      ? "bg-wine-400 cursor-not-allowed"
                      : "bg-wine-600 hover:bg-wine-700 hover:shadow-glow-wine",
                  ].join(" ")}
                  whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaPaperPlane className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Sending…" : "Send Message"}
                </motion.button>
              </form>
            </div>
          </motion.div>

        </div>
      </section>

    </div>
  );
};

export default ContactUs;
