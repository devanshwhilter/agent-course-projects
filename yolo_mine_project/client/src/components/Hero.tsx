import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";
import { resumeData } from "@/lib/resumeData";
import { useEffect, useRef } from "react";

const WORDS = ["Data Engineer", "Pipeline Architect", "AI Developer", "Systems Builder"];

function RotatingWords() {
  return (
    <div className="overflow-hidden h-[1.2em] w-full flex justify-center">
      <motion.div
        className="w-full"
        animate={{ y: ["0%", "-100%", "-200%", "-300%", "-400%"] }}
        transition={{
          duration: 8,
          times: [0, 0.2, 0.45, 0.65, 0.85],
          repeat: Infinity,
          repeatDelay: 1,
          ease: "easeInOut",
        }}
      >
        {[...WORDS, WORDS[0]].map((word, i) => (
          <div key={i} className="h-[1.2em] flex items-center justify-center">
            <span className="gradient-text">{word}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const orbX = useTransform(springX, [0, 1], [-30, 30]);
  const orbY = useTransform(springY, [0, 1], [-30, 30]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden noise-bg grid-overlay"
      data-testid="section-hero"
    >
      <motion.div
        style={{ x: orbX, y: orbY }}
        className="absolute inset-0 pointer-events-none"
      >
        <FloatingOrb className="w-[600px] h-[600px] bg-indigo-500 top-1/4 -left-40" />
        <FloatingOrb className="w-[400px] h-[400px] bg-purple-500 bottom-1/4 -right-20" />
        <FloatingOrb className="w-[300px] h-[300px] bg-pink-500 top-1/3 right-1/3" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={item} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--p-accent)]/30 bg-[var(--p-accent)]/10 text-[var(--p-accent)] text-sm font-medium">
              <Sparkles size={14} className="animate-pulse" />
              Available for opportunities
            </span>
          </motion.div>

          <motion.div variants={item} className="mb-6">
            <p className="text-[var(--p-muted)] font-mono text-sm tracking-[0.3em] uppercase mb-4">
              Hello, I&apos;m
            </p>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-none glow-text">
              {resumeData.name.split(" ")[0]}
              <br />
              <span className="text-[var(--p-muted)]">{resumeData.name.split(" ")[1]}</span>
            </h1>
          </motion.div>

          <motion.div
            variants={item}
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 w-full"
          >
            <RotatingWords />
          </motion.div>

          <motion.p
            variants={item}
            className="text-lg text-[var(--p-muted)] max-w-2xl leading-relaxed mb-10 mx-auto"
          >
            {resumeData.tagline}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href="#about"
              className="px-8 py-3.5 rounded-full bg-[var(--p-accent)] text-white font-semibold text-sm tracking-wide hover:bg-[var(--p-accent-2)] transition-all duration-300 glow"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              data-testid="link-explore-work"
            >
              Explore My Work
            </motion.a>
            <motion.a
              href="#contact"
              className="px-8 py-3.5 rounded-full border border-[var(--p-border)] text-foreground font-semibold text-sm tracking-wide hover:border-[var(--p-accent)] hover:text-[var(--p-accent)] transition-all duration-300"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              data-testid="link-get-in-touch"
            >
              Get In Touch
            </motion.a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-20 grid grid-cols-3 gap-8 max-w-sm mx-auto"
            data-testid="stats-container"
          >
            {[
              { value: "1K+", label: "Outputs / week" },
              { value: "35%", label: "Throughput gain" },
              { value: "2", label: "Pipelines in prod" },
            ].map((stat) => (
              <div key={stat.label} data-testid={`stat-${stat.label}`}>
                <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-[var(--p-muted)] mt-1.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--p-muted)] hover:text-[var(--p-accent)] transition-colors duration-200 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        data-testid="button-scroll-down"
        aria-label="Scroll to about section"
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
