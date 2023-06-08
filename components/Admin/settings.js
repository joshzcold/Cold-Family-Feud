import { useTranslation } from "react-i18next";
import "../../i18n/i18n";
import "tailwindcss/tailwind.css";

function debounce(callback, wait = 400) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      callback.apply(this, args);
    }, wait);
  };
}

export function ThemeSwitcher(props) {
  const availableThemes = {
    default: {
      bgcolor: "bg-white",
      fgcolor: "text-black",
      title: "default",
    },
    darkTheme: {
      bgcolor: "bg-gray-900",
      fgcolor: "text-white",
      title: "dark theme",
    },
    slate: {
      bgcolor: "bg-black",
      fgcolor: "text-white",
      title: "slate",
    },
  };
  return (
    <div class="flex flex-row space-x-5 items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 1.002v2.5a.5.5 0 0 0 1 0v-2.5h1v3.494a.5.5 0 0 0 1 0V1.002h1.5V7h-9V1.002H8ZM3.5 8v.5a2 2 0 0 0 2 2h1v2.999a1.5 1.5 0 0 0 3 0v-3h1a2 2 0 0 0 2-2V8h-9Z"
          fill="gray"
        />
      </svg>
      <select
        class="bg-secondary-300 text-foreground rounded-lg p-2"
        value={props.game.settings.theme}
        onChange={(e) => {
          props.game.settings.theme = e.target.value;
          props.setGame((prv) => ({ ...prv }));
          props.send({ action: "data", data: props.game });
        }}
      >
        {Object.keys(availableThemes).map((key, index) => (
          <option
            value={key}
            key={index}
            class={`${availableThemes[key].bgcolor} ${availableThemes[key].fgcolor}`}
          >
            {availableThemes[key].title}
          </option>
        ))}
      </select>
    </div>
  );
}

function FinalRoundTitleChanger(props) {
  const { i18n, t } = useTranslation();
  return (
    <div class="flex flex-row space-x-5 items-center">
      <p class="text-xl text-foreground">{t("Final Round Title")}:</p>
      <input
        class="border-4 rounded text-xl w-32 bg-secondary-500 text-foreground p-1"
        onChange={debounce((e) => {
          props.game.settings.final_round_title = e.target.value;
          props.setGame((prv) => ({ ...prv }));
          props.send({ action: "data", data: props.game });
        })}
        placeholder={t("fast money")}
      ></input>
    </div>
  );
}

export default function AdminSettings(props) {
  let game = props.game;
  const { i18n, t } = useTranslation();

  function HideGameQuestions(props) {
    return (
      <div class="flex flex-col">
        <div class="flex flex-row space-x-5 items-center">
          <div>
            <p class="text-m normal-case text-foreground">
              {t("Hide questions")}:
            </p>
          </div>
          <input
            class="w-4 h-4 rounded"
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
          <p class="text-sm normal-case text-secondary-900 italic">
            {t("hide questions on the game window and player buzzer screens")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
        <div class="grid grid-cols-2 gap-6 py-6 px-24">
          <div class="col-span-2">
            <p class="text-xl capitalize text-secondary-900">{t("settings")}:</p>
            <hr class="w-24 p-1 border-secondary-900" />
          </div>
        <HideGameQuestions
          game={game}
          setGame={props.setGame}
          send={props.send}
        />
        <ThemeSwitcher game={game} setGame={props.setGame} send={props.send} />
        <FinalRoundTitleChanger
          game={game}
          setGame={props.setGame}
          send={props.send}
        />
        </div>
    </>
  );
}
