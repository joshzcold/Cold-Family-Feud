import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";

function TeamPointTracker(props) {
  const { t } = useTranslation();
  return (
    <div
      style={{ borderWidth: 12 }}
      class="border-black bg-gradient-to-tr px-12
          from-blue-900 to-blue-500 flex items-center justify-center"
    >
      <p
        class="text-white"
        style={{ fontSize: 52, textShadow: "1px 2px 4px black" }}
      >
        {t("number", { count: props.points })}
      </p>
    </div>
  );
}

function RoundPointTally(props) {
  const { t } = useTranslation();
  return (
    <div
      style={{ borderWidth: 12 }}
      class="border-black inline-block bg-gradient-to-tr from-blue-900 to-blue-500 px-8"
    >
      <p
        class="text-white"
        style={{
          textShadow: "1px 2px 4px black",
          fontSize: 72,
          fontWeight: 600,
        }}
      >
        {t("number", { count: props.points })}
      </p>
    </div>
  );
}

export default function Round(props) {
  const { t } = useTranslation();
  let current_round = props.game.round;
  let round = props.game.rounds[current_round];
  return (
    <div class="min-w-full">
      <div class="flex flex-row justify-around">
        <TeamPointTracker points={props.game.teams[0].points} />
        <RoundPointTally points={props.game.point_tracker[props.game.round]} />
        <TeamPointTracker points={props.game.teams[1].points} />
      </div>
      <div class="my-5 flex flex-row justify-center">
        <p class="text-end text-3xl ">{round.question}</p>
        {round.multiply > 1 ? (
          <div style={{ transform: "translate(0px, -7px)" }}>
            <p class="text-2xl text-start">
              x{t("number", { count: round.multiply })}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
