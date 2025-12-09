"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { FC, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Input from "@/components/ui/Input/Input";
import TermsCheckbox from "@/components/ui/TermsCheckbox/TermsCheckbox";
import { useTranslations } from "next-intl";
import { createNewsletter } from "@/api/about-us";
import Swal from "sweetalert2";

const LOCALSTORAGE_SUBSCRIBED_KEY = "newsletterModalSubscribedTimestamp";
const SUBSCRIBE_COOLDOWN_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const COOKIE_NAME = "newsletterModalClosed";
const COOKIE_DURATION_MINUTES = 30;
const MODAL_DELAY_MS = 30000;

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PaperPlaneIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#FFFFFF"
    className="w-20 h-20 sm:w-24 sm:h-24 mx-auto"
    animate={{
      y: [0, -5, 0],
      rotate: [-3, 3, -3],
    }}
    transition={{
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
    />
  </motion.svg>
);

export interface NewsletterModalProps {
  className?: string;
}

const NewsletterModal: FC<NewsletterModalProps> = ({ className = "" }) => {
  const t = useTranslations("Components.PopupModal");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookie = Cookies.get(COOKIE_NAME);
      if (cookie) {
        return;
      }

      const now = Date.now();
      const subscribedTimestamp = localStorage.getItem(LOCALSTORAGE_SUBSCRIBED_KEY);

      let shouldShow = true;

      if (subscribedTimestamp) {
        const timeSinceSubscribed = now - parseInt(subscribedTimestamp, 10);
        if (timeSinceSubscribed < SUBSCRIBE_COOLDOWN_DURATION_MS) {
          shouldShow = false;
        } else {
          localStorage.removeItem(LOCALSTORAGE_SUBSCRIBED_KEY);
        }
      }

      if (shouldShow) {
        const timer = setTimeout(() => {
          setOpen(true);
        }, MODAL_DELAY_MS);

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      Swal.fire({
        title: t("termsError"),
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]",
        },
      });
      return;
    }

    if (!email) return;

    setLoading(true);
    try {
      await createNewsletter(email);
      setEmail("");
      setAcceptTerms(false);

      if (typeof window !== "undefined") {
        localStorage.setItem(LOCALSTORAGE_SUBSCRIBED_KEY, Date.now().toString());
        Cookies.remove(COOKIE_NAME);
      }
      Swal.fire({
        title: t("popup"),
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]",
        },
      }).then(() => {
        setOpen(false);
      });
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      Swal.fire({
        title: t("submitError") || "Subscription Failed",
        text: "Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          container: "z-[9999]",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    if (typeof window !== "undefined") {
      const expires = new Date(new Date().getTime() + COOKIE_DURATION_MINUTES * 60 * 1000);
      Cookies.set(COOKIE_NAME, "true", { expires });
    }
    setOpen(false);
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 18,
        delay: 0.1,
      },
    },
    exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="newsletter-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-['Inter',_sans-serif]"
        >
          <motion.div
            key="newsletter-modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative bg-menu-bg-light dark:bg-neutral-800 rounded-2xl overflow-hidden max-w-lg md:max-w-4xl w-full shadow-xl flex flex-col md:flex-row text-primary-500 dark:text-neutral-200 ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onCloseModal}
              aria-label="Close newsletter signup"
              className={`absolute top-2 right-2 p-1.5 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-colors z-10 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 dark:focus:ring-offset-neutral-800`}
            >
              <CloseIcon />
            </button>

            <div
              className={`md:w-2/5 bg-primary-500 dark:bg-primary-700 p-8 sm:p-10 items-center justify-center text-center hidden md:flex`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { delay: 0.2, type: "spring", stiffness: 100 },
                }}
                className="space-y-4 sm:space-y-5 m-auto"
              >
                <div className="relative w-full h-auto mx-auto mb-5">
                  <PaperPlaneIcon />
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold text-white`}>{t("leftTit")}</h3>
                <p className={`text-sm sm:text-base text-white/90`}>{t("leftDesc")}</p>
              </motion.div>
            </div>

            <div className="w-full md:w-3/5 p-8 sm:p-10 md:p-12">
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
                className={`text-3xl sm:text-4xl font-bold text-primary-500 dark:text-white mb-6 sm:mb-8 text-center`}
              >
                {t("rightTit")}
              </motion.h2>
              <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
                <div className="relative">
                  <Input
                    required
                    aria-required
                    placeholder={t("form")}
                    type="email"
                    rounded="rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`peer border-gray-300 dark:border-neutral-600 text-primary-600 dark:text-neutral-200 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 w-full px-5 py-3 bg-transparent border-2 rounded-lg transition-colors duration-300`}
                    disabled={loading}
                  />
                </div>
                <TermsCheckbox
                  id="NewsletterModalTerms"
                  checked={acceptTerms}
                  onChange={setAcceptTerms}
                  className="mt-4"
                  name="newsletterTerms"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !acceptTerms}
                  whileHover={
                    !loading && acceptTerms
                      ? {
                          scale: 1.03,
                          y: -2,
                          boxShadow: `0 4px 15px rgba(var(--color-primary-500), 0.3)`,
                        }
                      : {}
                  }
                  whileTap={!loading && acceptTerms ? { scale: 0.98, y: 0 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className={`w-full py-3 px-6 bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loading ? t("loading") || "Feliratkozás..." : t("button")}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsletterModal;
