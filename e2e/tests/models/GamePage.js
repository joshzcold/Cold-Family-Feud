class GamePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.answer0Answered = page.getByTestId("answer0Answered");
    this.answer0UnAnswered = page.getByTestId("answer0UnAnswered");
    this.answer1Answered = page.getByTestId("answer1Answered");
    this.answer1UnAnswered = page.getByTestId("answer1UnAnswered");
    this.answer2Answered = page.getByTestId("answer2Answered");
    this.answer2UnAnswered = page.getByTestId("answer2UnAnswered");
    this.answer3Answered = page.getByTestId("answer3Answered");
    this.answer3UnAnswered = page.getByTestId("answer3UnAnswered");
    this.answer4Answered = page.getByTestId("answer4Answered");
    this.answer4UnAnswered = page.getByTestId("answer4UnAnswered");
    this.answer5Answered = page.getByTestId("answer5Answered");
    this.answer5UnAnswered = page.getByTestId("answer5UnAnswered");
    this.answer6Answered = page.getByTestId("answer6Answered");
    this.answer6UnAnswered = page.getByTestId("answer6UnAnswered");
    this.answer7Answered = page.getByTestId("answer7Answered");
    this.answer7UnAnswered = page.getByTestId("answer7UnAnswered");
    this.answer8Answered = page.getByTestId("answer8Answered");
    this.answer8UnAnswered = page.getByTestId("answer8UnAnswered");
    this.finalRound0PointsTotalText = page.getByTestId("finalRound0PointsTotalText");
    this.finalRound1Answer0Text = page.getByTestId("finalRound1Answer0Text");
    this.finalRound1Answer1Text = page.getByTestId("finalRound1Answer1Text");
    this.finalRound1Answer2Text = page.getByTestId("finalRound1Answer2Text");
    this.finalRound1Answer3Text = page.getByTestId("finalRound1Answer3Text");
    this.finalRound1Answer4Text = page.getByTestId("finalRound1Answer4Text");
    this.finalRound1Answer5Text = page.getByTestId("finalRound1Answer5Text");
    this.finalRound1PointsTotalText = page.getByTestId("finalRound1PointsTotalText");
    this.finalRound2Answer0Text = page.getByTestId("finalRound2Answer0Text");
    this.finalRound2Answer1Text = page.getByTestId("finalRound2Answer1Text");
    this.finalRound2Answer2Text = page.getByTestId("finalRound2Answer2Text");
    this.finalRound2Answer3Text = page.getByTestId("finalRound2Answer3Text");
    this.finalRound2Answer4Text = page.getByTestId("finalRound2Answer4Text");
    this.finalRound2Answer5Text = page.getByTestId("finalRound2Answer5Text");
    this.roomCodeText = page.getByTestId("roomCodeText");
    this.roundMultiplyText = page.getByTestId("roundMultiplyText");
    this.roundPointsTeam1 = page.getByTestId("roundPointsTeam1");
    this.roundPointsTeam2 = page.getByTestId("roundPointsTeam2");
    this.roundPointsTeamtotal = page.getByTestId("roundPointsTeamtotal");
    this.roundQuestionText = page.getByTestId("roundQuestionText");
    this.teamNames = page.getByTestId("team-name");
    this.getTeamNameByIndex = (index) => this.teamNames.nth(index);
    this.titleLogoImg = page.getByTestId("titleLogoImg");
    this.titleLogoUserUploaded = page.getByTestId("titleLogoUserUploaded");
    this.waitingForHostText = page.getByTestId("waitingForHostText");
    this.xImg = page.getByTestId("xImg");
    this.team0MistakesList = page.getByTestId("team0MistakesList");
    this.team1MistakesList = page.getByTestId("team1MistakesList");
    this.roundPointsTeam1 = page.getByTestId("roundPointsTeam1");
    this.roundPointsTeam2 = page.getByTestId("roundPointsTeam2");
    this.roundPointsTeamtotal = page.getByTestId("roundPointsTeamtotal");
    this.finalRoundTimerText = page.getByTestId("finalRoundTimerText");
    this.quitButton = page.getByTestId("quitButton");
  }

  async getTeamNameText(index) {
    return await this.getTeamNameByIndex(index).textContent();
  }
}

export { GamePage };
