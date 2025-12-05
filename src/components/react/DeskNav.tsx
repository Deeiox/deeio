import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { URLS } from "@/consts";
import OptimizedIcon from "../OptimizedIcon";

export default function Navigation() {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      setOpen(true);
    }
  }, []);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-end absolute top-1/2 right-0">
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1 }}
        >
          <button 
            className="cursor-pointer" 
            onClick={() => setOpen(!isOpen)}
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
          >
            <OptimizedIcon name="menu" className="w-10 h-10" />
          </button>
        </motion.div>
      ) : (
        <button 
          className="z-50 text-2xl cursor-pointer" 
          onClick={() => setOpen(false)}
          aria-label="Close navigation menu"
          aria-expanded={isOpen}
        >
          <OptimizedIcon name="close" className="w-8 h-8" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col text-right justify-center gap-10 fixed top-0  right-6 p-10 rounded-l-xl h-screen bg-background"
          >
            <h1 className="text-4xl font-bold">
              Big City <br /> Life
            </h1>
            <ul className="text-xl flex flex-col gap-5 z-10">
              {Object.entries(URLS).map(([key, value]) => (
                <motion.li
                  key={key}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={handleLinkClick}
                >
                  <Link
                    href={value.href}
                    target="_self"
                    rel="noopener noreferrer"
                    text={value.text}
                  />
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

const Link: React.FC<{
  href: string;
  target: string;
  rel: string;
  text: string;
}> = ({ href, target, rel, text }) => {
  // 使用useState和useEffect来避免hydration mismatch
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    // 在客户端hydration完成后检查当前路径
    setIsCurrent(window.location.pathname === href);
  }, [href]);

  return (
    <motion.a
      href={href}
      target={target}
      rel={rel}
      className={`animated-link ${isCurrent ? "font-bold text-3xl" : ""}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {text}
    </motion.a>
  );
};
