import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { resumeData } from "@/lib/resumeData";
import { Code2, Cpu, Database, Zap } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Database,
    label: "Pipeline Craftsman",
    desc: "I build ETL and streaming systems that handle production load — reliability and throughput over novelty.",
  },
  {
    icon: Code2,
    label: "Data-First Thinking",
    desc: "Every system decision starts with data structure, flow, and quality — because bad pipelines ruin everything downstream.",
  },
  {
    icon: Zap,
    label: "Production-Focused",
    desc: "I care about uptime, latency, and stability. Systems that hold up under concurrent load, not just demos.",
  },
  {
    icon: Cpu,
    label: "AI / ML Integration",
    desc: "From NLP pipelines to speech-to-text systems, I bridge the gap between raw data and intelligent applications.",
  },
];

function SkillPill({ skill }: { skill: string }) {
  return (
    <motion.span
      className="px-3 py-1.5 rounded-full text-xs font-mono border border-[var(--p-border)] text-[var(--p-muted)] hover:border-[var(--p-accent)] hover:text-[var(--p-accent)] transition-all duration-200 cursor-default"
      whileHover={{ scale: 1.05, y: -1 }}
      data-testid={`skill-pill-${skill}`}
    >
      {skill}
    </motion.span>
  );
}

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-28 relative overflow-hidden" ref={ref} data-testid="section-about">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[var(--p-accent)] font-mono text-sm tracking-widest uppercase mb-3">
            01 / About
          </p>
          <h2 className="text-5xl font-bold tracking-tight">
            Not just another
            <br />
            <span className="gradient-text">engineer.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-8"
          >
            <p className="text-foreground leading-relaxed text-lg">
              {resumeData.summary}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {HIGHLIGHTS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="p-5 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)]/40 hover:border-[var(--p-accent)]/50 group transition-all duration-300"
                  whileHover={{ y: -3 }}
                  data-testid={`highlight-card-${i}`}
                >
                  <item.icon
                    size={20}
                    className="text-[var(--p-accent)] mb-3 group-hover:scale-110 transition-transform"
                  />
                  <h3 className="font-semibold text-sm mb-2">{item.label}</h3>
                  <p className="text-xs text-[var(--p-muted)] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="space-y-8"
          >
            {Object.entries(resumeData.skills).map(([category, skills], ci) => (
              <motion.div
                key={category}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 + ci * 0.1 }}
              >
                <p className="text-xs font-mono tracking-widest uppercase text-[var(--p-muted)] mb-3 capitalize">
                  {category === "ai" ? "AI / ML" : category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillPill key={skill} skill={skill} />
                  ))}
                </div>
              </motion.div>
            ))}

            <div className="pt-6 border-t border-[var(--p-border)]">
              <div className="flex items-center gap-10 text-sm text-[var(--p-muted)]">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider block mb-1">Based in</span>
                  <p className="font-medium text-foreground">{resumeData.location}</p>
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider block mb-1">Status</span>
                  <p className="font-medium text-green-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Open to work
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
