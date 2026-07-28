import { FadeIn } from "./FadeIn";
import { ContactButton } from "./ContactButton";

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Contact"];

export function HeroSection() {
  return (
    <section
      className="h-screen flex flex-col relative"
      style={{ overflowX: "clip" }}
    >
      {/* Navbar */}
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8 relative z-20"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            className="
              text-[#f5a960]
              font-medium
              uppercase
              tracking-wider
              text-sm
              md:text-lg
              lg:text-[1.4rem]
              hover:opacity-70
              transition-opacity duration-200
            "
          >
            {link}
          </a>
        ))}
      </FadeIn>

      {/* Title */}
      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5 px-2">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="
              hero-heading
              font-black
              italic
              uppercase
              tracking-tight
              leading-none
              whitespace-nowrap
              w-full
              text-[14vw]
              sm:text-[15vw]
              md:text-[16vw]
              lg:text-[17.5vw]
            "
          >
            JAGREET DANGI
          </h1>
        </FadeIn>
      </div>

      {/* Description + Button */}
      <div
        className="
          mt-auto
          flex
          justify-between
          items-end
          pb-7
          sm:pb-8
          md:pb-10
          px-6
          md:px-10
          relative
          z-20
        "
      >
        <FadeIn delay={0.35} y={20}>
          <p
            className="
              text-[#f5a960]
              font-light
              uppercase
              tracking-wide
              leading-snug
              max-w-[260px]
              sm:max-w-[340px]
              md:max-w-[420px]
            "
            style={{
              fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)",
            }}
          >
            Artificial Intelligence &amp; Machine Learning Engineer | Full Stack
            Developer
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton href="https://github.com/jagreetdangi" />
        </FadeIn>
      </div>
    </section>
  );
}
