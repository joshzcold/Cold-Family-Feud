// @ts-check
import { test, expect } from "@playwright/test";
import { AdminPage } from "./models/AdminPage.js";
import { GamePage } from "./models/GamePage.js";
import { BuzzerPage } from "./models/BuzzerPage.js";
import { Setup } from "./lib/Setup.js";
import path from "path";

test("can use buzzers", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const player1 = await s.addPlayer();
  const buzzerPage1 = new BuzzerPage(player1.page);

  const player2 = await s.addPlayer();
  const buzzerPage2 = new BuzzerPage(player2.page);

  const player3 = await s.addPlayer();
  const buzzerPage3 = new BuzzerPage(player3.page);

  const adminPage = new AdminPage(host.page);
  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.startRoundOneButton.click();

  await buzzerPage1.buzzerButton.click()
  await buzzerPage2.buzzerButton.click()
  await buzzerPage3.buzzerButton.click()

  await expect(async () => {
    expect (adminPage.playerBuzzed0NameText).toBeVisible()
    expect (adminPage.playerBuzzed1NameText).toBeVisible()
    expect (adminPage.playerBuzzed2NameText).toBeVisible()
  }).toPass();

  await adminPage.clearBuzzersButton.click()

  await expect(async () => {
    expect (adminPage.playerBuzzed0NameText).not.toBeVisible()
    expect (adminPage.playerBuzzed1NameText).not.toBeVisible()
    expect (adminPage.playerBuzzed2NameText).not.toBeVisible()
  }).toPass();
});
