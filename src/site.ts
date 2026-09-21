/** Site-wide copy: the title, the Description, and the Social Links. */
export const title = "eugen";

export const description = "Personal website of eugen, who codes.";

/** `label` is the link text on the home page; `printLabel` is the plain text in the Open Graph image. */
export const socialLinks = [
  {
    label: "github",
    printLabel: "github.com/eugencowie",
    url: "https://github.com/eugencowie",
  },
  {
    label: "twitter",
    printLabel: "x.com/eugencowie",
    url: "https://x.com/eugencowie",
  },
] as const;
