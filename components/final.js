import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";

function Answers(props) {
  const { t } = useTranslation();
  return props.round.map((x, i) => (
    <div
      key={`round-${i}`}
      className="flex flex-row space-x-2"
      style={{
        minWidth: 0,
      }}
    >
      <div
        className="bg-fastm-holder font-extrabold uppercase items-center text-center p-5 rounded  flex-grow flex-shrink"
        style={{ minHeight: 70, minWidth: 0 }}
      >
        {x.revealed && (
          <p
            id={`finalRound${props.finalRoundNumber}Answer${i}Text`}
            className="text-2xl"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}
          >
            {x.input}
          </p>
        )}
      </div>
      <div className="bg-fastm-holder w-16 font-extrabold uppercase flex justify-center items-center rounded">
        {x.revealed && (
          <p
            id={`finalRound${props.finalRoundNumber}PointsTotalText`}
            className="text-2xl"
          >
            {t("number", { count: x.points })}
          </p>
        )}
      </div>
    </div>
  ));
}

export default function Final(props) {
  const { t } = useTranslation();
  let total = 0;

  props.game.final_round.forEach((round) => {
    console.debug("round one total: ");
    total = total + parseInt(round.points);
  });
  props.game.final_round_2.forEach((round) => {
    console.debug("round two total", total);
    total = total + parseInt(round.points);
  });
  return (
    <div>
      <div className="text-center my-10">
        <p id="finalRoundTitle" className="text-3xl text-foreground">
          {props.game.settings.final_round_title || t("Fast Money")}
        </p>
      </div>
      <div className="border-8 bg-fastm-background p-5 border-fastm-holder rounded-3xl grid lg:grid-flow-col gap-3 text-fastm-text">
        {!props.game.hide_first_round && (
          <div className="grid lg:grid-flow-row gap-3">
            <Answers finalRoundNumber={1} round={props.game.final_round} />
          </div>
        )}
        <div className="border-warning-500 border-4 rounded-3xl bg-warning-500 lg:hidden" />
        {props.game.is_final_second && (
          <div className="grid lg:grid-flow-row gap-3">
            <Answers finalRoundNumber={2} round={props.game.final_round_2} />
          </div>
        )}
      </div>
      <div className="my-3 flex flex-row justify-evenly items-center align-middle">
        {/* Timer */}
        <div className="bg-fastm-holder inline-block p-2 rounded">
          <p
            id="finalRoundTimerText"
            className="font-bold uppercase text-3xl text-fastm-text"
          >
            {t("timer")} &nbsp;&nbsp;{t("number", { count: props.timer })}
          </p>
        </div>
        {/* Total */}
        <div className="bg-fastm-holder inline-block p-2 rounded">
          <p
            id="finalRoundTotalPointsText"
            className="font-bold uppercase text-3xl text-fastm-text"
          >
            {t("total")} &nbsp;&nbsp;{t("number", { count: total })}
          </p>
        </div>
      </div>

      {/* WIN TEXT */}
      <div className="text-center">
        {total >= 200 ? (
          <p id="finalRoundWinText" className="text-5xl text-success-900">
            {t("win")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
