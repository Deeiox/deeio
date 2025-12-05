// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Site metadata
export const SITE_TITLE = "Deeio";
export const SITE_DESCRIPTION = "A blog about life in the big city";
export const SITE_URL = "https://deeio.com";
export const SITE_AUTHOR = "deeio.com";
export const SITE_EMAIL = "contact@deeio.com";
export const SITE_COPYRIGHT = "© ${new Date().getFullYear()} ${SITE_AUTHOR}. All rights reserved.";

// Legal information
export const ICP_RECORD = "粤ICP备2024347212号-2";

// Social media links
export const SOCIAL_LINKS = {
  website: "https://deeio.com",
  instagram: "https://deeio.com",
  pinterest: "https://deeio.com",
};

// Navigation URLs
export const URLS = [
  { href: "/", text: "首页" },
  { href: "/about", text: "关于" },
  { href: "/blog", text: "博客" },
  { href: "/collection", text: "摄影" },
  { href: "/contact", text: "联系" },
];

// RSS configuration
export const RSS_CONFIG = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  site: SITE_URL,
  author: SITE_AUTHOR,
  email: SITE_EMAIL,
  language: "en",
  copyright: `© ${new Date().getFullYear()} ${SITE_AUTHOR}. All rights reserved.`,
};

// Content collections configuration
export const COLLECTIONS = {
  blog: "blog",
  collection: "collection",
} as const;

// Type definitions
export type Post = {
  title: string;
  date: Date;
  description: string;
  tags: string[];
  image: string;
  link: string;
  content: string;
};

export type CollectionItem = {
  title: string;
  date: Date;
  description: string;
  image: string;
  technique: string;
  location: string;
};

export type SocialLink = keyof typeof SOCIAL_LINKS;

// Utility functions
export const formatDate = (date: Date): string => {
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};