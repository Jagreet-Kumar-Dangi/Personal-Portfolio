export function LiveProjectButton({ href = "#" }: { href?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full border-2 border-[#f5a960] text-[#f5a960] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#f5a960]/10 transition-colors"
    >
      View Project
    </a>
  );
}
