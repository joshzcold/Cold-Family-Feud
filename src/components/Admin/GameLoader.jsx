import { useTranslation } from "react-i18next";
import "@/i18n/i18n";
import { handleCsvFile, handleJsonFile } from "@/lib/utils";

function isValidFileType(file, allowedTypes) {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split(".").pop();

  if (!allowedTypes[fileExtension]) {
    return false;
  }

  const mimePattern = allowedTypes[fileExtension].pattern;
  return mimePattern.test(file.type);
}

const GameLoader = ({
  gameSelector,
  send,
  setError,
  setCsvFileUpload,
  setCsvFileUploadText
}) => {
  const { i18n, t } = useTranslation();
  return (
    <div className="flex flex-col rounded  border-2">
      <div className="flex translate-y-3 flex-row  items-center justify-center space-x-5 p-2">
        {gameSelector.length > 0 ? (
          <div>
            <select
              id="gameSelector"
              defaultValue={""}
              className="rounded border-2 bg-secondary-500 text-foreground"
              onChange={(e) => {
                send({
                  action: "load_game",
                  file: e.target.value,
                  lang: i18n.language,
                });
              }}
            >
              <option disabled value="">
                {t("Select question set")}
              </option>
              {gameSelector.map((value, index) => (
                <option key={`set-${index}`} value={value}>
                  {value.replace(".json", "")}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div id="gamePickerFileUploadButton">
          <label htmlFor="gamePickerFileUpload">
            <div className="flex flow-row space-x-2 items-center">
              <div className="w-6">
                <svg
                  className="cursor-pointer fill-current text-secondary-900 hover:text-secondary-500"
                  viewBox="0 0 384 512"
                >
                  <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z" />
                </svg>
              </div>
              <div>
                <p className="text-secondary-900 text-s">{t("upload game")}</p>
                <p className="text-secondary-900 text-xs">.json, .csv</p>
              </div>
            </div>
          </label>
          {/* CSV Upload */}
          <input
            className="hidden"
            type="file"
            accept=".json, .csv"
            id="gamePickerFileUpload"
            onChange={(e) => {
              var file = document.getElementById("gamePickerFileUpload").files[0];

              if (file) {
                if (file.size > process.env.NEXT_PUBLIC_MAX_CSV_UPLOAD_SIZE_MB * 1024 * 1024) {
                  console.error("This csv file is too large");
                  props.setError(t(ERROR_CODES.CSV_TOO_LARGE));
                  return;
                }
              }

              const allowedTypes = {
                json: {
                  pattern: /^application\/(json|.*\+json)$/,
                  handler: (file) =>
                    handleJsonFile(file, {
                      setError,
                      t,
                      send,
                    }),
                },
                csv: {
                  pattern: /^(text\/csv|application\/(vnd\.ms-excel|csv|x-csv|text-csv))$/,
                  handler: (file) =>
                    handleCsvFile(file, {
                      setError,
                      t,
                      setCsvFileUpload,
                      setCsvFileUploadText,
                    }),
                },
              };

              const fileType = isValidFileType(file, allowedTypes);
              if (!fileType) {
                setError(t(ERROR_CODES.UNKNOWN_FILE_TYPE));
                return;
              }

              const fileExtension = file.name.toLowerCase().split(".").pop();
              allowedTypes[fileExtension].handler(file);

              console.debug(file);

              // allow same file to be selected again
              document.getElementById("gamePickerFileUpload").value = null;
            }}
          />
        </div>
      </div>
      <div className="flex flex-row">
        <span className="inline shrink translate-x-3 translate-y-3 bg-background px-2 text-foreground">
          {t("Load Game")}
        </span>
        <div className="grow" />
      </div>
    </div>
  )
}

export default GameLoader;
