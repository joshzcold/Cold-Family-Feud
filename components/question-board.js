import { useTranslation } from "react-i18next";
import "../i18n/i18n";

export default function QuestionBoard(props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row items-center justify-center">
      <div
        className="rounded-3xl border-black grid lg:grid-rows-4 lg:grid-flow-col gap-3 bg-black flex-grow"
        style={{ borderWidth: 12 }}
      >
        {props.round.answers.map((x, index) => (
          <div key={index} className=" uppercase items-center text-center rounded border-2 font-extrabold">
            {x.trig ? (
              // answered question
              <div className="h-full bg-gradient-to-t from-primary-900 via-primary-500 to-primary-700">
                <div className="flex h-full items-center justify-center">
                  <p
                    id={`answer${index}Answered`}
                    className="text-2xl text-white px-5 flex-grow"
                    style={{ textShadow: "1px 2px 4px black" }}
                  >
                    {x.ans}
                  </p>
                  <div className="bg-gradient-to-t from-primary-700 to-primary-500 border-l-2 h-full text-center items-center justify-center p-5 flex">
                    <p
                      className="text-4xl text-white"
                      style={{ textShadow: "1px 2px 4px black" }}
                      id={`answer${index}PointsText`}
                    >
                      {t("number", { count: x.pnt })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // unanswered question
              <div className="h-full bg-gradient-to-t py-3 flex justify-center items-center from-primary-700 to-primary-500 ">
                <div
                  className="rounded-full justify-center items-center inline-block px-5 border-2 py-2 bg-gradient-to-tr
                      from-primary-900 to-primary-700"
                  style={{ boxShadow: "3px 3px 2px black" }}
                >
                  <p
                    id={`answer${index}UnAnswered`}
                    className="self-center text-4xl text-white font-black"
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
