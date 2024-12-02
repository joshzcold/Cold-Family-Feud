// @ts-check
import { test, expect } from "@playwright/test";
import { LoginPage } from "./models/LoginPage.js";
import { AdminPage } from "./models/AdminPage.js";

test("has correct room code", async ({ page }) => {
  await page.goto("/");

  const loginPage = new LoginPage(page);
  const adminPage = new AdminPage(page);
  const roomCode = await loginPage.hostRoom();
  await adminPage.openGameWindowButton.click();
  expect(page.url()).toBe("/game")
});
