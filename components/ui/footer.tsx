import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { SITE } from "@/data/site";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mx-auto mt-auto w-full max-w-screen-sm border-t border-[#EBEBEB] px-4 dark:border-[#2C2C2B] animate-slide-down-fade"
      style={{ animationDelay: "450ms" }}
    >
      <div
        className=" flex items-center justify-between px-0 pt-4 md:px-0"
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
