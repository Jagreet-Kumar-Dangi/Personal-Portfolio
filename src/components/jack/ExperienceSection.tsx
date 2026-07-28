import { FadeIn } from "./FadeIn";

const EXPERIENCES = [
  {
    title: "Junior Assistant (Part-Time)",
    organization: "Kumar Associate",
    details: [
      "CCTV inventory management",
      "IT documentation",
      "Office administration and technical support",
    ],
  },
];

const STRENGTHS = [
  "Problem Solving",
  "Analytical Thinking",
  "Fast Learner",
  "Adaptability",
];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: "transparent", overflowX: "clip" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <FadeIn y={40} className="text-center mb-16 sm:mb-20 md:mb-24">
          <h2
            className="
              hero-heading
              font-black
              uppercase
              leading-none
              tracking-tight
              text-white
            "
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            Experience
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {/* Work Experience */}
          <div>
            <h3
              className="text-[#f5a960] font-semibold uppercase tracking-wider mb-8"
              style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
            >
              Work Experience
            </h3>

            <div className="flex flex-col gap-6">
              {EXPERIENCES.map((exp, i) => (
                <FadeIn key={exp.title} delay={i * 0.15} y={20}>
                  <div
                    className="
                      rounded-[24px]
                      border border-orange-500/10
                      bg-white/[0.02]
                      backdrop-blur-sm
                      p-6
                      transition-all duration-300
                      hover:border-orange-500/20
                      hover:bg-white/[0.04]
                    "
                  >
                    <div
                      className="text-[#e8d5c4] font-semibold"
                      style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)" }}
                    >
                      {exp.title}
                    </div>

                    <div className="text-[#f5a960]/60 text-sm uppercase tracking-[0.15em] mt-1 mb-4">
                      {exp.organization}
                    </div>

                    <ul className="flex flex-col gap-2">
                      {exp.details.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2 text-[#e8d5c4]/70 text-sm"
                        >
                          <span className="text-[#f5a960] shrink-0 mt-[0.35em] block w-1.5 h-1.5 rounded-full bg-[#f5a960]/60" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div>
            <h3
              className="text-[#f5a960] font-semibold uppercase tracking-wider mb-8"
              style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
            >
              Strengths
            </h3>

            <FadeIn delay={0.2} y={20}>
              <div
                className="
                  rounded-[24px]
                  border border-orange-500/10
                  bg-white/[0.02]
                  backdrop-blur-sm
                  p-6
                  transition-all duration-300
                  hover:border-orange-500/20
                  hover:bg-white/[0.04]
                "
              >
                <div className="flex flex-wrap gap-3">
                  {STRENGTHS.map((s) => (
                    <span
                      key={s}
                      className="
                        px-4 py-2
                        rounded-full
                        border border-orange-500/20
                        bg-[#f5a960]/[0.08]
                        text-[#e8d5c4]
                        text-sm
                        font-medium
                        transition-all duration-300
                        hover:bg-[#f5a960]/[0.15]
                        hover:border-orange-500/40
                        hover:text-[#f5a960]
                      "
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
