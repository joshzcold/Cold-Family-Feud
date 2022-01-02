import { useTranslation } from "react-i18next";
import "../i18n/i18n";

export default function QuestionBoard(props) {
  const { t } = useTranslation();
  return (
    <div class="flex flex-row items-center justify-center">
      <div
        class="rounded-3xl border-black grid lg:grid-rows-4 lg:grid-flow-col gap-3 bg-black flex-grow"
        style={{ borderWidth: 12 }}
      >
        {props.round.answers.map((x, index) => (
          <div class=" uppercase items-center text-center rounded border-2 font-extrabold">
            {x.trig ? (
              // answered question
              <div class="h-full bg-gradient-to-t from-blue-800 via-blue-600 to-blue-800">
                <div class="flex h-full items-center justify-center">
                  <p
                    class="text-2xl text-white px-5 flex-grow"
                    style={{ textShadow: "1px 2px 4px black" }}
                  >
                    {x.ans}
                  </p>
                  <div class="bg-gradient-to-t from-blue-700 to-blue-400 border-l-2 h-full text-center items-center justify-center p-5 flex">
                    <p
                      class="text-4xl text-white"
                      style={{ textShadow: "1px 2px 4px black" }}
                    >
                      {t("number", { count: x.pnt })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // unanswered question
              <div class="h-full bg-gradient-to-t py-3 flex justify-center items-center from-blue-700 to-blue-400 ">
                <div
                  class="rounded-full justify-center items-center inline-block px-5 border-2 py-2 bg-gradient-to-tr
                      from-blue-900 to-blue-700"
                  style={{ boxShadow: "3px 3px 2px black" }}
                >
                  <p
                    class="self-center text-4xl text-white font-black"
                    style={{ textShadow: "1px 2px 4px black" }}
                  >
                    {t("number", { count: index + 1 })}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
