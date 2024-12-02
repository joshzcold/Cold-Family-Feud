class BuzzerPage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.xImg = page.getByTestId("xImg");
    this.quitButton = page.getByTestId("quitButton");
    this.buzzerButtonPressed = page.getByTestId("buzzerButtonPressed");
    this.buzzerButton = page.getByTestId("buzzerButton");
    this.titleLogoUserUploaded = page.getByTestId("titleLogoUserUploaded");
    this.titleLogoImg = page.getByTestId("titleLogoImg");
    this.joinTeam1 = page.getByTestId("joinTeam1");
    this.joinTeam2 = page.getByTestId("joinTeam2");
    this.registerBuzzerButton = page.getByTestId("registerBuzzerButton");
    this.openGameWindowButton = page.getByTestId("openGameWindowButton");
    this.loadingText = page.getByTestId("loadingText");
    this.waitingForHostText = page.getByTestId("waitingForHostText");
    this.answer0UnAnswered = page.getByTestId("answer0UnAnswered");
    this.answer1UnAnswered = page.getByTestId("answer1UnAnswered");
    this.answer2UnAnswered = page.getByTestId("answer2UnAnswered");
    this.answer3UnAnswered = page.getByTestId("answer3UnAnswered");
    this.answer4UnAnswered = page.getByTestId("answer4UnAnswered");
    this.answer5UnAnswered = page.getByTestId("answer5UnAnswered");
    this.answer6UnAnswered = page.getByTestId("answer6UnAnswered");
    this.answer7UnAnswered = page.getByTestId("answer7UnAnswered");
    this.answer8UnAnswered = page.getByTestId("answer8UnAnswered");
  }
}

export { BuzzerPage };
