import { useTranslation } from "react-i18next";
import "i18n/i18n";
import "tailwindcss/tailwind.css";
import ThemeSwitcher from "./ThemeSwitcher";

function debounce(callback, wait = 400) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            callback.apply(this, args);
        }, wait);
    };
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
            </div>
        </>
    );
}
