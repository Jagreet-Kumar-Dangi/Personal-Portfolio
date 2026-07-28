import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/jack/HeroSection";
import { MarqueeSection } from "@/components/jack/MarqueeSection";
import { AboutSection } from "@/components/jack/AboutSection";
import { ServicesSection } from "@/components/jack/ServicesSection";
import { ProjectsSection } from "@/components/jack/ProjectsSection";
import { SkillsSection } from "@/components/jack/SkillsSection";
import { FooterSection } from "@/components/jack/FooterSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Amine Hamzaoui | Computer Science Student & Software Developer",
      },
      {
        name: "description",
        content:
          "Amine Hamzaoui — Computer Science student at USTHB and software developer building practical, modern applications.",
      },
      {
        property: "og:title",
        content:
          "Amine Hamzaoui | Computer Science Student & Software Developer",
      },
      {
        property: "og:description",
        content:
          "Amine Hamzaoui — Computer Science student at USTHB and software developer building practical, modern applications.",
      },
    ],

    links: [
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
    ],
  }),

  component: Index,
});

function Index() {
  return (
    <main style={{ background: "#0C0C0C", overflowX: "clip" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <ProjectsSection />
      <FooterSection />
    </main>
  );
}
