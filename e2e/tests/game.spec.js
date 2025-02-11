// @ts-check
import { expect, test } from "@playwright/test";
import { Setup } from "./lib/Setup.js";
import { GamePage } from "./models/GamePage.js";

test("quit button should return to home page", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  const spectator = await s.addPlayer(true);
  const gamePage = new GamePage(spectator.page);
  await gamePage.quitButton.click();
  await expect(host.page).toHaveURL("/");
});
