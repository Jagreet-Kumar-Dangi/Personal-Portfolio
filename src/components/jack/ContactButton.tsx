export function ContactButton({
  href = "https://github.com/jagreetdangi",
}: {
  href?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex items-center justify-center
        rounded-full
        px-8 py-3 sm:px-10 sm:py-4 md:px-12 md:py-4
        text-xs sm:text-sm md:text-base
        font-semibold uppercase tracking-[0.25em]
        text-white
        transition-all duration-300
        hover:scale-105 hover:-translate-y-1
        active:scale-95
      "
      style={{
        background: "rgba(245, 158, 75, 0.12)",
        border: "1px solid rgba(245, 158, 75, 0.25)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: `
          0 0 20px rgba(232, 120, 42, 0.35),
          0 0 40px rgba(245, 158, 75, 0.2),
          inset 0 1px 1px rgba(255,255,255,0.12)
        `,
      }}
    >
      GitHub
    </a>
  );
}
