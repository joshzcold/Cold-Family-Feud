import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";
import "../i18n/i18n";

export default function Final(props) {
  const { t } = useTranslation();
  let total = 0;

  props.game.gameCopy.forEach((round) => {
    console.debug("round one total: ");
    total = total + parseInt(round.points);
  });
  props.game.final_round.forEach((round) => {
    console.debug("round two total", total);
    total = total + parseInt(round.points);
  });

  return (
    <div class="min-w-full px-5">
      {props.game.is_final_second ? (
        <div>
          <div class="text-center my-10">
            <p class="text-3xl">
              {t("fastMoney")} {t("partTwo")}
            </p>
          </div>
          <div class="border-8 bg-blue-800 p-5 border-black">
            <div class="flex space-x-6 text-white">
              <div class="flex-grow rounded grid grid-rows-4 grid-flow-col gap-3 ">
                {props.game.gameCopy.map((copy) => (
                  <div class="flex space-x-2">
                    <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded flex-grow ">
                      <p
                        class={`flex-grow text-2xl 
                        ${props.game.hide_first_round ? "invisible" : ""}`}
                      >
                        {copy.input}
                      </p>
                    </div>
                    <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded text-center">
                      <p
                        class={`flex-grow text-2xl ${
                          props.game.hide_first_round ? "invisible" : ""
                        }`}
                      >
                        {t("number", { count: copy.points })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div class="flex-grow rounded grid grid-rows-4 grid-flow-col gap-3 ">
                {props.game.final_round.map((x) => (
                  <div class="flex space-x-2">
                    <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded flex-grow">
                      {x.revealed ? (
                        <div class="flex">
                          <p class="flex-grow text-2xl">{x.input}</p>
                        </div>
                      ) : (
                        <div class="flex">
                          <p class="flex-grow text-2xl">&nbsp;</p>
                        </div>
                      )}
                    </div>
                    <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded">
                      {x.revealed && x.revealed_points ? (
                        <div class="flex">
                          <p class="text-2xl">
                            {t("number", { count: x.points })}
                          </p>
                        </div>
                      ) : (
                        <div class="flex">
                          <p class="text-2xl">&nbsp;</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <div class="bg-black inline-block p-2 rounded">
                <p class="font-bold uppercase text-3xl text-white">
                  {t("total")} &nbsp;&nbsp;
                  {props.game.hide_first_round
                    ? t("number", { count: 0 })
                    : t("number", { count: total })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div class="text-center my-10">
            <p class="text-3xl">{t("fastMoney")}</p>
          </div>
          <div class="border-8 bg-blue-800 p-5 border-black">
            <div class="flex space-x-6 text-white ">
              <div class=" flex-grow rounded  grid grid-rows-4 grid-flow-col gap-3 ">
                {props.game.final_round.map((x) => (
                  <div class="flex flex-row space-x-2">
                    <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded  flex-grow">
                      {x.revealed ? (
                        <p class="flex-grow text-2xl">{x.input}</p>
                      ) : null}
                    </div>
                    <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded">
                      {x.revealed && x.revealed_points? (
                        <p class="text-2xl">
                          {t("number", { count: x.points })}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div class="flex-grow rounded grid grid-rows-4 grid-flow-col gap-3 ">
                {props.game.final_round.map((x) => (
                  <div class="flex flex-row space-x-2">
                    <div class="bg-black font-extrabold uppercase items-center text-center p-5 rounded flex-grow"></div>
                    <div class="bg-black w-16 font-extrabold uppercase flex justify-center items-center rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div class="mt-6 flex justify-end ">
              <div class="bg-black inline-block p-2 rounded">
                <p class="font-bold uppercase text-3xl text-white">
                  {t("total")} &nbsp;&nbsp;{t("number", { count: total })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div class="min-w-full flex flex-row justify-center">
        <div
          class="rounded-full justify-center inline-block px-5 border-4 py-5 bg-gradient-to-tr from-blue-900 to-blue-700"
          style={{
            boxShadow: "3px 3px 2px black",
            transform: "translate(0px, -70px)",
          }}
        >
          <p
            class="self-center text-5xl text-white font-black"
            style={{ textShadow: "1px 2px 4px black" }}
          >
            {t("number", { count: props.timer })}
          </p>
        </div>
      </div>

      <div class="text-center">
        {total >= 200 ? (
          <p class="text-5xl mt-10 text-green-800">{t("win")}</p>
        ) : null}
      </div>
    </div>
  );
}
