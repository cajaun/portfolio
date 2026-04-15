type TextSectionProps = {
  paragraphs: readonly string[];
};

export default function TextSection({ paragraphs }: TextSectionProps) {
  return (
    <div>
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="mb-2 text-gray-200 font-medium leading-6 tracking-[-0.1px] dark:text-gray-100"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}
