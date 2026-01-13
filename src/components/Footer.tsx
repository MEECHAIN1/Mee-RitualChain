import React from "react";
import { useTranslation } from "../utils/TranslationProvider";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto bg-meebot-surface/50 border-t border-meebot-border py-8 text-center text-meebot-text-secondary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-meebot-accent to-transparent opacity-30"></div>
      <p className="font-medium tracking-wide hover:text-meebot-accent transition-colors duration-300 cursor-default">
        ✨ {t("footer.text")}
      </p>
    </footer>
  );
};

export default Footer;
