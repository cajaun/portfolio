import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { SITE } from "@/data/site";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mx-auto mt-auto w-full max-w-screen-sm px-4 animate-slide-down-fade"
      style={{ animationDelay: "450ms" }}
    >
      <div
        className="mx-2 border-t border-preview-border flex items-center justify-between px-0 pt-4 dark:border-preview-dark-border md:px-0"
        style={{
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        }}
      >
        <p className="text-sm font-medium text-gray-200 dark:text-gray-100">
          © {year} {SITE.name}
        </p>
        <ThemeToggleButton />
      </div>
    </footer>
  );
};

export default Footer;
