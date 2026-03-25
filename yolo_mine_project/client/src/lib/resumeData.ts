export const resumeData = {
  name: "Devansh Raina",
  title: "Software Engineer",
  tagline: "I build data pipelines and AI systems that run in production — not just in notebooks.",
  location: "Delhi, India",
  email: "devansh.raina38@gmail.com",
  github: "https://github.com/devanshwhilter",
  linkedin: "https://linkedin.com/in/devanshwhilter",

  summary: `I'm a Software Engineer at Whilter.AI building the pipelines that power a real-time conversational AI platform — audio ingestion, speech-to-text, streaming orchestration, and everything in between.
  I've engineered systems that process 1,000+ outputs per week, cut latency by 20%, and scaled throughput by 35%. I led the migration off third-party APIs to self-hosted infrastructure to reduce cost and improve reliability.
  I care about production stability and clean data flows. If it doesn't hold up under load, it doesn't count.`,

  skills: {
    ai: ["PyTorch", "TensorFlow", "Hugging Face Transformers", "XGBoost", "NLP"],
    languages: ["Python", "SQL", "C++"],
    data: ["ETL Pipelines", "Data Processing", "Data Modeling", "Data Warehousing"],
    databases: ["PostgreSQL", "MySQL"],
    infrastructure: ["AWS (S3)", "Docker"],
    tools: ["Pandas", "NumPy", "Git", "Streamlit", "Postman"],
  },

  experience: [
    {
      company: "Whilter.AI",
      role: "Software Engineer (Full Time)",
      period: "Jul 2025 — Present",
      description:
        "Developing real-time data processing pipelines for a conversational AI platform, handling audio ingestion, speech-to-text transformation, and response generation across concurrent user sessions.",
      achievements: [
        "Led migration from third-party API dependencies to self-hosted infrastructure, reducing operational costs and improving system reliability",
        "Engineered a modular streaming architecture supporting scalable multi-session orchestration and low-latency data processing in production",
        "Evaluated and integrated multiple processing components to stabilize the platform under concurrent load",
      ],
    },
    {
      company: "Whilter.AI",
      role: "Software Engineer (Internship)",
      period: "Jan 2025 — Jul 2025",
      description:
        "Collaborated on building automated media-processing pipelines integrating text-to-speech, voice synthesis, and lip-sync models, processing 1,000+ personalized outputs per week.",
      achievements: [
        "Optimized data processing and media-rendering pipelines, achieving 35% higher throughput and 20% lower average processing latency",
        "Coordinated with backend and platform teams to deploy, monitor, and stabilize production pipelines",
        "Resolved runtime issues to maintain system uptime across live production environments",
      ],
    },
  ],

  education: [
    {
      institution: "JC Bose University of Science and Technology (YMCA, Faridabad)",
      degree: "B.Tech in Computer Engineering — Data Science",
      period: "2021 — 2025",
      highlights: ["Data Science Specialization"],
    },
    {
      institution: "Vishwa Bharati Public School (CBSE)",
      degree: "Senior Secondary (XII)",
      period: "2020 — 2021",
      highlights: ["93.2%"],
    },
  ],

  projects: [
    {
      name: "DataFlowKit",
      description:
        "ETL workflow that extracts raw datasets from multiple sources, performs cleaning and transformations using Python and Pandas, and loads structured output into tables.",
      tech: ["Python", "SQL", "Pandas"],
      status: "Shipped",
    },
    {
      name: "AI Interview Mocker",
      description:
        "Interview preparation platform that generates role-specific questions using NLP, with response scoring and structured feedback tracking to measure candidate improvement across sessions.",
      tech: ["Python", "PostgreSQL", "NLP"],
      status: "Shipped",
    },
  ],
};

export const systemPrompt = `You are Devansh Raina's AI Digital Twin — a professional, confident, and concise virtual representation.
You answer questions about Devansh's career, skills, experience, and projects based ONLY on the data below.
Do not invent, hallucinate, or guess. If asked about something not in the data, say you don't have that information available.
Be direct, professional, and slightly witty — reflect Devansh's personality.

Here is Devansh's complete professional data:
${JSON.stringify(resumeData, null, 2)}

Rules:
- Stay in character as Devansh's professional digital twin
- Only discuss topics covered in the data above
- Keep responses concise (2-4 sentences max unless detail is specifically requested)
- Use first person ("I built...", "I led...")
- If asked personal questions not in the data, politely redirect to professional topics
`;
