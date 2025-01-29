import { expect, test } from "@playwright/test";
import type { Browser } from "@playwright/test";
import { Setup } from "../lib/Setup.js";
import { AdminPage } from "../models/AdminPage.js";
import { GamePage } from "../models/GamePage.js";

test("can edit title text", async ({ browser }: { browser: Browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.titleTextInput.fill("New Game Title");
  await expect(gamePage.titleLogoImg).toContainText("New Game Title");
});

test("can edit first team name text", async ({ browser }: { browser: Browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.teamOneNameInput.fill("Team Alpha");
  await expect(gamePage.getTeamNameByIndex(0)).toContainText("Team Alpha");
});

test("can edit second team name text", async ({ browser }: { browser: Browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.teamTwoNameInput.fill("Team Beta");
  await expect(gamePage.getTeamNameByIndex(1)).toContainText("Team Beta");
});

test("can switch themes", async ({ browser }: { browser: Browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  const themeChanged = spectator.page.waitForFunction(() => document.body.classList.contains("darkTheme"), {
    timeout: 10000,
  });
  await adminPage.themeSwitcherInput.selectOption({ index: 1 });
  await themeChanged;
  await expect(spectator.page.locator("body")).toHaveClass("darkTheme bg-background");
});

test("can hide questions", async ({ browser }: { browser: Browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const adminPage = new AdminPage(host.page);
  const gamePage = new GamePage(spectator.page);

  await adminPage.gameSelector.selectOption({ index: 1 });
  await adminPage.startRoundOneButton.click();
  await adminPage.hideQuestionsInput.click();
  await expect(gamePage.roundQuestionText).toBeVisible();
});
