import { FadeIn } from "./FadeIn";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export function FooterSection() {
  return (
    <footer className="px-5 sm:px-8 md:px-10 pt-24 pb-10" id="contact">
      <div className="max-w-7xl mx-auto">
        {/* CTA */}
        <FadeIn y={40}>
          <h2
            className="
              hero-heading
              font-black
              uppercase
              leading-none
              tracking-tight
              text-white
              text-center
            "
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
            }}
          >
            Let's Build
            <br />
            Something Amazing
          </h2>
        </FadeIn>

        {/* Contact Button */}
        <FadeIn delay={0.2} y={30}>
          <div className="flex justify-center mt-12">
            <a
              href="https://github.com/jagreetdangi"
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-10 py-5
                rounded-full
                border border-white/10
                bg-white/[0.03]
                backdrop-blur-md
                text-white
                uppercase
                tracking-[0.25em]
                font-medium
                transition-all duration-300
                hover:bg-white/[0.08]
                hover:border-orange-500/30
                hover:-translate-y-1
              "
            >
              Get In Touch
            </a>
          </div>
        </FadeIn>

        {/* Socials */}
        <FadeIn delay={0.4} y={20}>
          <div className="flex justify-center gap-8 mt-12">
            <a
              href="https://github.com/jagreetdangi"
              target="_blank"
              rel="noreferrer"
              className="
                text-white/60
                hover:text-[#f5a960]
                hover:scale-110
                transition-all duration-300
              "
            >
              <FaGithub size={30} />
            </a>

            <a
              href="https://linkedin.com/in/jagreetdangi"
              target="_blank"
              rel="noreferrer"
              className="
                text-white/60
                hover:text-[#0A66C2]
                hover:scale-110
                transition-all duration-300
              "
            >
              <FaLinkedin size={30} />
            </a>

            <a
              href="mailto:jagreetdangi@example.com"
              className="
                text-white/60
                hover:text-[#f5a960]
                hover:scale-110
                transition-all duration-300
              "
            >
              <FaEnvelope size={30} />
            </a>
          </div>
        </FadeIn>

        {/* Divider */}
        <div className="h-px bg-orange-500/20 mt-16 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-white/40 text-sm">
            &copy; 2026 Jagreet Dangi. All rights reserved.
          </span>

          <span className="text-white/40 text-sm uppercase tracking-[0.2em]">
            Designed &amp; Developed by Jagreet Dangi
          </span>
        </div>
      </div>
    </footer>
  );
}
