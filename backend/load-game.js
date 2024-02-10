/**
 *  Add state data to game object for tracking current progress in game
 */
export function addGameKeys(data) {
  let returnGame = Object.assign(data);
  if (!returnGame.rounds) {
    throw new Error("Invalid game: missing 'rounds' list.");
  }
  returnGame.rounds.forEach((round) => {
    if (!round.answers) {
      throw new Error(
        `Invalid game: round ${round.question} is missing anwers.`,
      );
    }
    round.answers.forEach((answer) => {
      answer.trig = false;
    });
  });
  if (returnGame.final_round) {
    returnGame.final_round.forEach((round) => {
      round.selection = -1;
      round.points = 0;
      round.input = "";
      round.revealed = false;
    });
  }

  return returnGame;
}
