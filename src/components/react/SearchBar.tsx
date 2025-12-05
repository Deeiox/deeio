import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import OptimizedIcon from "../OptimizedIcon";

type SearchItem = { title: string; url: string; collection: string };

type Props = {
  items: SearchItem[];
};

export default function SearchBar({ items }: Props) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      const q = search.toLowerCase();
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(q)
      );
      setResults(filtered);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [search, items]);

  return (
    <div ref={containerRef} className="relative">
      <button
        className="cursor-pointer text-black"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open search bar"
        aria-expanded={isOpen}
      >
        <OptimizedIcon name="search" className="w-8 h-8" />
      </button>
      {isOpen && (
        <motion.div
        className="absolute top-0 right-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2}}
        >
          <div className="w-72 p-3 rounded-lg bg-white shadow-lg flex flex-col gap-3">
            <div className="flex flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setTouched(true);
                }}
                className="w-full h-10 px-3 outline-none border-b"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearch("");
                  setTouched(false);
                  setResults([]);
                  setLoading(false);
                  setIsOpen(false);
                }}
                className="cursor-pointer w-10 h-10 font-fugaz text-black"
                aria-label="Close search bar"
              >
                <OptimizedIcon name="close" className="w-8 h-8" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto bg-muted">
              {loading && (
                <div className="p-3 text-sm text-gray-500">Searching...</div>
              )}
              {!loading && touched && search.trim() === "" && (
                <div className="p-3 text-sm text-gray-500">Write to search</div>
              )}
              {!loading && search.trim() !== "" && results.length === 0 && (
                <div className="p-3 text-sm text-gray-500">No results</div>
              )}
              <ul className="divide-y">
                {results.map((r) => (
                  <li key={r.url} className="hover:bg-gray-50">
                    <a href={r.url} className="block px-3 py-2">
                      <span className="text-sm font-medium">{r.title}</span>
                      <span className="ml-2 text-xs text-gray-500">
                        {r.collection}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
