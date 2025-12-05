import React, { useState, useEffect } from "react";
import { URLS, SOCIAL_LINKS, ICP_RECORD } from "@/consts";

const Hamburger: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className="fixed bottom-0  z-50 max-w-screen left-0 w-full bg-white border flex flex-col md:hidden transition-all duration-500 ease-in-out">
      <nav
        className={`flex flex-col items-center  w-full overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen
            ? "h-dvh opacity-100 bg-white  sticky"
            : "h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="my-auto flex flex-col gap-5 text-3xl text-center">
          {Object.entries(URLS).map(([key, value]) => (
            <li key={key}>
              <Link
                target="_self"
                href={value.href}
                rel="noopener noreferrer"
                text={value.text}
              />
            </li>
          ))}
        </ul>
        <div className="flex pb-5">
          <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
            >
            <img
              src="/icons/insta.svg"
              alt="Instagram"
              className="w-10 h-10 mx-2 transition-transform duration-300 hover:scale-110"
            />
          </a>
          <a
              href={SOCIAL_LINKS.pinterest}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Pinterest"
            >
            <img
              src="/icons/pinterest.svg"
              alt="Pinterest"
              className="w-10 h-10 mx-2 transition-transform duration-300 hover:scale-110"
            />
          </a>
        </div>
      </nav>

      {!isOpen && (
        <div className="py-4 px-5 transition-opacity duration-300">
          <p>All rights reserved © {new Date().getFullYear()}</p>
          <p className="text-xs">{ICP_RECORD}</p>
        </div>
      )}
      {/* Hamburger icon */}
      <div className="z-50 absolute right-2 bottom-4">
        <button
          aria-expanded={isOpen}
          aria-label="Abrir menú"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="currentColor"
              strokeDasharray="16"
              strokeDashoffset="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M5 5h14">
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  dur="0.2s"
                  values="16;0"
                />
              </path>
              <path d="M5 12h14">
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.2s"
                  dur="0.2s"
                  values="16;0"
                />
              </path>
              <path d="M5 19h14">
                <animate
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="0.4s"
                  dur="0.2s"
                  values="16;0"
                />
              </path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Hamburger;

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
    <a
      href={href}
      target={target}
      rel={rel}
      className={`animated-link ${isCurrent ? "font-bold text-4xl" : ""}`}
      aria-current={isCurrent ? "page" : undefined}
    >
      {text}
    </a>
  );
};
