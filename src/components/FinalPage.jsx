import { useTranslation } from "react-i18next";
import "@/i18n/i18n";

function Answers(props) {
  const { t } = useTranslation();
  return props.round.map((x, i) => (
    <div
      key={`final-round-answers-${i}`}
      className="flex flex-row space-x-2"
      style={{
        minWidth: 0,
      }}
    >
      <div
        className="shrink grow items-center rounded bg-fastm-holder p-5 text-center  font-extrabold uppercase"
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
      <div className="flex w-16 items-center justify-center rounded bg-fastm-holder font-extrabold uppercase">
        {x.revealed && (
          <p id={`finalRound${props.finalRoundNumber}PointsTotalText`} className="text-2xl">
            {t("number", { count: x.points })}
          </p>
        )}
      </div>
    </div>
  ));
}

export default function FinalPage(props) {
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
      <div className="my-10 text-center">
        <p id="finalRoundTitle" className="text-3xl text-foreground">
          {props.game.settings.final_round_title || t("Fast Money")}
        </p>
      </div>
      <div className="grid gap-3 rounded-3xl border-8 border-fastm-holder bg-fastm-background p-5 text-fastm-text lg:grid-flow-col">
        {!props.game.hide_first_round && (
          <div className="grid gap-3 lg:grid-flow-row">
            <Answers finalRoundNumber={1} round={props.game.final_round} />
          </div>
        )}
        <div className="rounded-3xl border-4 border-warning-500 bg-warning-500 lg:hidden" />
        {props.game.is_final_second && (
          <div className="grid gap-3 lg:grid-flow-row">
            <Answers finalRoundNumber={2} round={props.game.final_round_2} />
          </div>
        )}
      </div>
      <div className="my-3 flex flex-row items-center justify-evenly align-middle">
        {/* Timer */}
        <div className="inline-block rounded bg-fastm-holder p-2">
          <p id="finalRoundTimerLabel" className="text-3xl font-bold uppercase text-fastm-text">
            {t("timer")} &nbsp;&nbsp;<span id="finalRoundTimerValue">{t("number", { count: props.timer })}</span>
          </p>
        </div>
        {/* Total */}
        <div className="inline-block rounded bg-fastm-holder p-2">
          <p id="finalRoundTotalPointsText" className="text-3xl font-bold uppercase text-fastm-text">
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
