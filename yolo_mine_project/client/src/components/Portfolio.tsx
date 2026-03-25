import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { resumeData } from "@/lib/resumeData";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  "Open Source": "text-green-400 border-green-400/30 bg-green-400/10",
  "Production": "text-blue-400 border-blue-400/30 bg-blue-400/10",
  "Shipped": "text-purple-400 border-purple-400/30 bg-purple-400/10",
};

export default function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="portfolio" className="py-28 relative overflow-hidden" ref={ref} data-testid="section-portfolio">
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[var(--p-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            03 / Portfolio
          </p>
          <h2 className="text-5xl font-bold tracking-tight">
            Things I&apos;ve
            <br />
            <span className="gradient-text">shipped.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {resumeData.projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              className="group relative p-6 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]/25 hover:border-[var(--p-accent)]/50 hover:bg-[var(--p-surface)]/50 transition-all duration-300 overflow-hidden flex flex-col"
              whileHover={{ y: -6 }}
              data-testid={`project-card-${project.name}`}
            >
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col flex-1">
                <span className={`inline-block self-start px-2.5 py-1 rounded-full text-xs font-mono border mb-5 ${STATUS_STYLES[project.status] ?? "text-gray-400 border-gray-400/30 bg-gray-400/10"}`}>
                  {project.status}
                </span>

                <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--p-accent)] transition-colors">
                  {project.name}
                </h3>

                <p className="text-sm text-[var(--p-muted)] leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded text-xs font-mono bg-background border border-[var(--p-border)] text-[var(--p-muted)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs text-[var(--p-accent)] font-medium invisible group-hover:visible transition-all duration-300">
                  View project
                  <ArrowUpRight size={12} />
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + resumeData.projects.length * 0.12 }}
            className="p-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-transparent flex flex-col items-center justify-center text-center min-h-[240px] hover:border-[var(--p-accent)]/40 transition-colors"
            data-testid="project-card-coming-soon"
          >
            <div className="w-10 h-10 rounded-full border border-dashed border-[var(--p-border)] flex items-center justify-center mb-4 text-[var(--p-muted)]">
              <span className="text-xl leading-none">+</span>
            </div>
            <p className="text-sm text-[var(--p-muted)]">More projects coming soon</p>
            <p className="text-xs text-[var(--p-muted)]/60 mt-1">This section is dynamically scalable</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <a
            href={resumeData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-[var(--p-border)] hover:border-[var(--p-accent)] text-[var(--p-muted)] hover:text-[var(--p-accent)] transition-all duration-300 text-sm font-medium group"
            data-testid="link-github"
          >
            <Github size={16} />
            View all projects on GitHub
            <ExternalLink size={12} className="invisible group-hover:visible transition-all" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
