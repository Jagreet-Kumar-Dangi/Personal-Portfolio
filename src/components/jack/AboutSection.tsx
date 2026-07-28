import { FadeIn } from "./FadeIn";
import { AnimatedText } from "./AnimatedText";
import { ContactButton } from "./ContactButton";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 gap-10 sm:gap-14 md:gap-16"
      style={{ background: "transparent", overflowX: "clip" }}
    >
      <FadeIn delay={0} y={40} className="text-center relative z-10">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          About me
        </h2>
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10 md:gap-12">
        <AnimatedText
          text="I am a 2nd-year B.Tech Computer Science & Engineering (AI & ML) undergraduate at Lovely Professional University. I am passionate about Artificial Intelligence, Full Stack Web Development, Cybersecurity, and Cloud Computing. I enjoy building practical software solutions, learning new technologies, and continuously improving my technical skills through hands-on projects."
          className="text-[#e8d5c4] font-medium text-center leading-relaxed max-w-[640px]"
          style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" }}
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <div
            className="text-[#f5a960] font-semibold uppercase tracking-wide"
            style={{ fontSize: "clamp(1rem, 2.2vw, 1.5rem)" }}
          >
            Education
          </div>
          <div
            className="text-[#e8d5c4] font-medium"
            style={{ fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)" }}
          >
            B.Tech CSE (AI &amp; ML) &mdash; Lovely Professional University
            (LPU), Punjab, India
          </div>
          <div
            className="text-[#f5a960]/80 font-semibold"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
          >
            Current CGPA: 9.33
          </div>
        </div>

        <ContactButton href="https://github.com/jagreetdangi" />
      </div>
    </section>
  );
}
