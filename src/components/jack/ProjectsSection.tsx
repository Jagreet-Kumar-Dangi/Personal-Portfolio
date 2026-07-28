import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { LiveProjectButton } from "./LiveProjectButton";

interface Project {
  n: string;
  category: string;
  name: string;
  description: string;
  link: string;
}

const PROJECTS: Project[] = [
  {
    n: "01",
    category: "Web",
    name: "CineAura",
    description:
      "A responsive movie discovery web application featuring movie search and an intuitive UI. Built with React, TypeScript, Vite, Tailwind CSS, integrated with the OMDb API, and hosted on Firebase.",
    link: "https://github.com/jagreetdangi",
  },
  {
    n: "02",
    category: "Embedded / Hardware",
    name: "Underground Wire Fault Detection",
    description:
      "An embedded hardware and simulation project exploring techniques for detecting underground cable faults using the Resistance Method and Time Domain Reflectometry (TDR). Built using Arduino and simulated in Proteus. The implementation features custom threshold logic where an A0 analog reading between 600 to 1022 accurately identifies a fault at 15cm.",
    link: "https://github.com/jagreetdangi",
  },
  {
    n: "03",
    category: "Web",
    name: "Disaster Management Website",
    description:
      "A web application focused on disaster awareness and information management. Built with HTML, CSS, JavaScript, and Firebase.",
    link: "https://github.com/jagreetdangi",
  },
];

function ProjectCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;

  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div
      className="sticky top-24 md:top-32"
      style={{ top: `${index * 28 + 96}px` }}
    >
      <motion.div
        style={{ scale }}
        className="
          rounded-[40px] sm:rounded-[50px] md:rounded-[60px]
          border border-orange-500/10
          bg-[#0a0a0a]/90
          backdrop-blur-xl
          p-6 sm:p-8 md:p-10
          shadow-[0_0_60px_rgba(232,120,42,0.05)]
          transition-all duration-300
          hover:border-orange-500/20
          hover:shadow-[0_0_80px_rgba(232,120,42,0.1)]
        "
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-8 px-2 sm:px-4">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
            <div
              className="hero-heading font-black text-white/15"
              style={{
                fontSize: "clamp(3rem, 10vw, 140px)",
                lineHeight: 1,
              }}
            >
              {project.n}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[#f5a960]/60 uppercase tracking-[0.25em] text-xs sm:text-sm">
                {project.category}
              </span>

              <span
                className="text-white font-medium uppercase"
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.75rem)",
                }}
              >
                {project.name}
              </span>
            </div>
          </div>

          <LiveProjectButton href={project.link} />
        </div>

        {/* Description */}
        <div className="px-2 sm:px-4">
          <p
            className="text-[#e8d5c4]/70 font-light leading-relaxed max-w-3xl"
            style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)" }}
          >
            {project.description}
          </p>
        </div>

        {project.n === "02" && (
          <div className="mt-6 px-2 sm:px-4">
            <span className="text-[#f5a960]/50 text-xs uppercase tracking-[0.2em]">
              Collaborators: Pragati, Sanchayeeta Rout, Soumya Ray
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="
        px-5 sm:px-8 md:px-10
        py-20 sm:py-24 md:py-32
        bg-transparent
      "
    >
      <FadeIn y={40} className="text-center mb-16 sm:mb-20 md:mb-28">
        <h2
          className="
            hero-heading
            font-black
            uppercase
            leading-none
            tracking-tight
            text-white
          "
          style={{
            fontSize: "clamp(3rem, 12vw, 160px)",
          }}
        >
          Projects
        </h2>
      </FadeIn>

      <div className="max-w-7xl mx-auto">
        {PROJECTS.map((project, index) => (
          <div key={project.n} className="h-[70vh]">
            <ProjectCard
              project={project}
              index={index}
              total={PROJECTS.length}
              progress={scrollYProgress}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
