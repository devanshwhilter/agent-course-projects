import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { resumeData } from "@/lib/resumeData";
import { CheckCircle2 } from "lucide-react";

export default function Timeline() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="journey" className="py-28 relative overflow-hidden" ref={ref} data-testid="section-journey">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-[var(--p-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            02 / Career Journey
          </p>
          <h2 className="text-5xl font-bold tracking-tight">
            The path to
            <br />
            <span className="gradient-text">where I am now.</span>
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--p-accent)] via-[var(--p-accent-2)] to-transparent"
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />

          <div className="space-y-10 ml-8 md:ml-24">
            {resumeData.experience.map((exp, i) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                className="relative group"
                data-testid={`experience-item-${i}`}
              >
                <motion.div
                  className="absolute -left-[3.15rem] md:-left-[5.6rem] top-1.5 w-3 h-3 rounded-full bg-[var(--p-accent)] ring-4 ring-background group-hover:scale-150 transition-transform duration-300"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                />

                <div className="p-6 md:p-8 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]/25 hover:border-[var(--p-accent)]/40 hover:bg-[var(--p-surface)]/50 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                      <p className="text-[var(--p-accent)] font-medium text-sm">{exp.company}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[var(--p-accent)]/10 border border-[var(--p-accent)]/20 text-[var(--p-accent)] text-xs font-mono">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-[var(--p-muted)] text-sm leading-relaxed mb-5">
                    {exp.description}
                  </p>

                  <ul className="space-y-3">
                    {exp.achievements.map((achievement, ai) => (
                      <motion.li
                        key={ai}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.6 + i * 0.15 + ai * 0.07 }}
                        className="flex items-start gap-3 text-sm"
                        data-testid={`achievement-${i}-${ai}`}
                      >
                        <CheckCircle2
                          size={15}
                          className="text-[var(--p-accent)] mt-0.5 flex-shrink-0"
                        />
                        <span className="text-foreground/80 leading-relaxed">{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}

            {resumeData.education.map((edu, i) => (
              <motion.div
                key={edu.institution}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + (resumeData.experience.length + i) * 0.15 }}
                className="relative group"
                data-testid={`education-item-${i}`}
              >
                <motion.div
                  className="absolute -left-[3.15rem] md:-left-[5.6rem] top-1.5 w-3 h-3 rounded-full bg-[var(--p-accent-2)] ring-4 ring-background group-hover:scale-150 transition-transform duration-300"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.7, type: "spring" }}
                />

                <div className="p-6 md:p-8 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)]/15 hover:border-[var(--p-accent-2)]/40 transition-all duration-300">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{edu.degree}</h3>
                      <p className="text-[var(--p-accent-2)] font-medium text-sm">{edu.institution}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[var(--p-accent-2)]/10 border border-[var(--p-accent-2)]/20 text-[var(--p-accent-2)] text-xs font-mono">
                      {edu.period}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {edu.highlights.map((h) => (
                      <span
                        key={h}
                        className="px-2.5 py-1 rounded-full text-xs border border-[var(--p-border)] text-[var(--p-muted)]"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
