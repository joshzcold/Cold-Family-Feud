import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";

function Answers(props) {
  const { t } = useTranslation();
  return props.round.map((x) => (
    <div
      class="flex flex-row space-x-2"
      style={{
        minWidth: 0,
      }}
    >
      <div
        class="bg-black font-extrabold uppercase items-center text-center p-5 rounded  flex-grow flex-shrink"
        style={{ minHeight: 70, minWidth: 0 }}
      >
        {x.revealed ? (
          <p
            class={`text-2xl ${props.hide ? "invisible" : ""}`}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}
          >
            {x.input}
          </p>
        ) : null}
      </div>
      <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded">
        {x.revealed ? (
          <p class={`text-2xl ${props.hide ? "invisible" : ""}`}>
            {t("number", { count: x.points })}
          </p>
        ) : null}
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
    <div class="">
      <div class="text-center my-10">
        <p class="text-3xl">{t("Fast Money")}</p>
      </div>
      <div
        class="border-8 bg-blue-800 p-5 border-black rounded-3xl grid lg:grid-rows-4 lg:grid-flow-col gap-3 text-white "
        style={{}}
      >
        <Answers
          round={props.game.final_round}
          hide={props.game.hide_first_round}
        />
        <div class="border-yellow-600 border-4 rounded-3xl bg-yellow-600 lg:hidden" />
        <Answers
          round={props.game.final_round_2}
          hide={!props.game.is_final_second}
        />
      </div>
      <div class="my-3 flex flex-row justify-evenly items-center align-middle">
        {/* Timer */}
        <div class="bg-black inline-block p-2 rounded">
          <p class="font-bold uppercase text-3xl text-white">
            {t("timer")} &nbsp;&nbsp;{t("number", { count: props.timer })}
          </p>
        </div>
        {/* Total */}
        <div class="bg-black inline-block p-2 rounded">
          <p class="font-bold uppercase text-3xl text-white">
            {t("total")} &nbsp;&nbsp;{t("number", { count: total })}
          </p>
        </div>
      </div>

      {/* WIN TEXT */}
      <div class="text-center">
        {total >= 200 ? (
          <p class="text-5xl text-green-800">{t("win")}</p>
        ) : null}
      </div>
    </div>
  );
}
