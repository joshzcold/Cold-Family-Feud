// @ts-check
import { test, expect } from "@playwright/test";
import { AdminPage } from "./models/AdminPage.js";
import { GamePage } from "./models/GamePage.js";
import { BuzzerPage } from "./models/BuzzerPage.js";
import { Setup } from "./lib/Setup.js";
import path from "path";

test("has correct room code", async ({ browser, page, baseURL }) => {
  const s = new Setup(browser);
  const host = await s.host();

  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(host.page);

  const gameUrl = await adminPage.openGameWindowButton.getAttribute("href");
  await page.goto(gameUrl);
  expect(page.url()).toEqual(baseURL + "/game");
  expect(await gamePage.roomCodeText.innerText()).toEqual(s.roomCode);
});

test("can join game", async ({ browser }) => {
  const s = new Setup(browser);
  await s.host();
  const player = await s.addPlayer();
  const buzzerPagePlayer = new BuzzerPage(player.page);
  expect(buzzerPagePlayer.titleLogoImg).toBeVisible();
  expect(await buzzerPagePlayer.waitingForHostText.innerText()).toEqual(
    "Waiting for host to start",
  );
});

test("can pick game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player = await s.addPlayer();
  const adminPage = new AdminPage(host.page);
  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.startRoundOneButton.click()
  const buzzerPage = new BuzzerPage(player.page)
  expect(buzzerPage.answer0UnAnswered).toBeVisible()
});

test("can upload game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player = await s.addPlayer();
  const adminPage = new AdminPage(host.page);
  const fileChooserPromise = host.page.waitForEvent('filechooser')
  await adminPage.gamePickerFileUpload.click()
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, "../", "static", "game.json"))
  await adminPage.startRoundOneButton.click()
  const buzzerPage = new BuzzerPage(player.page)
  expect(buzzerPage.answer0UnAnswered).toBeVisible()
  await adminPage.question0Button.click()
  expect(buzzerPage.answer0Answered).toBeVisible()
  expect(adminPage.currentRoundQuestionText).toContainText("Name Something That People Could Watch For Hours")
});

test("can upload csv game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const adminPage = new AdminPage(host.page);
  const fileChooserPromise = host.page.waitForEvent('filechooser')
  await adminPage.gamePickerFileUpload.click()
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, "../", "static", "game.csv"))
  expect(adminPage.csvErrorText).toBeVisible()
  await adminPage.csvSetNoHeaderInput.click()
  expect(adminPage.csvErrorText).not.toBeVisible()

  await adminPage.csvSetRoundCountInput.focus()
  await adminPage.csvSetRoundCountInput.press("Backspace")

  await adminPage.csvFinalRoundTimerInput.focus()
  await adminPage.csvFinalRoundTimerInput.press("Backspace")
  await adminPage.csvFinalRoundTimerInput.press("Backspace")

  await adminPage.csvFinalRound2ndTimerInput.focus()
  await adminPage.csvFinalRound2ndTimerInput.press("Backspace")
  await adminPage.csvFinalRound2ndTimerInput.press("Backspace")

  await adminPage.csvSetRoundCountInput.type("5")
  await adminPage.csvFinalRoundTimerInput.type("15")
  await adminPage.csvFinalRound2ndTimerInput.type("20")
  await adminPage.csvFileUploadSubmitButton.click()
  await adminPage.startRoundOneButton.click()
  expect(adminPage.currentRoundQuestionText).toContainText("We Asked 100 Moms")
});

test("can select final round answers", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player = await s.addPlayer();
  const adminPage = new AdminPage(host.page);
  const fileChooserPromise = host.page.waitForEvent('filechooser')
  await adminPage.gamePickerFileUpload.click()
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, "../", "static", "game.json"))
  await adminPage.startRoundOneButton.click()
  const buzzerPage = new BuzzerPage(player.page)
  await adminPage.finalRoundButton.click()
  await adminPage.finalRoundAnswer0Input.type("test")
});
