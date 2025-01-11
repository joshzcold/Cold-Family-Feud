import { useTranslation } from "react-i18next";
import "@/i18n/i18n";

function RoundPointTally(props) {
  const { t } = useTranslation();
  // start at font size 72 and get smaller as point values increase
  let size = 72 - `${props.points}`.length * 8;
  return (
    <div
      style={{ borderWidth: 12 }}
      className="border-black bg-gradient-to-tr from-primary-900 to-primary-500 p-1"
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
          id={`roundPointsTeam${props.team}`}
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
    <div className="w-auto flex flex-col space-y-1 items-center">
      <div className="flex flex-row justify-around space-x-2 h-28">
        <RoundPointTally points={props.game.teams[0].points} team={1} />
        <RoundPointTally
          points={props.game.point_tracker[props.game.round]}
          fontWeight="bold"
          team="total"
        />
        <RoundPointTally points={props.game.teams[1].points} team={2}/>
      </div>

      <div className="flex flex-row justify-center">
        {round.multiply > 1 ? (
          <div>
            <p id="roundMultiplyText" className="text-2xl text-start text-foreground">
              x{t("number", { count: round.multiply })}
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-row justify-center">
        {props.game.settings.hide_questions === false ? (
          <p id="roundQuestionText" className="text-end sm:text-1xl text-2xl text-foreground">{round.question}</p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
