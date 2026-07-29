import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { F as FaGithub, a as FaLinkedin, b as FaEnvelope } from "../_libs/react-icons.mjs";
import "../_libs/firebase.mjs";
import { a as addDoc, c as collection, g as getFirestore } from "../_libs/firebase__firestore.mjs";
import { u as useScroll, A as AnimatePresence, m as motion, a as useTransform } from "../_libs/framer-motion.mjs";
import { X, S as Star } from "../_libs/lucide-react.mjs";
import { i as initializeApp } from "../_libs/firebase__app.mjs";

import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/unenv.mjs";


import "../_libs/firebase__webchannel-wrapper.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/re2js.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/idb.mjs";
function FadeIn({
  children,
  as = "div",
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style
}) {
  const Comp = motion.create(as);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      initial: { opacity: 0, x, y },
      whileInView: { opacity: 1, x: 0, y: 0 },
      viewport: { once: true, margin: "50px", amount: 0 },
      transition: { delay, duration, ease: [0.25, 0.1, 0.25, 1] },
      className,
      style,
      children
    }
  );
}
function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className
}) {
  const ref = reactExports.useRef(null);
  const [pos, setPos] = reactExports.useState({ x: 0, y: 0 });
  const [active, setActive] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handle = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const within = Math.abs(dx) < rect.width / 2 + padding && Math.abs(dy) < rect.height / 2 + padding;
      if (within) {
        setActive(true);
        setPos({ x: dx / strength, y: dy / strength });
      } else {
        setActive(false);
        setPos({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [padding, strength]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className,
      style: {
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active ? activeTransition : inactiveTransition,
        willChange: "transform"
      },
      children
    }
  );
}
function ContactButton({
  href = "https://github.com/Jagreet-Kumar-Dangi"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "\r\n        inline-flex items-center justify-center\r\n        rounded-full\r\n        px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-4\r\n        text-xs sm:text-sm md:text-base\r\n        font-semibold uppercase tracking-[0.25em]\r\n        text-white\r\n        transition-all duration-300\r\n        hover:scale-105 hover:-translate-y-1\r\n        active:scale-95\r\n      ",
      style: {
        background: "rgba(245, 158, 75, 0.12)",
        border: "1px solid rgba(245, 158, 75, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: `
          0 0 20px rgba(232, 120, 42, 0.35),
          0 0 40px rgba(245, 158, 75, 0.2),
          inset 0 1px 1px rgba(255,255,255,0.12)
        `
      },
      children: "GitHub"
    }
  );
}
const NAV_LINKS = [
  "About",
  "Skills",
  "Experience",
  "Projects",
  "Certificates",
  "Contact"
];
function HeroSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: "h-screen flex flex-col relative",
      style: { overflowX: "clip" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FadeIn,
          {
            as: "nav",
            delay: 0,
            y: -20,
            className: "flex items-center justify-between px-4 md:px-10 pt-6 md:pt-8 relative z-20",
            children: NAV_LINKS.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `#${link.toLowerCase()}`,
                className: "\r\n              text-[#f5a960]\r\n              font-medium\r\n              uppercase\r\n              tracking-wider\r\n              text-[0.65rem]\r\n              sm:text-sm\r\n              md:text-lg\r\n              lg:text-[1.4rem]\r\n              hover:opacity-70\r\n              transition-opacity duration-200\r\n            ",
                children: link
              },
              link
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 mt-8 sm:mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: 0.15, y: 40, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h1",
          {
            className: "\r\n              hero-heading\r\n              font-black\r\n              italic\r\n              uppercase\r\n              tracking-tight\r\n              leading-[0.85]\r\n              text-center\r\n            ",
            style: {
              fontSize: "clamp(3.2rem, 20vw, 10rem)"
            },
            children: "JAGREET DANGI"
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center items-center w-full my-8 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Magnet, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: "/src/assets/jagreet-profile.jpg",
            alt: "Jagreet Dangi",
            className: "w-64 h-80 md:w-72 md:h-96 object-cover object-top rounded-3xl shadow-2xl"
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "\r\n          mt-auto\r\n          flex\r\n          justify-between\r\n          items-end\r\n          pb-7\r\n          sm:pb-8\r\n          md:pb-10\r\n          px-4\r\n          sm:px-6\r\n          md:px-10\r\n          relative\r\n          z-20\r\n        ",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: 0.35, y: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "\r\n              text-[#f5a960]\r\n              font-light\r\n              uppercase\r\n              tracking-wide\r\n              leading-snug\r\n              max-w-[200px]\r\n              sm:max-w-[280px]\r\n              md:max-w-[420px]\r\n            ",
                  style: {
                    fontSize: "clamp(0.65rem, 1.4vw, 1.5rem)"
                  },
                  children: "Artificial Intelligence & Machine Learning Engineer | Full Stack Developer"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: 0.5, y: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContactButton, { href: "https://github.com/Jagreet-Kumar-Dangi" }) })
            ]
          }
        )
      ]
    }
  );
}
const IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
];
const ROW1 = IMAGES.slice(0, 11);
const ROW2 = IMAGES.slice(11);
function Row({ images, direction }) {
  const tripled = [...images, ...images, ...images];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", style: { willChange: "transform" }, children: tripled.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src,
      alt: "",
      loading: "lazy",
      className: "rounded-2xl object-cover shrink-0",
      style: { width: 420, height: 270 }
    },
    i
  )) });
}
function MarqueeSection() {
  const sectionRef = reactExports.useRef(null);
  const [offset, setOffset] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const value = (window.scrollY - top + window.innerHeight) * 0.3;
      setOffset(value);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const x1 = offset - 200;
  const x2 = -(offset - 200);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      ref: sectionRef,
      className: "pt-24 sm:pt-32 md:pt-40 pb-10 flex flex-col gap-3",
      style: { background: "transparent", overflowX: "clip" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: `translateX(${x1}px)`, willChange: "transform" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { images: ROW1, direction: "right" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { transform: `translateX(${x2}px)`, willChange: "transform" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { images: ROW2, direction: "left" }) })
      ]
    }
  );
}
function Char({
  char,
  progress,
  range
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-0", children: char === " " ? " " : char }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { style: { opacity }, className: "absolute left-0 top-0", children: char === " " ? " " : char })
  ] });
}
function AnimatedText({ text, className, style }) {
  const ref = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"]
  });
  const chars = text.split("");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { ref, className, style, children: chars.map((c, i) => {
    const start = i / chars.length;
    const end = start + 1 / chars.length;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Char, { char: c, progress: scrollYProgress, range: [start, end] }, i);
  }) });
}
function AboutSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "about",
      className: "relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 gap-10 sm:gap-14 md:gap-16",
      style: { background: "transparent", overflowX: "clip" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: 0, y: 40, className: "text-center relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "hero-heading font-black uppercase leading-none tracking-tight",
            style: { fontSize: "clamp(3rem, 12vw, 160px)" },
            children: "About me"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center gap-8 sm:gap-10 md:gap-12", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AnimatedText,
            {
              text: "I am a 2nd-year B.Tech Computer Science & Engineering (AI & ML) undergraduate at Lovely Professional University. I am passionate about Artificial Intelligence, Full Stack Web Development, Cybersecurity, and Cloud Computing. I enjoy building practical software solutions, learning new technologies, and continuously improving my technical skills through hands-on projects.",
              className: "text-[#e8d5c4] font-medium text-center leading-relaxed max-w-[640px]",
              style: { fontSize: "clamp(1rem, 2vw, 1.35rem)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-[#f5a960] font-semibold uppercase tracking-wide",
                style: { fontSize: "clamp(1rem, 2.2vw, 1.5rem)" },
                children: "Education"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-[#e8d5c4] font-medium",
                style: { fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)" },
                children: "B.Tech CSE (AI & ML) — Lovely Professional University (LPU), Punjab, India"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "text-[#f5a960]/80 font-semibold",
                style: { fontSize: "clamp(1.1rem, 2vw, 1.4rem)" },
                children: "Current CGPA: 9.33"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ContactButton, { href: "https://github.com/jagreetdangi" })
        ] })
      ]
    }
  );
}
const EXPERIENCES = [
  {
    title: "Junior Assistant (Part-Time)",
    organization: "Kumar Associate",
    details: [
      "CCTV inventory management",
      "IT documentation",
      "Office administration and technical support"
    ]
  }
];
const STRENGTHS = [
  "Problem Solving",
  "Analytical Thinking",
  "Fast Learner",
  "Adaptability"
];
function ExperienceSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "experience",
      className: "px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32",
      style: { background: "transparent", overflowX: "clip" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { y: 40, className: "text-center mb-16 sm:mb-20 md:mb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "\r\n              hero-heading\r\n              font-black\r\n              uppercase\r\n              leading-none\r\n              tracking-tight\r\n              text-white\r\n            ",
            style: { fontSize: "clamp(3rem, 12vw, 160px)" },
            children: "Experience"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "text-[#f5a960] font-semibold uppercase tracking-wider mb-8",
                style: { fontSize: "clamp(1rem, 2vw, 1.35rem)" },
                children: "Work Experience"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-6", children: EXPERIENCES.map((exp, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: i * 0.15, y: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "\r\n                      rounded-[24px]\r\n                      border border-orange-500/10\r\n                      bg-white/[0.02]\r\n                      backdrop-blur-sm\r\n                      p-6\r\n                      transition-all duration-300\r\n                      hover:border-orange-500/20\r\n                      hover:bg-white/[0.04]\r\n                    ",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "text-[#e8d5c4] font-semibold",
                      style: { fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)" },
                      children: exp.title
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[#f5a960]/60 text-sm uppercase tracking-[0.15em] mt-1 mb-4", children: exp.organization }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2", children: exp.details.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className: "flex items-start gap-2 text-[#e8d5c4]/70 text-sm",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f5a960] shrink-0 mt-[0.35em] block w-1.5 h-1.5 rounded-full bg-[#f5a960]/60" }),
                        d
                      ]
                    },
                    d
                  )) })
                ]
              }
            ) }, exp.title)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "h3",
              {
                className: "text-[#f5a960] font-semibold uppercase tracking-wider mb-8",
                style: { fontSize: "clamp(1rem, 2vw, 1.35rem)" },
                children: "Strengths"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: 0.2, y: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "\r\n                  rounded-[24px]\r\n                  border border-orange-500/10\r\n                  bg-white/[0.02]\r\n                  backdrop-blur-sm\r\n                  p-6\r\n                  transition-all duration-300\r\n                  hover:border-orange-500/20\r\n                  hover:bg-white/[0.04]\r\n                ",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: STRENGTHS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "\r\n                        px-4 py-2\r\n                        rounded-full\r\n                        border border-orange-500/20\r\n                        bg-[#f5a960]/[0.08]\r\n                        text-[#e8d5c4]\r\n                        text-sm\r\n                        font-medium\r\n                        transition-all duration-300\r\n                        hover:bg-[#f5a960]/[0.15]\r\n                        hover:border-orange-500/40\r\n                        hover:text-[#f5a960]\r\n                      ",
                    children: s
                  },
                  s
                )) })
              }
            ) })
          ] })
        ] })
      ] })
    }
  );
}
function LiveProjectButton({ href = "#" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "inline-block rounded-full border-2 border-[#f5a960] text-[#f5a960] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#f5a960]/10 transition-colors",
      children: "View Project"
    }
  );
}
const PROJECTS = [
  {
    n: "01",
    category: "Web",
    name: "CineAura",
    description: "A responsive movie discovery web application featuring movie search and an intuitive UI. Built with React, TypeScript, Vite, Tailwind CSS, integrated with the OMDb API, and hosted on Firebase.",
    link: "https://github.com/Jagreet-Kumar-Dangi/localdir"
  },
  {
    n: "02",
    category: "Embedded / Hardware",
    name: "Underground Wire Fault Detection",
    description: "An embedded hardware and simulation project exploring techniques for detecting underground cable faults using the Resistance Method and Time Domain Reflectometry (TDR). Built using Arduino and simulated in Proteus. The implementation features custom threshold logic where an A0 analog reading between 600 to 1022 accurately identifies a fault at 15cm.",
    link: "https://github.com/Jagreet-Kumar-Dangi"
  },
  {
    n: "03",
    category: "Web",
    name: "Disaster Management Website",
    description: "A web application focused on disaster awareness and information management. Built with HTML, CSS, JavaScript, and Firebase.",
    link: "https://github.com/Jagreet-Kumar-Dangi"
  }
];
function ProjectCard({
  project,
  index,
  total,
  progress
}) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "sticky top-24 md:top-32",
      style: { top: `${index * 28 + 96}px` },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          style: { scale },
          className: "\r\n          rounded-[40px] sm:rounded-[50px] md:rounded-[60px]\r\n          border border-orange-500/10\r\n          bg-[#0a0a0a]/90\r\n          backdrop-blur-xl\r\n          p-6 sm:p-8 md:p-10\r\n          shadow-[0_0_60px_rgba(232,120,42,0.05)]\r\n          transition-all duration-300\r\n          hover:border-orange-500/20\r\n          hover:shadow-[0_0_80px_rgba(232,120,42,0.1)]\r\n        ",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-8 px-2 sm:px-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 sm:gap-6 md:gap-8 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "hero-heading font-black text-white/15",
                    style: {
                      fontSize: "clamp(3rem, 10vw, 140px)",
                      lineHeight: 1
                    },
                    children: project.n
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f5a960]/60 uppercase tracking-[0.25em] text-xs sm:text-sm", children: project.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-white font-medium uppercase",
                      style: {
                        fontSize: "clamp(1rem, 2vw, 1.75rem)"
                      },
                      children: project.name
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(LiveProjectButton, { href: project.link })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 sm:px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-[#e8d5c4]/70 font-light leading-relaxed max-w-3xl",
                style: { fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)" },
                children: project.description
              }
            ) }),
            project.n === "02" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 px-2 sm:px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#f5a960]/50 text-xs uppercase tracking-[0.2em]", children: "Collaborators: Pragati, Sanchayeeta Rout, Soumya Ray" }) })
          ]
        }
      )
    }
  );
}
function ProjectsSection() {
  const containerRef = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "projects",
      ref: containerRef,
      className: "\r\n        px-5 sm:px-8 md:px-10\r\n        py-20 sm:py-24 md:py-32\r\n        bg-transparent\r\n      ",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { y: 40, className: "text-center mb-16 sm:mb-20 md:mb-28", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "\r\n            hero-heading\r\n            font-black\r\n            uppercase\r\n            leading-none\r\n            tracking-tight\r\n            text-white\r\n          ",
            style: {
              fontSize: "clamp(3rem, 12vw, 160px)"
            },
            children: "Projects"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto", children: PROJECTS.map((project, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[70vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProjectCard,
          {
            project,
            index,
            total: PROJECTS.length,
            progress: scrollYProgress
          }
        ) }, project.n)) })
      ]
    }
  );
}
const agenticaiPdf = "/assets/agenticai-BrIUt0Z9.pdf";
const aifoundationPdf = "/assets/aifoundation-DD4MoJEo.pdf";
const generativeaiPdf = "/assets/generativeai-BpZt_k9S.pdf";
const microsoftaiskillPdf = "/assets/microsoftaiskill-C_4RWZ6k.pdf";
const deloittecyberPdf = "/assets/deloittecyber-Dv5RKa3W.pdf";
const deloittedataPdf = "/assets/deloittedata-DEIMQfyX.pdf";
const deloittetechnologyPdf = "/assets/deloittetechnology-Cae7DsEy.pdf";
const tatagenaiPdf = "/assets/tatagenai-BGtwIYvt.pdf";
const CERTIFICATES = [
  {
    file: agenticaiPdf,
    title: "Oracle Agentic AI Certified Foundations Associate"
  },
  {
    file: aifoundationPdf,
    title: "Oracle Cloud Infrastructure AI Foundations Associate"
  },
  {
    file: generativeaiPdf,
    title: "Oracle Cloud Infrastructure Generative AI Professional"
  },
  {
    file: microsoftaiskillPdf,
    title: "EY & Microsoft AI Skills Passport"
  },
  {
    file: deloittecyberPdf,
    title: "Deloitte Cyber Job Simulation"
  },
  {
    file: deloittedataPdf,
    title: "Deloitte Data Analytics Job Simulation"
  },
  {
    file: deloittetechnologyPdf,
    title: "Deloitte Technology Job Simulation"
  },
  {
    file: tatagenaiPdf,
    title: "Tata GenAI Powered Data Analytics"
  }
];
function CertificateCard({
  cert,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      onClick,
      className: "\r\n        group relative\r\n        rounded-[20px]\r\n        border border-orange-500/10\r\n        bg-white/[0.02]\r\n        backdrop-blur-sm\r\n        overflow-hidden\r\n        cursor-pointer\r\n        transition-all duration-300\r\n        hover:border-orange-500/25\r\n        hover:shadow-[0_0_30px_rgba(232,120,42,0.1)]\r\n      ",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] w-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            src: `${cert.file}#toolbar=0&navpanes=0&scrollbar=0`,
            title: cert.title,
            className: "\r\n            w-full h-full\r\n            pointer-events-none\r\n            filter blur-sm\r\n            group-hover:blur-none\r\n            transition-all duration-300\r\n            scale-[1.05]\r\n          ",
            style: { border: "none" },
            scrolling: "no"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "\r\n          absolute bottom-0 left-0 right-0\r\n          bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-transparent\r\n          p-4 pt-8\r\n          pointer-events-none\r\n        ",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[#e8d5c4] font-semibold leading-snug block",
                style: { fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)" },
                children: cert.title
              }
            )
          }
        )
      ]
    }
  );
}
function CertModal({
  cert,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: cert && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.25 },
      onClick: onClose,
      className: "\r\n            fixed inset-0 z-50\r\n            flex items-center justify-center\r\n            bg-black/80 backdrop-blur-md\r\n            p-4 sm:p-8\r\n          ",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.9, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.9, opacity: 0 },
          transition: { duration: 0.25 },
          onClick: (e) => e.stopPropagation(),
          className: "relative w-full max-w-5xl h-[90vh]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: onClose,
                className: "\r\n                absolute -top-12 right-0 sm:-top-14\r\n                flex items-center justify-center\r\n                w-10 h-10\r\n                rounded-full\r\n                bg-white/10\r\n                border border-white/20\r\n                text-white/80\r\n                hover:bg-white/20\r\n                hover:text-white\r\n                transition-all duration-200\r\n                z-10\r\n              ",
                "aria-label": "Close modal",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 22 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full rounded-2xl overflow-hidden border border-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "iframe",
              {
                src: `${cert.file}#toolbar=1`,
                title: cert.title,
                className: "w-full h-full",
                style: { border: "none" }
              }
            ) })
          ]
        }
      )
    }
  ) });
}
function CertificatesSection() {
  const [selectedCert, setSelectedCert] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "certificates",
        className: "px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32",
        style: { background: "transparent" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { y: 40, className: "text-center mb-16 sm:mb-20 md:mb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h2",
            {
              className: "\r\n                hero-heading\r\n                font-black\r\n                uppercase\r\n                leading-none\r\n                tracking-tight\r\n                text-white\r\n              ",
              style: { fontSize: "clamp(3rem, 12vw, 160px)" },
              children: "Certificates"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: CERTIFICATES.map((cert, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: i * 0.08, y: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CertificateCard,
            {
              cert,
              onClick: () => setSelectedCert(cert)
            }
          ) }, cert.title)) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CertModal, { cert: selectedCert, onClose: () => setSelectedCert(null) })
  ] });
}
const SKILL_CATEGORIES = [
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
      "Computer Vision"
    ]
  },
  {
    title: "Programming Languages",
    skills: ["Python", "C", "Java", "TypeScript", "JavaScript", "SQL"]
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
      "Firebase (Hosting & Firestore)"
    ]
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
      "Anaconda"
    ]
  }
];
function SkillsSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "skills",
      className: "py-24 overflow-hidden",
      style: { background: "transparent" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { y: 40, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            className: "\r\n            hero-heading\r\n            font-black\r\n            uppercase\r\n            leading-none\r\n            tracking-tight\r\n            text-center\r\n            text-white\r\n            mb-20\r\n          ",
            style: {
              fontSize: "clamp(3rem, 12vw, 160px)"
            },
            children: "Skills"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto px-5 sm:px-8 md:px-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: SKILL_CATEGORIES.map((category, catIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: catIndex * 0.1, y: 30, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "\r\n                  rounded-[30px]\r\n                  border border-orange-500/10\r\n                  bg-white/[0.02]\r\n                  backdrop-blur-sm\r\n                  p-6 sm:p-8\r\n                  transition-all duration-300\r\n                  hover:border-orange-500/20\r\n                  hover:bg-white/[0.04]\r\n                  hover:shadow-[0_0_40px_rgba(232,120,42,0.06)]\r\n                ",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "h3",
                {
                  className: "text-[#f5a960] font-semibold uppercase tracking-wider mb-5",
                  style: { fontSize: "clamp(1rem, 1.8vw, 1.25rem)" },
                  children: category.title
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3", children: category.skills.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "\r\n                        px-4 py-2\r\n                        rounded-full\r\n                        border border-orange-500/15\r\n                        bg-[#f5a960]/[0.06]\r\n                        text-[#e8d5c4]\r\n                        text-sm\r\n                        font-medium\r\n                        transition-all duration-300\r\n                        hover:bg-[#f5a960]/[0.12]\r\n                        hover:border-orange-500/30\r\n                        hover:text-[#f5a960]\r\n                      ",
                  children: skill
                },
                skill
              )) })
            ]
          }
        ) }, category.title)) }) })
      ]
    }
  );
}
function FooterSection() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "px-5 sm:px-8 md:px-10 pt-24 pb-10", id: "contact", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { y: 40, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "h2",
      {
        className: "\r\n              hero-heading\r\n              font-black\r\n              uppercase\r\n              leading-none\r\n              tracking-tight\r\n              text-white\r\n              text-center\r\n            ",
        style: {
          fontSize: "clamp(3rem, 10vw, 8rem)"
        },
        children: [
          "Let's Build",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Something Amazing"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: 0.2, y: 30, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "https://github.com/Jagreet-Kumar-Dangi",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "\r\n                px-10 py-5\r\n                rounded-full\r\n                border border-white/10\r\n                bg-white/[0.03]\r\n                backdrop-blur-md\r\n                text-white\r\n                uppercase\r\n                tracking-[0.25em]\r\n                font-medium\r\n                transition-all duration-300\r\n                hover:bg-white/[0.08]\r\n                hover:border-orange-500/30\r\n                hover:-translate-y-1\r\n              ",
        children: "Get In Touch"
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FadeIn, { delay: 0.4, y: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-8 mt-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://github.com/Jagreet-Kumar-Dangi",
          target: "_blank",
          rel: "noreferrer",
          className: "\r\n                text-white/60\r\n                hover:text-[#f5a960]\r\n                hover:scale-110\r\n                transition-all duration-300\r\n              ",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaGithub, { size: 30 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://www.linkedin.com/in/jagreet-kumar-dangi",
          target: "_blank",
          rel: "noreferrer",
          className: "\r\n                text-white/60\r\n                hover:text-[#0A66C2]\r\n                hover:scale-110\r\n                transition-all duration-300\r\n              ",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaLinkedin, { size: 30 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "mailto:jagreetdangi2007@gmail.com",
          className: "\r\n                text-white/60\r\n                hover:text-[#f5a960]\r\n                hover:scale-110\r\n                transition-all duration-300\r\n              ",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaEnvelope, { size: 30 })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-orange-500/20 mt-16 mb-8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40 text-sm", children: "© 2026 Jagreet Dangi. All rights reserved." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40 text-sm uppercase tracking-[0.2em]", children: "Designed & Developed by Jagreet Dangi" })
    ] })
  ] }) });
}
const firebaseConfig = {
  apiKey: "AIzaSyCMfOsakOD3fog6sUNBszlzgWyhU_D6thk",
  authDomain: "jagreetdangi-860f6.firebaseapp.com",
  projectId: "jagreetdangi-860f6",
  storageBucket: "jagreetdangi-860f6.firebasestorage.app",
  messagingSenderId: "170835126671",
  appId: "1:170835126671:web:311a0c814bf80a39f303fa",
  measurementId: "G-WFL7JHG5JW"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
function FeedbackPopup() {
  const [visible, setVisible] = reactExports.useState(false);
  const [rating, setRating] = reactExports.useState(0);
  const [hoverRating, setHoverRating] = reactExports.useState(0);
  const [name, setName] = reactExports.useState("");
  const [feedback, setFeedback] = reactExports.useState("");
  const [submitted, setSubmitted] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const handleScroll = () => {
      if (visible) return;
      const scrolledTo = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (scrolledTo) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);
  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "portfolio_feedback"), {
        name: name || "Anonymous",
        rating,
        feedback,
        timestamp: /* @__PURE__ */ new Date()
      });
      setSubmitted(true);
      setTimeout(() => {
        setVisible(false);
        setSubmitted(false);
      }, 3e3);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.9, y: 20, opacity: 0 },
          animate: { scale: 1, y: 0, opacity: 1 },
          exit: { scale: 0.9, y: 20, opacity: 0 },
          transition: { duration: 0.3 },
          className: "\r\n              relative w-full max-w-md\r\n              rounded-2xl\r\n              border border-orange-500/15\r\n              bg-[#0d0d0d]\r\n              p-6 sm:p-8\r\n              shadow-[0_0_40px_rgba(232,120,42,0.1)]\r\n            ",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setVisible(false),
                className: "\r\n                absolute top-4 right-4\r\n                flex items-center justify-center\r\n                w-8 h-8\r\n                rounded-full\r\n                bg-white/5\r\n                border border-white/10\r\n                text-white/60\r\n                hover:bg-white/10\r\n                hover:text-white\r\n                transition-all duration-200\r\n              ",
                "aria-label": "Close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 18 })
              }
            ),
            submitted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 py-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "\r\n                    flex items-center justify-center\r\n                    w-16 h-16 rounded-full\r\n                    bg-[#f5a960]/15\r\n                    border border-[#f5a960]/30\r\n                  ",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { size: 28, className: "text-[#f5a960] fill-[#f5a960]" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[#f5a960] font-semibold text-lg", children: "Thank you for your feedback!" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-semibold text-lg mb-6", children: "Share Your Feedback" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center gap-2 mb-6", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onMouseEnter: () => setHoverRating(star),
                  onMouseLeave: () => setHoverRating(0),
                  onClick: () => setRating(star),
                  className: "transition-transform hover:scale-110",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Star,
                    {
                      size: 32,
                      className: `transition-all duration-150 ${star <= (hoverRating || rating) ? "text-[#f5a960] fill-[#f5a960]" : "text-white/20"}`
                    }
                  )
                },
                star
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  placeholder: "Your name",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  className: "\r\n                    w-full px-4 py-3 mb-4\r\n                    rounded-xl\r\n                    border border-white/10\r\n                    bg-white/[0.03]\r\n                    text-white\r\n                    placeholder:text-white/30\r\n                    outline-none\r\n                    focus:border-[#f5a960]/40\r\n                    focus:bg-white/[0.05]\r\n                    transition-all duration-200\r\n                  "
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  placeholder: "What should I improve?",
                  value: feedback,
                  onChange: (e) => setFeedback(e.target.value),
                  rows: 3,
                  className: "\r\n                    w-full px-4 py-3 mb-6\r\n                    rounded-xl\r\n                    border border-white/10\r\n                    bg-white/[0.03]\r\n                    text-white\r\n                    placeholder:text-white/30\r\n                    outline-none\r\n                    resize-none\r\n                    focus:border-[#f5a960]/40\r\n                    focus:bg-white/[0.05]\r\n                    transition-all duration-200\r\n                  "
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleSubmit,
                  disabled: rating === 0 || submitting,
                  className: "\r\n                    w-full py-3\r\n                    rounded-xl\r\n                    font-semibold\r\n                    text-white\r\n                    transition-all duration-200\r\n                    disabled:opacity-30 disabled:cursor-not-allowed\r\n                    hover:scale-[1.02] active:scale-[0.98]\r\n                  ",
                  style: {
                    background: rating > 0 ? "linear-gradient(135deg, #e8782a, #f59e4b)" : "rgba(255,255,255,0.06)",
                    border: rating > 0 ? "1px solid rgba(245,158,75,0.4)" : "1px solid rgba(255,255,255,0.1)"
                  },
                  children: submitting ? "Submitting..." : "Submit Feedback"
                }
              )
            ] })
          ]
        }
      )
    }
  ) });
}
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { style: {
    background: "transparent",
    overflowX: "clip"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(MarqueeSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AboutSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SkillsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExperienceSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectsSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CertificatesSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FooterSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FeedbackPopup, {})
  ] });
}
export {
  Index as component
};
