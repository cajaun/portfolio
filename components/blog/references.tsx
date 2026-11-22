type Reference = {
  id: string;
  title: string;
  author: string;
  href: string;
};

export function Cite({
  id,
  n,
  first = true,
}: {
  id: string;
  n: number;
  first?: boolean;
}) {
  return (
    <sup className="ml-0.5 align-super text-[10px] leading-none">
      <a
        id={first ? `${id}-note-ref` : undefined}
        href={`#${id}-note`}
        aria-label={`Reference ${n}`}
        className="mb-0 scroll-mt-24 font-medium text-black no-underline transition-opacity duration-300 hover:opacity-70 dark:text-white"
      >
        {n}
      </a>
    </sup>
  );
}

export function References({ items }: { items: Reference[] }) {
  return (
    <section className="mb-16 px-2">
      <h2>References</h2>
      <ol
        aria-label="References"
        className="not-prose mt-6 flex list-none flex-col gap-4 p-0"
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            id={`${item.id}-note`}
            className="flex scroll-mt-24 gap-1.5 text-base font-medium leading-6 tracking-[-0.1px]"
          >
            <span
              aria-hidden="true"
              className="w-5 shrink-0 text-gray-200 dark:text-gray-100"
            >
              {index + 1}.
            </span>
            <div className="text-pretty text-gray-200 dark:text-gray-100">
              <a
                href={item.href}
                target="_blank"
                rel="noopener"
                className="text-black underline underline-offset-[3px] transition-opacity duration-300 hover:opacity-70 dark:text-white"
              >
                “{item.title}”
                <span className="sr-only"> (opens in a new tab)</span>
              </a>{" "}
              — {item.author.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="whitespace-nowrap">
                {item.author.split(" ").at(-1)}
                {"\u00a0"}
                <a
                href={`#${item.id}-note-ref`}
                aria-label="Back to reference"
                className="ml-0.5 text-gray-200 no-underline transition-colors duration-300 hover:text-black dark:text-gray-100 dark:hover:text-white"
              >
                  ↩︎
                </a>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
