export type LaminarNavItem = {
  label: string;
  path: string;
  sections: {
    label: string;
    hash: string;
  }[];
  active?: boolean;
};

export type LaminarNavGroup = {
  title: string;
  items: LaminarNavItem[];
};

export const LAMINAR_NAV_GROUPS: LaminarNavGroup[] = [
  {
    title: "Basics",
    items: [
      {
        label: "Getting started",
        path: "/",
        active: true,
        sections: [
          { label: "Getting started", hash: "#getting-started" },
          { label: "Installation", hash: "#installation" },
          { label: "Reanimated setup", hash: "#reanimated-setup" },
          { label: "First component", hash: "#first-component" },
        ],
      },
    ],
  },
  {
    title: "API",
    items: [
      {
        label: "API",
        path: "/api",
        sections: [
          { label: "API", hash: "#api" },
          { label: "Exports", hash: "#exports" },
          { label: "Props", hash: "#props" },
          { label: "Reference", hash: "#reference" },
          { label: "Style props", hash: "#style-props" },
          { label: "Motion props", hash: "#motion-props" },
        ],
      },
      {
        label: "Variants",
        path: "/variants",
        sections: [
          { label: "Variants", hash: "#variants" },
          { label: "Text", hash: "#text" },
          { label: "Number", hash: "#number" },
          { label: "Slots", hash: "#slots" },
          { label: "Choosing a variant", hash: "#choosing-a-variant" },
        ],
      },
      {
        label: "Styling",
        path: "/styling",
        sections: [
          { label: "Styling", hash: "#styling" },
          { label: "Text style", hash: "#text-style" },
          { label: "Container style", hash: "#container-style" },
          { label: "NativeWind", hash: "#nativewind" },
          { label: "Alignment", hash: "#alignment" },
          { label: "Layout", hash: "#layout" },
        ],
      },
      {
        label: "Motion",
        path: "/motion",
        sections: [
          { label: "Motion", hash: "#motion" },
          { label: "Presets", hash: "#presets" },
          { label: "Duration", hash: "#duration" },
          { label: "Stagger", hash: "#stagger" },
          { label: "First paint", hash: "#first-paint" },
        ],
      },
    ],
  },
  {
    title: "Guides",
    items: [
      {
        label: "Guides",
        path: "/guides",
        sections: [
          { label: "Guides", hash: "#guides" },
          { label: "Animated labels", hash: "#animated-labels" },
          { label: "Numbers", hash: "#numbers" },
          { label: "Layout", hash: "#layout" },
          { label: "Clipping", hash: "#clipping" },
        ],
      },
    ],
  },
  {
    title: "Examples",
    items: [
      {
        label: "Examples",
        path: "/examples",
        sections: [
          { label: "Examples", hash: "#examples" },
          { label: "Button state", hash: "#button-state" },
          { label: "Balance", hash: "#balance" },
          { label: "Score reel", hash: "#score-reel" },
        ],
      },
    ],
  },
];

export const LAMINAR_DOC_PAGES = LAMINAR_NAV_GROUPS.flatMap(
  (group) => group.items,
);

export function getLaminarDocPath(pathname: string) {
  if (pathname === "/" || pathname === "/laminar") {
    return "/";
  }

  if (pathname.startsWith("/laminar/")) {
    return pathname.replace(/^\/laminar/, "") || "/";
  }

  return pathname;
}

export function getLaminarDocHref(path: string, pathname: string) {
  const isLocalLaminarPath = pathname === "/laminar" || pathname.startsWith("/laminar/");

  if (isLocalLaminarPath) {
    return path === "/" ? "/laminar" : `/laminar${path}`;
  }

  return path;
}

export function getLaminarDocPage(pathname: string) {
  const docPath = getLaminarDocPath(pathname);
  return LAMINAR_DOC_PAGES.find((page) => page.path === docPath) ?? LAMINAR_DOC_PAGES[0];
}
