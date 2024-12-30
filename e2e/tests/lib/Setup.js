import { AdminPage } from "../models/AdminPage.js";
import { BuzzerPage } from "../models/BuzzerPage.js";
import { LoginPage } from "../models/LoginPage.js";

class Setup {
  /**
   * @param {import('playwright').Browser} browser
   */
  constructor(browser) {
    this.browser = browser
    this.clients = {
      host: {},
      players: []
    }
    // swap team between players
    this.currentTeam = 0
    this.roomCode = null
  }

  async host() {
    const hostContext = await this.browser.newContext()
    this.clients.host = {
      context: hostContext,
      page: await hostContext.newPage()
    }
    await this.clients.host.page.goto("/")
    this.roomCode = await this.hostRoom(this.clients.host.page)
    console.log(`Started room: ${this.roomCode}`)
    return this.clients.host
  }

  /**
   * @returns {
   *  newPlayerObj {any}
   * }
   */
  async addPlayer(spectator = false) {
    const newPlayerContext = await this.browser.newContext()
    const newPlayerName = this.clients.players.length
    const newPlayerObj = {
      context: newPlayerContext,
      page: await newPlayerContext.newPage(),
      name: `Player ${newPlayerName}`,
      team: this.currentTeam,
    }

    this.clients.players.push(newPlayerObj)
    // flip the current team.
    this.currentTeam = 1 - this.currentTeam
    await newPlayerObj.page.goto("/")
    if (spectator) {
      await this.joinRoomSpectator(newPlayerObj.page, newPlayerObj.name)
      console.log(`Spectator ${newPlayerName} added to game`)
    } else {
      await this.joinRoom(newPlayerObj.page, newPlayerObj.team, newPlayerObj.name)
      console.log(`Player ${newPlayerName} added to game`)
    }
    return newPlayerObj
  }

  /**
   * @param {import('playwright').Page} page
   * @returns {
   *  roomCode {string}
   * } 
   */
  async hostRoom(page) {
    const loginPage = new LoginPage(page)
    await loginPage.hostRoomButton.click();
    let adminPage = new AdminPage(page);
    let roomCode = await adminPage.roomCodeText.innerText();
    // Type in lowercase to make sure client/server handles case correctly
    return roomCode;
  }

  /**
   * @param {import('playwright').Page} page
   * @param {string} roomCode
   * @param {int} teamNumber
   * @param {string} playerName
   */
  async joinRoom(page, teamNumber, playerName) {
    const bp = new BuzzerPage(page);
    const loginPage = new LoginPage(page);
    await loginPage.roomCodeInput.fill(this.roomCode);
    await loginPage.playerNameInput.fill(playerName);
    await loginPage.joinRoomButton.click();
    console.log(teamNumber)
    if (teamNumber === 0) {
      await bp.joinTeam1.click();
    } else if (teamNumber === 1) {
      await bp.joinTeam2.click();
    }
    await bp.registerBuzzerButton.click();
  }

  /**
   * @param {import('playwright').Page} page 
   * @param {string} playerName 
   */
  async joinRoomSpectator(page, playerName) {
    const bp = new BuzzerPage(page);
    const loginPage = new LoginPage(page);
    await loginPage.roomCodeInput.fill(this.roomCode);
    await loginPage.playerNameInput.fill(playerName);
    await loginPage.joinRoomButton.click();
    await bp.openGameWindowButton.click()
  }
}

export { Setup };
