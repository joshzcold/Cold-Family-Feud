class GamePage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.roomCodeText = page.getByTestId("roomCodeText");
  }

}

export {GamePage}
