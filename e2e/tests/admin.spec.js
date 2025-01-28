// @ts-check
import path from "path";
import { expect, test } from "@playwright/test";
import { Setup } from "./lib/Setup.js";
import { AdminPage } from "./models/AdminPage.js";
import { BuzzerPage } from "./models/BuzzerPage.js";
import { GamePage } from "./models/GamePage.js";

const TEST_FILES = {
  GAME_JSON: path.join(__dirname, "../static/game.json"),
  GAME_CSV: path.join(__dirname, "../static/game.csv"),
};

test.afterEach(async ({ page }) => {
  await page.close();
});

test("has correct room code", async ({ browser, baseURL }) => {
  const s = new Setup(browser);
  const host = await s.host();

  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(host.page);

  const gameUrl = await adminPage.openGameWindowButton.getAttribute("href");
  await host.page.goto(gameUrl);
  expect(host.page.url()).toEqual(baseURL + "/game");
  expect(await gamePage.roomCodeText.innerText()).toEqual(s.roomCode);
});

test("can join game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player = await s.addPlayer();
  const buzzerPagePlayer = new BuzzerPage(player.page);
  const adminPage = new AdminPage(host.page);
  expect(buzzerPagePlayer.titleLogoImg).toBeVisible();
  expect(await buzzerPagePlayer.waitingForHostText.innerText()).toEqual("Waiting for host to start");
});

test("can pick game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player = await s.addPlayer();
  const adminPage = new AdminPage(host.page);
  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.startRoundOneButton.click();
  const buzzerPage = new BuzzerPage(player.page);
  expect(buzzerPage.answer0UnAnswered).toBeVisible();
});

test("can edit game settings", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });

  await adminPage.titleTextInput.fill("Test Title");
  await host.page.waitForTimeout(500);

  await adminPage.teamOneNameInput.fill("");
  await adminPage.teamOneNameInput.fill("Test 1");
  await host.page.waitForTimeout(500);

  await adminPage.teamTwoNameInput.fill("");
  await adminPage.teamTwoNameInput.fill("Test 2");
  await host.page.waitForTimeout(500);

  await adminPage.titleCardButton.click();
  await expect(async () => {
    expect(await gamePage.titleLogoImg.innerText()).toContain("Test Title");
    expect(await gamePage.getTeamNameText(0)).toContain("Test 1");
    expect(await gamePage.getTeamNameText(1)).toContain("Test 2");
  }).toPass();
  await adminPage.startRoundOneButton.click();
  await adminPage.hideQuestionsInput.click();
  expect(gamePage.roundQuestionText).toBeVisible();
  await adminPage.themeSwitcherInput.selectOption({ index: 1 });
  expect(spectator.page.locator("body")).toHaveClass("darkTheme bg-background");
});

test("can upload game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player = await s.addPlayer();
  const adminPage = new AdminPage(host.page);
  const fileChooserPromise = host.page.waitForEvent("filechooser");
  await adminPage.gamePickerFileUpload.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(TEST_FILES.GAME_JSON);
  await expect(async () => {
    await adminPage.startRoundOneButton.click();
    const buzzerPage = new BuzzerPage(player.page);
    await expect(buzzerPage.answer0UnAnswered).toBeVisible();
    await adminPage.question0Button.click();
    await expect(buzzerPage.answer0Answered).toBeVisible();
    await expect(adminPage.currentRoundQuestionText).toContainText("Name Something That People Could Watch For Hours");
  }).toPass();
});

test("can upload csv game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const adminPage = new AdminPage(host.page);
  const fileChooserPromise = host.page.waitForEvent("filechooser");
  await adminPage.gamePickerFileUpload.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(TEST_FILES.GAME_CSV);
  expect(adminPage.csvErrorText).not.toBeVisible();
  await adminPage.csvSetNoHeaderInput.click();
  expect(adminPage.csvErrorText).toBeVisible();
  await adminPage.csvSetNoHeaderInput.click();

  await adminPage.csvSetRoundCountInput.focus();
  await adminPage.csvSetRoundCountInput.press("Backspace");

  await adminPage.csvFinalRoundTimerInput.focus();
  await adminPage.csvFinalRoundTimerInput.press("Backspace");
  await adminPage.csvFinalRoundTimerInput.press("Backspace");

  await adminPage.csvFinalRound2ndTimerInput.focus();
  await adminPage.csvFinalRound2ndTimerInput.press("Backspace");
  await adminPage.csvFinalRound2ndTimerInput.press("Backspace");

  await adminPage.csvSetRoundCountInput.fill("5");
  await adminPage.csvFinalRoundTimerInput.fill("15");
  await adminPage.csvFinalRound2ndTimerInput.fill("20");
  await adminPage.csvFileUploadSubmitButton.click();
  await adminPage.startRoundOneButton.click();
  expect(adminPage.currentRoundQuestionText).toContainText("We Asked 100 Moms");
  await adminPage.quitButton.click();
});

