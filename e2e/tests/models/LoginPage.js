import { AdminPage } from "./AdminPage.js";

class LoginPage {
  /**
   * @param {import('playwright').Page} page
   */
  constructor(page) {
    this.page = page;
    this.roomCodeInput = page.getByTestId("roomCodeInput");
    this.playerNameInput = page.getByTestId("playerNameInput");
    this.joinRoomButton = page.getByTestId("joinRoomButton");
    this.hostRoomButton = page.getByTestId("hostRoomButton");
    this.errorText = page.getByTestId("errorText");
  }

  async hostRoom() {
    await this.hostRoomButton.click();
    let adminPage = new AdminPage(this.page);
    let roomCode = await adminPage.roomCodeText.innerText();
    return roomCode;
  }
}

export { LoginPage };
