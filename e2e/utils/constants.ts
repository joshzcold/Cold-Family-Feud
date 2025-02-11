import path from "path";

export const PATHS = {
  GAME_JSON: path.join(process.cwd(), "static/game.json"),
  QUICK_GAME_JSON: path.join(process.cwd(), "static/quick_game.json"),
  GAME_CSV: path.join(process.cwd(), "static/game.csv"),
  DOWNLOADED_GAME_JSON: path.join(process.cwd(), "/tmp/downloaded-game.json"),
};
