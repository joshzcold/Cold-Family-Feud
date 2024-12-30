class AdminPage {
  /**
   * @param {import('playwright').Page} page
   */
  // prettier-ignore
  constructor(page) {
    this.page = page;

    this.backToRound1FinalButton = page.getByTestId("backToRound1FinalButton");
    this.clearBuzzersButton = page.getByTestId("clearBuzzersButton");
    this.clearBuzzersButtonDisabled = page.getByTestId("clearBuzzersButtonDisabled",);
    this.createNewGameButton = page.getByTestId("createNewGameButton");
    this.csvCancelUploadButton = page.getByTestId("csvCancelUploadButton")
    this.csvErrorText = page.getByTestId("csvErrorText")
    this.csvFileUploadSubmitButton = page.getByTestId("csvFileUploadSubmitButton")
    this.csvFileUploadSubmitButtonDisabled = page.getByTestId("csvFileUploadSubmitButtonDisabled")
    this.csvFinalRound2ndTimerInput = page.getByTestId("csvFinalRound2ndTimerInput")
    this.csvFinalRoundTimerInput = page.getByTestId("csvFinalRoundTimerInput")
    this.csvRow0 = page.getByTestId("csvRow0")
    this.csvRow1 = page.getByTestId("csvRow1")
    this.csvRow2 = page.getByTestId("csvRow2")
    this.csvRow3 = page.getByTestId("csvRow3")
    this.csvRow4 = page.getByTestId("csvRow4")
    this.csvRow5 = page.getByTestId("csvRow5")
    this.csvRow6 = page.getByTestId("csvRow6")
    this.csvRow7 = page.getByTestId("csvRow7")
    this.csvSetFinalRoundCountInput = page.getByTestId("csvSetFinalRoundCountInput")
    this.csvSetNoHeaderInput = page.getByTestId("csvSetNoHeaderInput")
    this.csvSetRoundCountInput = page.getByTestId("csvSetRoundCountInput")
    this.currentRoundQuestionText = page.getByTestId("currentRoundQuestionText",);
    this.currentScreenText = page.getByTestId("currentScreenText");
    this.deleteLogoButton = page.getByTestId("deleteLogoButton");
    this.errorText = page.getByTestId("errorText");
    this.finalRoundAnswer0Input = page.getByTestId("finalRoundAnswer0Input")
    this.finalRoundAnswer0RevealButton = page.getByTestId("finalRoundAnswer0RevealButton")
    this.finalRoundAnswer0Selector = page.getByTestId("finalRoundAnswer0Selector")
    this.finalRoundAnswer1Input = page.getByTestId("finalRoundAnswer1Input")
    this.finalRoundAnswer1RevealButton = page.getByTestId("finalRoundAnswer1RevealButton")
    this.finalRoundAnswer1Selector = page.getByTestId("finalRoundAnswer1Selector")
    this.finalRoundAnswer2Input = page.getByTestId("finalRoundAnswer2Input")
    this.finalRoundAnswer2RevealButton = page.getByTestId("finalRoundAnswer2RevealButton")
    this.finalRoundAnswer2Selector = page.getByTestId("finalRoundAnswer2Selector")
    this.finalRoundAnswer3Input = page.getByTestId("finalRoundAnswer3Input")
    this.finalRoundAnswer3RevealButton = page.getByTestId("finalRoundAnswer3RevealButton")
    this.finalRoundAnswer3Selector = page.getByTestId("finalRoundAnswer3Selector")
    this.finalRoundAnswer4Input = page.getByTestId("finalRoundAnswer4Input")
    this.finalRoundAnswer4RevealButton = page.getByTestId("finalRoundAnswer4RevealButton")
    this.finalRoundAnswer4Selector = page.getByTestId("finalRoundAnswer4Selector")
    this.finalRoundAnswer5Input = page.getByTestId("finalRoundAnswer5Input")
    this.finalRoundAnswer5RevealButton = page.getByTestId("finalRoundAnswer5RevealButton")
    this.finalRoundAnswer5Selector = page.getByTestId("finalRoundAnswer5Selector")
    this.finalRoundAnswer6Input = page.getByTestId("finalRoundAnswer6Input")
    this.finalRoundAnswer6RevealButton = page.getByTestId("finalRoundAnswer6RevealButton")
    this.finalRoundAnswer6Selector = page.getByTestId("finalRoundAnswer6Selector")
    this.finalRoundAnswer7Input = page.getByTestId("finalRoundAnswer7Input")
    this.finalRoundAnswer7RevealButton = page.getByTestId("finalRoundAnswer7RevealButton")
    this.finalRoundAnswer7Selector = page.getByTestId("finalRoundAnswer7Selector")
    this.finalRoundAnswer8Input = page.getByTestId("finalRoundAnswer8Input")
    this.finalRoundAnswer8RevealButton = page.getByTestId("finalRoundAnswer8RevealButton")
    this.finalRoundAnswer8Selector = page.getByTestId("finalRoundAnswer8Selector")
    this.finalRoundAnswer9Input = page.getByTestId("finalRoundAnswer9Input")
    this.finalRoundAnswer9RevealButton = page.getByTestId("finalRoundAnswer9RevealButton")
    this.finalRoundAnswer9Selector = page.getByTestId("finalRoundAnswer9Selector")
    this.finalRoundAnswers0SubmitButton = page.getByTestId("finalRoundAnswers0SubmitButton")
    this.finalRoundAnswers1SubmitButton = page.getByTestId("finalRoundAnswers1SubmitButton")
    this.finalRoundAnswers2SubmitButton = page.getByTestId("finalRoundAnswers2SubmitButton")
    this.finalRoundAnswers3SubmitButton = page.getByTestId("finalRoundAnswers3SubmitButton")
    this.finalRoundAnswers4SubmitButton = page.getByTestId("finalRoundAnswers4SubmitButton")
    this.finalRoundAnswers5SubmitButton = page.getByTestId("finalRoundAnswers5SubmitButton")
    this.finalRoundAnswers6SubmitButton = page.getByTestId("finalRoundAnswers6SubmitButton")
    this.finalRoundAnswers7SubmitButton = page.getByTestId("finalRoundAnswers7SubmitButton")
    this.finalRoundAnswers8SubmitButton = page.getByTestId("finalRoundAnswers8SubmitButton")
    this.finalRoundAnswers9SubmitButton = page.getByTestId("finalRoundAnswers9SubmitButton")
    this.finalRoundButton = page.getByTestId("finalRoundButton");
    this.finalRoundNumberText = page.getByTestId("finalRoundNumberText");
    this.finalRoundTimerText = page.getByTestId("finalRoundTimerText")
    this.finalRoundTitle = page.getByTestId("finalRoundTitle")
    this.finalRoundTitleChangerInput = page.getByTestId("finalRoundTitleChangerInput")
    this.finalRoundTotalPointsText = page.getByTestId("finalRoundTotalPointsText")
    this.finalRoundWinText = page.getByTestId("finalRoundWinText")
    this.gamePickerFileUpload = page.getByTestId("gamePickerFileUploadButton");
    this.gameSelector = page.getByTestId("gameSelector");
    this.hideFirstRoundAnswersButton = page.getByTestId("hideFirstRoundAnswersButton",);
    this.hideQuestionsInput = page.getByTestId("hideQuestionsInput")
    this.logoUpload = page.getByTestId("logoUpload");
    this.multiplierInput = page.getByTestId("multiplierInput");
    this.multiplierText = page.getByTestId("multiplierText");
    this.nextRoundButton = page.getByTestId("nextRoundButton");
    this.openGameWindowButton = page.getByTestId("openGameWindowButton");
    this.pointsNumberText = page.getByTestId("pointsNumberText");
    this.pointsText = page.getByTestId("pointsText");
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
    this.quitButton = page.getByTestId("quitButton");
    this.resetMistakesButton = page.getByTestId("resetMistakesButton");
    this.revealFirstRoundFinalButton = page.getByTestId("revealFirstRoundFinalButton",);
    this.roomCodeText = page.getByTestId("roomCodeText");
    this.roundSelector = page.getByTestId("roundSelector");
    this.showMistakeButton = page.getByTestId("showMistakeButton");
    this.startFinalRound2Button = page.getByTestId("startFinalRound2Button");
    this.startRoundOneButton = page.getByTestId("startRoundOneButton");
    this.startTimerButton = page.getByTestId("startTimerButton");
    this.resetTimerButton = page.getByTestId("resetTimerButton")
    this.stopTimerButton = page.getByTestId("stopTimerButton");
    this.teamOneNameInput = page.getByTestId("teamOneNameInput");
    this.teamOnePointsInput = page.getByTestId("teamOnePointsInput");
    this.teamTwoNameInput = page.getByTestId("teamTwoNameInput");
    this.teamTwoPointsInput = page.getByTestId("teamTwoPointsInput");
    this.themeSwitcherInput = page.getByTestId("themeSwitcherInput")
    this.titleCardButton = page.getByTestId("titleCardButton");
    this.titleTextInput = page.getByTestId("titleTextInput");

    this.playerBuzzed0TeamNameText = page.getByTestId("playerBuzzed0TeamNameText")
    this.playerBuzzed1TeamNameText = page.getByTestId("playerBuzzed1TeamNameText")
    this.playerBuzzed2TeamNameText = page.getByTestId("playerBuzzed2TeamNameText")
    this.playerBuzzed3TeamNameText = page.getByTestId("playerBuzzed3TeamNameText")
    this.playerBuzzed4TeamNameText = page.getByTestId("playerBuzzed4TeamNameText")

    this.playerBuzzed0NameText = page.getByTestId("playerBuzzed0NameText")
    this.playerBuzzed1NameText = page.getByTestId("playerBuzzed1NameText")
    this.playerBuzzed2NameText = page.getByTestId("playerBuzzed2NameText")
    this.playerBuzzed3NameText = page.getByTestId("playerBuzzed3NameText")
    this.playerBuzzed4NameText = page.getByTestId("playerBuzzed4NameText")

    this.playerBuzzed0BuzzerTimeText = page.getByTestId("playerBuzzed0BuzzerTimeText")
    this.playerBuzzed1BuzzerTimeText = page.getByTestId("playerBuzzed1BuzzerTimeText")
    this.playerBuzzed2BuzzerTimeText = page.getByTestId("playerBuzzed2BuzzerTimeText")
    this.playerBuzzed3BuzzerTimeText = page.getByTestId("playerBuzzed3BuzzerTimeText")
    this.playerBuzzed4BuzzerTimeText = page.getByTestId("playerBuzzed4BuzzerTimeText")

    this.player0Team1QuitButton = page.getByTestId("player0Team1QuitButton")
    this.player1Team1QuitButton = page.getByTestId("player1Team1QuitButton")
    this.player2Team1QuitButton = page.getByTestId("player2Team1QuitButton")
    this.player3Team1QuitButton = page.getByTestId("player3Team1QuitButton")

    this.player0Team2QuitButton = page.getByTestId("player0Team2QuitButton")
    this.player1Team2QuitButton = page.getByTestId("player1Team2QuitButton")
    this.player2Team2QuitButton = page.getByTestId("player2Team2QuitButton")
    this.player3Team2QuitButton = page.getByTestId("player3Team2QuitButton")

    this.team0MistakeButton = page.getByTestId("team0MistakeButton")
    this.team1MistakeButton = page.getByTestId("team1MistakeButton")
    this.team0GivePointsButton = page.getByTestId("team0GivePointsButton")
    this.team1GivePointsButton = page.getByTestId("team1GivePointsButton")
  }
}

export { AdminPage };
