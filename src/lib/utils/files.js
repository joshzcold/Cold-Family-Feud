export function handleJsonFile(file, { setError, t, send }) {
    var reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = function(evt) {
      try {
        let data = JSON.parse(evt.target.result);
        console.debug(data);
        // TODO some error checking for invalid game data
        send({ action: "load_game", data: data });
      } catch (e) {
        console.error("Invalid JSON file");
        setError(t("Invalid JSON file"));
      }
    };
    reader.onerror = function(evt) {
      console.error("error reading file");
      setError(t("error reading file"));
    };
}
  
export function handleCsvFile(file, { setError, t, setCsvFileUpload, setCsvFileUploadText }) {
    var reader = new FileReader();
    reader.readAsText(file, "utf-8");
    reader.onload = function(evt) {
      let lineCount = evt.target.result.split("\n");
      if (lineCount.length > 30) {
        setError(t("This csv file is too large"));
      } else {
        setCsvFileUpload(file);
        setCsvFileUploadText(evt.target.result);
      }
    };
    reader.onerror = function(evt) {
      console.error("error reading file");
      setError(t("error reading file"));
    };
}