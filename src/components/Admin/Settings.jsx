import { useTranslation } from "react-i18next";
import "@/i18n/i18n";
import ThemeSwitcher from "@/components/Admin/ThemeSwitcher";
import InfoTooltip from "@/components/ui/tooltip";
import FinalRoundTitleChanger from "./FinalRoundTitleChanger";

export default function AdminSettings(props) {
  let game = props.game;
  const { i18n, t } = useTranslation();

  function HideGameQuestions(props) {
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
              props.setGame((prv) => ({ ...prv }));
              props.send({ action: "data", data: game });
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

  const BuzzerSoundSettings = (props) => {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <div className="flex flex-row items-center space-x-5">
            <div className="flex flex-row items-center space-x-2">
              <InfoTooltip message={t("Allow players to hear sound on their devices when they press their buzzer")} />
              <p className="text-xl normal-case text-foreground">{t("Player Buzzer Sounds")}</p>
            </div>
            <input
              className="size-4 rounded placeholder:text-secondary-900"
              checked={game.settings.player_buzzer_sound}
              onChange={(e) => {
                game.settings.player_buzzer_sound = e.target.checked;
                if (!e.target.checked) {
                  game.settings.first_buzzer_sound_only = false;
                }
                props.setGame((prv) => ({ ...prv }));
                props.send({ action: "data", data: game });
              }}
              type="checkbox"
            ></input>
          </div>
        </div>

        <div className={`flex flex-col ${!game.settings.player_buzzer_sound ? "opacity-50" : ""}`}>
          <div className="flex flex-row items-center space-x-5">
            <div className="flex flex-row items-center space-x-2">
              <InfoTooltip message={t("Only play sound for the first player to buzz in")} />
              <p className="text-xl normal-case text-foreground">{t("First Press Only")}</p>
            </div>
            <input
              className="size-4 rounded placeholder:text-secondary-900"
              checked={game.settings.first_buzzer_sound_only}
              disabled={!game.settings.player_buzzer_sound}
              onChange={(e) => {
                game.settings.first_buzzer_sound_only = e.target.checked;
                props.setGame((prv) => ({ ...prv }));
                props.send({ action: "data", data: game });
              }}
              type="checkbox"
            ></input>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-x-48 gap-y-10">
        <HideGameQuestions game={game} setGame={props.setGame} send={props.send} />
        <ThemeSwitcher game={game} setGame={props.setGame} send={props.send} />
        <FinalRoundTitleChanger game={game} setGame={props.setGame} send={props.send} />
        <BuzzerSoundSettings game={game} setGame={props.setGame} send={props.send} />
      </div>
    </>
  );
}
