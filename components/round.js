import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";

function RoundPointTally(props) {
  const { t } = useTranslation();
  // start at font size 72 and get smaller as point values increase
  let size = 72 - `${props.points}`.length * 8;
  return (
    <div
      style={{ borderWidth: 12 }}
      class="border-black bg-gradient-to-tr from-blue-900 to-blue-500 p-1"
    >
      {/* text within svg can resize the text based on container*/}
      <svg
        viewBox="-50 -50 100 100"
        height="100%"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          fontWeight={props.fontWeight}
          fontSize={size}
          pointerEvents="auto"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {t("number", { count: props.points })}
        </text>
      </svg>
    </div>
  );
}

export default function Round(props) {
  const { t } = useTranslation();
  let current_round = props.game.round;
  let round = props.game.rounds[current_round];
  return (
    <div class="w-auto flex flex-col space-y-1 items-center">
      <div class="flex flex-row justify-around space-x-2 h-28">
        <RoundPointTally points={props.game.teams[0].points} />
        <RoundPointTally
          points={props.game.point_tracker[props.game.round]}
          fontWeight="bold"
        />
        <RoundPointTally points={props.game.teams[1].points} />
      </div>

      <div class="flex flex-row justify-center">
        {round.multiply > 1 ? (
          <div>
            <p class="text-2xl text-start">
              x{t("number", { count: round.multiply })}
            </p>
          </div>
        ) : null}
      </div>
      <div class="flex flex-row justify-center">
        <p class="text-end sm:text-1xl text-2xl ">{round.question}</p>
      </div>
    </div>
  );
}
