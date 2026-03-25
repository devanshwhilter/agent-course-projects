import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { resumeData } from "@/lib/resumeData";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

const LINKS = [
  {
    icon: Github,
    label: "GitHub",
    sub: "github.com/devanshwhilter",
    href: resumeData.github,
    color: "hover:border-white/30 hover:text-white",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    sub: "linkedin.com/in/devanshraina",
    href: resumeData.linkedin,
    color: "hover:border-[#0a66c2]/60 hover:text-[#0a66c2]",
  },
  {
    icon: Mail,
    label: "Email",
    sub: resumeData.email,
    href: `mailto:${resumeData.email}`,
    color: "hover:border-[var(--p-accent)]/60 hover:text-[var(--p-accent)]",
  },
];

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="py-28 relative overflow-hidden" ref={ref} data-testid="section-contact">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--p-accent)]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <p className="text-[var(--p-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            04 / Contact
          </p>
          <h2 className="text-5xl font-bold tracking-tight mb-6">
            Let&apos;s build something
            <br />
            <span className="gradient-text">remarkable.</span>
          </h2>
          <p className="text-[var(--p-muted)] leading-relaxed">
            I&apos;m always interested in new opportunities, challenging problems,
            and conversations with people building at the frontier. Don&apos;t hesitate to reach out.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto mb-16">
          {LINKS.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className={`group relative flex flex-col items-center gap-4 p-8 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]/25 transition-all duration-300 text-center ${link.color}`}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid={`link-contact-${link.label.toLowerCase()}`}
            >
              <div className="w-12 h-12 rounded-2xl border border-[var(--p-border)] group-hover:border-current flex items-center justify-center transition-colors duration-300">
                <link.icon size={20} />
              </div>
              <div>
                <p className="font-semibold">{link.label}</p>
                <p className="text-xs text-[var(--p-muted)] mt-1 group-hover:text-current/70 transition-colors">
                  {link.sub}
                </p>
              </div>
              <ArrowUpRight
                size={14}
                className="absolute top-4 right-4 invisible group-hover:visible transition-all duration-300"
              />
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center border-t border-[var(--p-border)] pt-12"
        >
          <p className="text-xs font-mono text-[var(--p-muted)] tracking-wider">
            Built with React · TypeScript · Tailwind · Framer Motion
          </p>
          <p className="text-xs text-[var(--p-muted)]/50 mt-2">
            {resumeData.name} &copy; {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
