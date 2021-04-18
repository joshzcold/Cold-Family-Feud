import React from "react";
import { useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher(props) {
  const ws = useRef(null)
  useEffect(() => {
    ws.current = new WebSocket(`ws://${ window.location.hostname }:8080`); 
    ws.current.onopen = function() {
      console.log("language picker connected to server");
    };
  }, [])
  const { i18n, t } = useTranslation();
  return (
    <div className="select">
      <select
        value={i18n.language}
        onChange={props.onChange? props.onChange: (e) => {
          i18n.changeLanguage(e.target.value)
        }}
      >
        <option value="en">English ({t("english")})</option>
        <option value="es">Español ({t("spanish")})</option> 
      </select>
    </div>
  );
}
