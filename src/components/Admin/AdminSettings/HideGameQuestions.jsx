import { useTranslation } from "react-i18next";

function HideGameQuestions({game, setGame, send}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center space-x-5">
        <div>
          <p className="text-xl normal-case text-foreground">{t("Hide questions")}:</p>
        </div>
        <input
          id="hideQuestionsInput"
          className="size-4 rounded placeholder:text-secondary-900"
          checked={game.settings.hide_questions}
          onChange={(e) => {
            game.settings.hide_questions = e.target.checked;
            setGame((prv) => ({ ...prv }));
            send({ action: "data", data: game });
          }}
          type="checkbox"
        ></input>
      </div>
      <div>
        <p className="max-w-xs text-sm normal-case italic text-secondary-900">
          {t("hide questions on the game window and player buzzer screens")}
        </p>
      </div>
    </div>
  );
}

export default HideGameQuestions;