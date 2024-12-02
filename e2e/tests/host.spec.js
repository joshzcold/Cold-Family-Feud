// @ts-check
import { test, expect } from "@playwright/test";
import { LoginPage } from "./models/LoginPage.js";
import { AdminPage } from "./models/AdminPage.js";
import { GamePage } from "./models/GamePage.js";

test("has correct room code", async ({ page, baseURL }) => {
  await page.goto("/");

  const loginPage = new LoginPage(page);
  const adminPage = new AdminPage(page);
  const gamePage = new GamePage(page);
  const roomCode = await loginPage.hostRoom();
  const gameUrl = await adminPage.openGameWindowButton.getAttribute("href");
  await page.goto(gameUrl);
  expect(page.url()).toEqual(baseURL + "/game");
  expect(await gamePage.roomCodeText.innerText()).toEqual(roomCode);
});
