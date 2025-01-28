import path from "path";

export const PATHS = {
  GAME_JSON: path.join(process.cwd(), "static/game.json"),
  GAME_CSV: path.join(process.cwd(), "static/game.csv"),
  DOWNLOADED_GAME_JSON: path.join(process.cwd(), "static/downloaded-game.json"),
};