test("can select final round answers", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player = await s.addPlayer();
  const adminPage = new AdminPage(host.page);
  const fileChooserPromise = host.page.waitForEvent("filechooser");
  await adminPage.gamePickerFileUpload.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(TEST_FILES.GAME_JSON);
  await adminPage.startRoundOneButton.click();
  const buzzerPage = new BuzzerPage(player.page);
  await adminPage.finalRoundButton.click();

  await adminPage.finalRoundAnswer0Input.fill("test 1");
  await adminPage.finalRoundAnswer0Selector.selectOption({ index: 1 });
  await adminPage.finalRoundAnswer0RevealButton.click();
  await adminPage.finalRoundAnswers0SubmitButton.click();

  await adminPage.finalRoundAnswer1Input.fill("test 2");
  await adminPage.finalRoundAnswer1Selector.selectOption({ index: 1 });
  await adminPage.finalRoundAnswer1RevealButton.click();
  await adminPage.finalRoundAnswers1SubmitButton.click();

  expect(await buzzerPage.finalRound1Answer0Text.innerText()).toBe("TEST 1");
  expect(await buzzerPage.finalRound1Answer1Text.innerText()).toBe("TEST 2");

  await adminPage.startFinalRound2Button.click();

  await adminPage.finalRoundAnswer1Input.fill("test 3");
  await adminPage.finalRoundAnswer1Selector.selectOption({ index: 1 });
  await adminPage.finalRoundAnswer1RevealButton.click();
  await adminPage.finalRoundAnswers1SubmitButton.click();

  await adminPage.revealFirstRoundFinalButton.click();

  expect(await buzzerPage.finalRound1Answer0Text.innerText()).toBe("TEST 1");
  expect(await buzzerPage.finalRound1Answer1Text.innerText()).toBe("TEST 2");

  expect(await buzzerPage.finalRound2Answer1Text.innerText()).toBe("TEST 3");
});

test("can see mistakes", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.startRoundOneButton.click();

  await adminPage.team0MistakeButton.click();
  await host.page.waitForTimeout(500);
  await adminPage.team0MistakeButton.click();
  await host.page.waitForTimeout(500);
  await adminPage.team1MistakeButton.click();
  await host.page.waitForTimeout(500);

  await expect(async () => {
    const count1 = await gamePage.team0MistakesList.locator("div").count();
    const count2 = await gamePage.team1MistakesList.locator("div").count();
    expect(count1).toBe(2);
    expect(count2).toBe(1);
  }).toPass({ timeout: 5000 });
});

test("can use timer controls", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.startRoundOneButton.click();
  await adminPage.finalRoundButton.click();

  await expect(async () => {
    const timerText = await gamePage.finalRoundTimerText.innerText();
    const timerNum = parseInt(timerText.replace(/^\D+/g, ""));
    expect(timerNum).toBeGreaterThan(0);
  }).toPass({ timeout: 5000 });

  const currentTimerText = await gamePage.finalRoundTimerText.innerText();
  const currentTimerNum = parseInt(currentTimerText.replace(/^\D+/g, ""));
  expect(currentTimerNum).toBeGreaterThan(0);

  await adminPage.startTimerButton.click();

  await host.page.waitForTimeout(2000);
  await adminPage.stopTimerButton.click();
  const newTimerText = await gamePage.finalRoundTimerText.innerText();
  const newTimerNum = parseInt(newTimerText.replace(/^\D+/g, ""));

  expect(currentTimerNum).toBeGreaterThan(newTimerNum);

  await expect(async () => {
    await adminPage.resetTimerButton.click();
    const resetTimerText = await gamePage.finalRoundTimerText.innerText();
    const resetTimerNum = parseInt(resetTimerText.replace(/^\D+/g, ""));
    expect(currentTimerNum).toBe(resetTimerNum);
  }).toPass({ timeout: 5000 });
});

