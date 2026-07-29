import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/jack/HeroSection";
import { MarqueeSection } from "@/components/jack/MarqueeSection";
import { AboutSection } from "@/components/jack/AboutSection";
import { ExperienceSection } from "@/components/jack/ExperienceSection";
import { ProjectsSection } from "@/components/jack/ProjectsSection";
import { CertificatesSection } from "@/components/jack/CertificatesSection";
import { SkillsSection } from "@/components/jack/SkillsSection";
import { FooterSection } from "@/components/jack/FooterSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Jagreet Dangi | AI & ML Engineer | Full Stack Developer",
      },
      {
        name: "description",
        content:
          "Jagreet Dangi — AI & Machine Learning Engineer and Full Stack Developer building practical, modern applications.",
      },
      {
        property: "og:title",
        content: "Jagreet Dangi | AI & ML Engineer | Full Stack Developer",
      },
      {
        property: "og:description",
        content:
          "Jagreet Dangi — AI & Machine Learning Engineer and Full Stack Developer building practical, modern applications.",
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
    <main style={{ background: "transparent", overflowX: "clip" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <CertificatesSection />
      <FooterSection />
    </main>
  );
}
