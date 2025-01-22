import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const UnMutePopup = ({ buzzed }) => {
  const isMuted = useRef(false);
  const { i18n, t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="m-1 rounded-lg bg-secondary-500 p-2 font-bold uppercase shadow-md hover:bg-secondary-200"
        onClick={() => {}}
      >
        {t("unmute")}
      </button>
    </div>
  );
};

export default UnMutePopup;
