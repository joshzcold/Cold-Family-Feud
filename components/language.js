import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher(props) {
  const { i18n, t } = useTranslation();
  return (
    <div className="select">
      <select
        value={i18n.language}
        onChange={
          props.onChange
            ? props.onChange
            : (e) => {
                i18n.changeLanguage(e.target.value);
              }
        }
      >
        <option value="en">English ({t("english")})</option>
        <option value="es">Español ({t("spanish")})</option>
      </select>
    </div>
  );
}
