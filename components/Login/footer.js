import { useTranslation } from "react-i18next";
import "i18n/i18n";

function Donate() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row items-center space-x-4">
      <p className="text-secondary-900 text-sm">{t("donate")}</p>
      <a href="https://liberapay.com/joshuaCold">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          className="fill-current text-secondary-900 hover:text-secondary-500 cursor-pointer"
          height="28"
          viewBox="0 0 256 256"
        >
          <path
            fill="currentColor"
            d="M212 76H32a12 12 0 0 0-12 12v48a100.24 100.24 0 0 0 26.73 68H32a12 12 0 0 0 0 24h176a12 12 0 0 0 0-24h-14.73a100.75 100.75 0 0 0 20-32A44 44 0 0 0 256 128v-8a44.05 44.05 0 0 0-44-44Zm-16 60a76.27 76.27 0 0 1-42 68H86a76.27 76.27 0 0 1-42-68v-36h152Zm36-8a20 20 0 0 1-12.57 18.55A97.17 97.17 0 0 0 220 136v-34.32A20 20 0 0 1 232 120ZM68 48V24a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0Zm40 0V24a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0Zm40 0V24a12 12 0 0 1 24 0v24a12 12 0 0 1-24 0Z"
          />
        </svg>
      </a>
    </div>
  );
}

function Email() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row items-center space-x-4">
      <p className="text-secondary-900 text-sm">{t("email")}</p>
      <a href="mailto: joshzcold@gmail.com">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          className="fill-current text-secondary-900 hover:text-secondary-500 cursor-pointer"
          height="28"
          viewBox="0 0 24 24"
        >
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5l-8-5V6l8 5l8-5v2z" />
        </svg>
      </a>
    </div>
  );
}

function SourceCode() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row items-center space-x-4">
      <p className="text-secondary-900 text-sm">{t("source code")}</p>
      <a href="https://github.com/joshzcold/Cold-Friendly-Feud" target="_blank">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          className="fill-current text-secondary-900 hover:text-secondary-500 cursor-pointer"
        >
          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
        </svg>
      </a>
    </div>
  );
}

export default function Footer(props) {
  return (
    <div className="absolute bottom-6 left-0 min-w-full">
      <hr className="pb-4" />
      <div className="flex flex-row items-center justify-evenly">
        <SourceCode />
        <Email />
        <Donate />
      </div>
    </div>
  );
}
