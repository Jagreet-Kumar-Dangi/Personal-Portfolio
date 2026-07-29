import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { X } from "lucide-react";

import agenticaiPdf from "@/assets/agenticai.pdf";
import aifoundationPdf from "@/assets/aifoundation.pdf";
import generativeaiPdf from "@/assets/generativeai.pdf";
import microsoftaiskillPdf from "@/assets/microsoftaiskill.pdf";
import deloittecyberPdf from "@/assets/deloittecyber.pdf";
import deloittedataPdf from "@/assets/deloittedata.pdf";
import deloittetechnologyPdf from "@/assets/deloittetechnology.pdf";
import tatagenaiPdf from "@/assets/tatagenai.pdf";

interface Certificate {
  file: string;
  title: string;
}

const CERTIFICATES: Certificate[] = [
  {
    file: agenticaiPdf,
    title: "Oracle Agentic AI Certified Foundations Associate",
  },
  {
    file: aifoundationPdf,
    title: "Oracle Cloud Infrastructure AI Foundations Associate",
  },
  {
    file: generativeaiPdf,
    title: "Oracle Cloud Infrastructure Generative AI Professional",
  },
  {
    file: microsoftaiskillPdf,
    title: "EY & Microsoft AI Skills Passport",
  },
  {
    file: deloittecyberPdf,
    title: "Deloitte Cyber Job Simulation",
  },
  {
    file: deloittedataPdf,
    title: "Deloitte Data Analytics Job Simulation",
  },
  {
    file: deloittetechnologyPdf,
    title: "Deloitte Technology Job Simulation",
  },
  {
    file: tatagenaiPdf,
    title: "Tata GenAI Powered Data Analytics",
  },
];

function CertificateCard({
  cert,
  onClick,
}: {
  cert: Certificate;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="
        group relative
        rounded-[20px]
        border border-orange-500/10
        bg-white/[0.02]
        backdrop-blur-sm
        overflow-hidden
        cursor-pointer
        transition-all duration-300
        hover:border-orange-500/25
        hover:shadow-[0_0_30px_rgba(232,120,42,0.1)]
      "
    >
      {/* Blurred PDF Preview */}
      <div className="aspect-[3/4] w-full overflow-hidden">
        <iframe
          src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0`}
          title={cert.title}
          className="
            w-full h-full
            pointer-events-none
            filter blur-sm
            group-hover:blur-none
            transition-all duration-300
            scale-[1.05]
          "
          style={{ border: "none" }}
          scrolling="no"
        />
      </div>

      {/* Title Overlay */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          bg-gradient-to-t from-[#0a0a0a]/95 via-[#0a0a0a]/70 to-transparent
          p-4 pt-8
          pointer-events-none
        "
      >
        <span
          className="text-[#e8d5c4] font-semibold leading-snug block"
          style={{ fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)" }}
        >
          {cert.title}
        </span>
      </div>
    </motion.div>
  );
}

function CertModal({
  cert,
  onClose,
}: {
  cert: Certificate | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {cert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/80 backdrop-blur-md
            p-4 sm:p-8
          "
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="
                absolute -top-12 right-0 sm:-top-14
                flex items-center justify-center
                w-10 h-10
                rounded-full
                bg-white/10
                border border-white/20
                text-white/80
                hover:bg-white/20
                hover:text-white
                transition-all duration-200
                z-10
              "
              aria-label="Close modal"
            >
              <X size={22} />
            </button>

            {/* PDF Viewer */}
            <div className="w-full h-full rounded-2xl overflow-hidden border border-orange-500/10">
              <iframe
                src={`${cert.file}#toolbar=1`}
                title={cert.title}
                className="w-full h-full"
                style={{ border: "none" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CertificatesSection() {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <>
      <section
        id="certificates"
        className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
        style={{ background: "transparent" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <FadeIn y={40} className="text-center mb-16 sm:mb-20 md:mb-24">
            <h2
              className="
                hero-heading
                font-black
                uppercase
                leading-none
                tracking-tight
                text-white
              "
              style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            >
              Certificates
            </h2>
          </FadeIn>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATES.map((cert, i) => (
              <FadeIn key={cert.title} delay={i * 0.08} y={20}>
                <CertificateCard
                  cert={cert}
                  onClick={() => setSelectedCert(cert)}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
    </>
  );
}
