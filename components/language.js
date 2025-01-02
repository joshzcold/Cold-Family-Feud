import { Languages } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher(props) {
    const { i18n, t } = useTranslation();
    return (
        <div className="flex items-center gap-4 ">
            <Languages color="gray" />
            <select
                id="languageInput"
                className="bg-secondary-300 text-foreground rounded-lg p-2 capitalize w-full sm:w-fit"
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
                <option value="id">Indonesian ({t("indonesian")})</option>
                <option value="et">Estonian ({t("estonian")})</option>
                <option value="fr">Français ({t("french")})</option>
            </select>
        </div>
    );
}
