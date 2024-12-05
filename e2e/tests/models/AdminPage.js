class AdminPage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.deleteLogoButton = page.getByTestId("deleteLogoButton");
    this.logoUpload = page.getByTestId("logoUpload");
    this.roomCodeText = page.getByTestId("roomCodeText");
    this.openGameWindowButton = page.getByTestId("openGameWindowButton");
    this.createNewGameButton = page.getByTestId("createNewGameButton");
    this.quitButton = page.getByTestId("quitButton");
    this.gameSelector = page.getByTestId("gameSelector");
    this.gamePickerFileUpload = page.getByTestId("gamePickerFileUploadButton");
    this.titleTextInput = page.getByTestId("titleTextInput");
    this.teamOneNameInput = page.getByTestId("teamOneNameInput");
    this.teamOnePointsInput = page.getByTestId("teamOnePointsInput");
    this.teamTwoNameInput = page.getByTestId("teamTwoNameInput");
    this.teamTwoPointsInput = page.getByTestId("teamTwoPointsInput");
    this.errorText = page.getByTestId("errorText");
    this.currentScreenText = page.getByTestId("currentScreenText");
    this.titleCardButton = page.getByTestId("titleCardButton");
    this.finalRoundButton = page.getByTestId("finalRoundButton");
    this.roundSelector = page.getByTestId("roundSelector");
    this.startRoundOneButton = page.getByTestId("startRoundOneButton");
    this.nextRoundButton = page.getByTestId("nextRoundButton");
    this.showMistakeButton = page.getByTestId("showMistakeButton");
    this.resetMistakesButton = page.getByTestId("resetMistakesButton");
    this.currentRoundQuestionText = page.getByTestId(
      "currentRoundQuestionText",
    );
    this.pointsText = page.getByTestId("pointsText");
    this.pointsNumberText = page.getByTestId("pointsNumberText");
    this.multiplierText = page.getByTestId("multiplierText");
    this.multiplierInput = page.getByTestId("multiplierInput");
    this.clearBuzzersButton = page.getByTestId("clearBuzzersButton");
    this.clearBuzzersButtonDisabled = page.getByTestId(
      "clearBuzzersButtonDisabled",
    );
    this.finalRoundNumberText = page.getByTestId("finalRoundNumberText");
    this.startFinalRound2Button = page.getByTestId("startFinalRound2Button");
    this.backToRound1FinalButton = page.getByTestId("backToRound1FinalButton");
    this.revealFirstRoundFinalButton = page.getByTestId(
      "revealFirstRoundFinalButton",
    );
    this.hideFirstRoundAnswersButton = page.getByTestId(
      "hideFirstRoundAnswersButton",
    );
    this.startTimerButton = page.getByTestId("startTimerButton");
    this.stopTimerButton = page.getByTestId("stopTimerButton");
    this.pointsText = page.getByTestId("pointsText");
    this.pointsNumberText = page.getByTestId("pointsNumberText");
    this.multiplierText = page.getByTestId("multiplierText");
    this.multiplierInput = page.getByTestId("multiplierInput");
    this.clearBuzzersButton = page.getByTestId("clearBuzzersButton");
    this.clearBuzzersButtonDisabled = page.getByTestId(
      "clearBuzzersButtonDisabled",
    );
    this.finalRoundNumberText = page.getByTestId("finalRoundNumberText");
    this.startFinalRound2Button = page.getByTestId("startFinalRound2Button");
    this.backToRound1FinalButton = page.getByTestId("backToRound1FinalButton");
    this.revealFirstRoundFinalButton = page.getByTestId(
      "revealFirstRoundFinalButton",
    );
    this.hideFirstRoundAnswersButton = page.getByTestId(
      "hideFirstRoundAnswersButton",
    );
    this.startTimerButton = page.getByTestId("startTimerButton");
    this.stopTimerButton = page.getByTestId("stopTimerButton");
    this.question0Button = page.getByTestId("question0Button")
    this.question1Button = page.getByTestId("question1Button")
    this.question2Button = page.getByTestId("question2Button")
    this.question3Button = page.getByTestId("question3Button")
    this.question4Button = page.getByTestId("question4Button")
    this.question5Button = page.getByTestId("question5Button")
    this.question6Button = page.getByTestId("question6Button")
    this.question7Button = page.getByTestId("question7Button")
    this.question8Button = page.getByTestId("question8Button")
    this.question9Button = page.getByTestId("question9Button")
  }
}

export { AdminPage };
