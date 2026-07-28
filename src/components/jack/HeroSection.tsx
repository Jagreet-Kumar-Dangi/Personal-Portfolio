import { FadeIn } from "./FadeIn";
import { Magnet } from "./Magnet";
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
        className="flex items-center justify-between px-4 md:px-10 pt-6 md:pt-8 relative z-20"
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
              text-[0.65rem]
              sm:text-sm
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
      <div className="px-4 mt-8 sm:mt-10">
        <FadeIn delay={0.15} y={40}>
          <h1
            className="
              hero-heading
              font-black
              italic
              uppercase
              tracking-tight
              leading-[0.85]
              text-center
            "
            style={{
              fontSize: "clamp(3.2rem, 20vw, 10rem)",
            }}
          >
            JAGREET DANGI
          </h1>
        </FadeIn>
      </div>

      {/* Portrait */}
      <div className="relative flex justify-center items-center w-full my-8 z-10">
        <Magnet>
          <img
            src="/src/assets/jagreet-profile.jpg"
            alt="Jagreet Dangi"
            className="w-64 h-80 md:w-72 md:h-96 object-cover object-top rounded-3xl shadow-2xl"
          />
        </Magnet>
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
          px-4
          sm:px-6
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
              max-w-[200px]
              sm:max-w-[280px]
              md:max-w-[420px]
            "
            style={{
              fontSize: "clamp(0.65rem, 1.4vw, 1.5rem)",
            }}
          >
            Artificial Intelligence &amp; Machine Learning Engineer | Full Stack
            Developer
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton href="https://github.com/Jagreet-Kumar-Dangi" />
        </FadeIn>
      </div>
    </section>
  );
}
