import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

export function FeedbackPopup() {
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (visible) return;
      const scrolledTo =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
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
        timestamp: new Date(),
      });
      setSubmitted(true);
      setTimeout(() => {
        setVisible(false);
        setSubmitted(false);
      }, 3000);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              relative w-full max-w-md
              rounded-2xl
              border border-orange-500/15
              bg-[#0d0d0d]
              p-6 sm:p-8
              shadow-[0_0_40px_rgba(232,120,42,0.1)]
            "
          >
            {/* Close Button */}
            <button
              onClick={() => setVisible(false)}
              className="
                absolute top-4 right-4
                flex items-center justify-center
                w-8 h-8
                rounded-full
                bg-white/5
                border border-white/10
                text-white/60
                hover:bg-white/10
                hover:text-white
                transition-all duration-200
              "
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <div
                  className="
                    flex items-center justify-center
                    w-16 h-16 rounded-full
                    bg-[#f5a960]/15
                    border border-[#f5a960]/30
                  "
                >
                  <Star size={28} className="text-[#f5a960] fill-[#f5a960]" />
                </div>
                <h3 className="text-[#f5a960] font-semibold text-lg">
                  Thank you for your feedback!
                </h3>
              </div>
            ) : (
              <>
                <h3 className="text-white font-semibold text-lg mb-6">
                  Share Your Feedback
                </h3>

                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`transition-all duration-150 ${
                          star <= (hoverRating || rating)
                            ? "text-[#f5a960] fill-[#f5a960]"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Name Input */}
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full px-4 py-3 mb-4
                    rounded-xl
                    border border-white/10
                    bg-white/[0.03]
                    text-white
                    placeholder:text-white/30
                    outline-none
                    focus:border-[#f5a960]/40
                    focus:bg-white/[0.05]
                    transition-all duration-200
                  "
                />

                {/* Feedback Textarea */}
                <textarea
                  placeholder="What should I improve?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="
                    w-full px-4 py-3 mb-6
                    rounded-xl
                    border border-white/10
                    bg-white/[0.03]
                    text-white
                    placeholder:text-white/30
                    outline-none
                    resize-none
                    focus:border-[#f5a960]/40
                    focus:bg-white/[0.05]
                    transition-all duration-200
                  "
                />

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || submitting}
                  className="
                    w-full py-3
                    rounded-xl
                    font-semibold
                    text-white
                    transition-all duration-200
                    disabled:opacity-30 disabled:cursor-not-allowed
                    hover:scale-[1.02] active:scale-[0.98]
                  "
                  style={{
                    background:
                      rating > 0
                        ? "linear-gradient(135deg, #e8782a, #f59e4b)"
                        : "rgba(255,255,255,0.06)",
                    border:
                      rating > 0
                        ? "1px solid rgba(245,158,75,0.4)"
                        : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
