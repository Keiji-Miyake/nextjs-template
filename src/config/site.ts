export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js14 Template",
  description:
    "Next.js14 Template is a starter template for Next.js14 with TypeScript, ESLint, Prettier, Jest, Tailwind CSS, shadcn/ui, and Husky.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
};

export const MEMBER_ID_LENGTH = 8;

export const USERS_PER_PAGE = 10;

export const MAX_MB = 5;
export const MAX_FILE_SIZE = MAX_MB * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
];
