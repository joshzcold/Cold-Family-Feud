import { useTranslation } from "react-i18next";
import "i18n/i18n";
import "tailwindcss/tailwind.css";
import InfoTooltip from "../ui/tooltip";

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
            bgcolor: "white",
            fgcolor: "text-black",
            title: "default",
        },
        darkTheme: {
            bgcolor: "#18181B",
            fgcolor: "text-white",
            title: "dark theme",
        },
        slate: {
            bgcolor: "#18181B",
            fgcolor: "text-white",
            title: "slate",
        },
        educational: {
            bgcolor: "#fffbf0",
            fgcolor: "text-black",
            title: "educational",
        },
        red: {
            bgcolor: "#7B2C35",
            fgcolor: "text-white",
            title: "red",
        },
    };
    return (
        <div className="flex flex-row space-x-5 items-center">
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
                className="bg-secondary-300 text-foreground rounded-lg p-2"
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
                        key={`theme-${index}`}
                        style={{
                            backgroundColor: availableThemes[key].bgcolor
                        }}
                        className={`${availableThemes[key].fgcolor}`}
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
        <div className="flex flex-row space-x-5 items-center">
            <p className="text-xl text-foreground">{t("Final Round Title")}:</p>
            <input
                className="border-4 rounded text-xl w-32 bg-secondary-500 text-foreground p-1 placeholder-secondary-900"
                onChange={debounce((e) => {
                    props.game.settings.final_round_title = e.target.value;
                    props.setGame((prv) => ({ ...prv }));
                    props.send({ action: "data", data: props.game });
                })}
                defaultValue={props.game.settings.final_round_title}
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
            <div className="flex flex-col">
                <div className="flex flex-row space-x-5 items-center">
                    <div>
                        <p className="text-xl normal-case text-foreground">
                            {t("Hide questions")}:
                        </p>
                    </div>
                    <input
                        className="w-4 h-4 rounded  placeholder-secondary-900"
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
                    <p className="text-sm normal-case text-secondary-900 italic max-w-xs">
                        {t("hide questions on the game window and player buzzer screens")}
                    </p>
                </div>
            </div>
        );
    }

    const BuzzerSoundSettings = (props) => {
        return (
            <div class="flex flex-col space-y-4">
                <div class="flex flex-col">
                    <div class="flex flex-row space-x-5 items-center">
                        <div class="flex flex-row items-center space-x-2">
                            <InfoTooltip message={t("Allow players to hear sound on their devices when they press their buzzer")} />
                            <p class="text-xl normal-case text-foreground">
                                {t("Player Buzzer Sounds")}
                            </p>
                        </div>
                        <input
                            class="w-4 h-4 rounded placeholder-secondary-900"
                            checked={game.settings.enable_player_buzzer_sound}
                            onChange={(e) => {
                                game.settings.enable_player_buzzer_sound = e.target.checked;
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

                <div class={`flex flex-col ${!game.settings.enable_player_buzzer_sound ? 'opacity-50' : ''}`}>
                    <div class="flex flex-row space-x-5 items-center">
                        <div class="flex flex-row items-center space-x-2">
                            <InfoTooltip message={t("Only play sound for the first player to buzz in")} />
                            <p class="text-xl normal-case text-foreground">
                                {t("First Press Only")}
                            </p>
                        </div>
                        <input
                            class="w-4 h-4 rounded placeholder-secondary-900"
                            checked={game.settings.first_buzzer_sound_only}
                            disabled={!game.settings.enable_player_buzzer_sound}
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
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-y-10 gap-x-48">
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
                <BuzzerSoundSettings
                    game={game}
                    setGame={props.setGame}
                    send={props.send}
                />
            </div>
        </>
    );
}
