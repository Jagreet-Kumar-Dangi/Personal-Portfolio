import { FadeIn } from "./FadeIn";

interface SkillCategory {
  title: string;
  skills: string[];
}

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    skills: [
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "OpenCV",
      "CNNs",
      "Swin Transformer",
      "ResNet",
      "Computer Vision",
    ],
  },
  {
    title: "Programming Languages",
    skills: ["Python", "C", "Java", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: "Web Development",
    skills: [
      "React",
      "Tailwind CSS",
      "Vite",
      "HTML5",
      "CSS3",
      "FastAPI",
      "Firebase (Hosting & Firestore)",
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "PyCharm",
      "Arduino IDE",
      "Proteus",
      "Linux/Ubuntu",
      "Anaconda",
    ],
  },
];

export function SkillsSection() {
  return (
    <section
      id="skills"
      className="py-24 overflow-hidden"
      style={{ background: "transparent" }}
    >
      <FadeIn y={40}>
        <h2
          className="
            hero-heading
            font-black
            uppercase
            leading-none
            tracking-tight
            text-center
            text-white
            mb-20
          "
          style={{
            fontSize: "clamp(3rem, 12vw, 160px)",
          }}
        >
          Skills
        </h2>
      </FadeIn>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SKILL_CATEGORIES.map((category, catIndex) => (
            <FadeIn key={category.title} delay={catIndex * 0.1} y={30}>
              <div
                className="
                  rounded-[30px]
                  border border-orange-500/10
                  bg-white/[0.02]
                  backdrop-blur-sm
                  p-6 sm:p-8
                  transition-all duration-300
                  hover:border-orange-500/20
                  hover:bg-white/[0.04]
                  hover:shadow-[0_0_40px_rgba(232,120,42,0.06)]
                "
              >
                <h3
                  className="text-[#f5a960] font-semibold uppercase tracking-wider mb-5"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
                >
                  {category.title}
                </h3>

                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="
                        px-4 py-2
                        rounded-full
                        border border-orange-500/15
                        bg-[#f5a960]/[0.06]
                        text-[#e8d5c4]
                        text-sm
                        font-medium
                        transition-all duration-300
                        hover:bg-[#f5a960]/[0.12]
                        hover:border-orange-500/30
                        hover:text-[#f5a960]
                      "
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