test("can track points between rounds", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.startRoundOneButton.click();

  await adminPage.question0Button.click();
  await adminPage.question1Button.click();
  const points1Text = await adminPage.question0Button.innerText();
  const points2Text = await adminPage.question1Button.innerText();
  const points1 = parseInt(points1Text.replace(/^\D+/g, ""));
  const points2 = parseInt(points2Text.replace(/^\D+/g, ""));

  const pointsTotal = points1 + points2;

  await adminPage.team0GivePointsButton.click();
  await expect(async () => {
    expect(await gamePage.roundPointsTeam1.textContent()).toBe(pointsTotal.toString());
    expect(await gamePage.roundPointsTeamtotal.textContent()).toBe(pointsTotal.toString());
  }).toPass({ timeout: 2000 });

  await adminPage.nextRoundButton.click();
  await expect(async () => {
    expect(await gamePage.roundPointsTeam1.textContent()).toBe(pointsTotal.toString());
    expect(await gamePage.roundPointsTeamtotal.textContent()).toBe("0");
  }).toPass({ timeout: 2000 });

  const points1Text_2 = await adminPage.question0Button.innerText();
  const points2Text_2 = await adminPage.question1Button.innerText();
  const points1_2 = parseInt(points1Text_2.replace(/^\D+/g, ""));
  const points2_2 = parseInt(points2Text_2.replace(/^\D+/g, ""));
  const points2TotalPlusPrevious = points1_2 + points2_2 + pointsTotal;
  const points2Total = points1_2 + points2_2;
  await adminPage.question0Button.click();
  await adminPage.question1Button.click();
  await adminPage.team0GivePointsButton.click();
  await expect(async () => {
    expect(await gamePage.roundPointsTeam1.textContent()).toBe(points2TotalPlusPrevious.toString());
    expect(await gamePage.roundPointsTeamtotal.textContent()).toBe(points2Total.toString());
  }).toPass({ timeout: 2000 });
  await adminPage.roundSelector.selectOption({ index: 0 });

  await expect(async () => {
    expect(await gamePage.roundPointsTeam1.textContent()).toBe(points2TotalPlusPrevious.toString());
    expect(await gamePage.roundPointsTeamtotal.textContent()).toBe(pointsTotal.toString());
  }).toPass({ timeout: 2000 });
});

test("can hide game board from player", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player1 = await s.addPlayer();
  const buzzerPage1 = new BuzzerPage(player1.page);

  const adminPage = new AdminPage(host.page);
  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.startRoundOneButton.click({ timeout: 2000 });
  await expect(buzzerPage1.playerBlindFoldedText).not.toBeVisible({ timeout: 2000 });
  await adminPage.player0Team1HideGameButton.click({ timeout: 2000 });
  await expect(buzzerPage1.playerBlindFoldedText).toBeVisible({ timeout: 2000 });
});

test("can answer final round questions", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.finalRoundButton.click();

  await adminPage.finalRoundAnswer0Input.fill("Answer One");
  await adminPage.finalRoundAnswer0Selector.selectOption({ index: 1 });

  await expect(async () => {
    const finalRound0Text = await adminPage.page.$eval(
      "#finalRoundAnswer0Selector",
      (sel) => sel.options[sel.options.selectedIndex].textContent
    );
    const finalRound0PointsValue = parseInt(finalRound0Text.replace(/^\D+/g, ""));
    await adminPage.finalRoundAnswer0RevealButton.click();
    await adminPage.finalRoundAnswers0SubmitButton.click();

    await expect(gamePage.finalRound1Answer0Text).toBeVisible({ timeout: 2000 });
    await expect(gamePage.finalRound1PointsTotalText).toBeVisible({ timeout: 2000 });
    expect(await gamePage.finalRound1PointsTotalText.textContent()).toBe(finalRound0PointsValue.toString());
  }).toPass({ timeout: 2000 });
});
