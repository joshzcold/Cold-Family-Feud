// @ts-check
import { readFileSync } from "node:fs";
import path from "path";
import { expect, test } from "@playwright/test";
import { Setup } from "./lib/Setup.js";
import { NewGamePage } from "./models/NewGamePage.js";

test.afterEach(async ({ page }) => {
  await page.close();
});

test("Can create new game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  await host.page.goto("/new");
  const newGamePage = new NewGamePage(host.page);

  await newGamePage.round0QuestionInput.fill("Question 1");
  await newGamePage.round0Answer0NameInput.fill("Answer 1");
  await newGamePage.round0Answer0PointsInput.fill("");
  await newGamePage.round0Answer0PointsInput.fill("20");

  await newGamePage.finalRoundQuestion0Input.fill("");
  await newGamePage.finalRoundQuestion0Input.fill("Question 1");

  await newGamePage.finalRoundQuestion0AddAnswerButton.click();

  await newGamePage.finalRoundQuestion0Answer0Input.fill("Answer 1");
  await newGamePage.finalRoundQuestion0AnswerPoints0Input.fill("");
  await newGamePage.finalRoundQuestion0AnswerPoints0Input.fill("10");

  await newGamePage.finalRoundQuestion0AddAnswerButton.click();

  await newGamePage.finalRoundQuestion0Answer1Input.fill("Answer 2");
  await newGamePage.finalRoundQuestion0AnswerPoints1Input.fill("");
  await newGamePage.finalRoundQuestion0AnswerPoints1Input.fill("20");

  const downloadPromise = host.page.waitForEvent("download");
  await newGamePage.newGameSubmitButton.click();
  const download = await downloadPromise;

  // Wait for the download process to complete and save the downloaded file somewhere.
  await download.saveAs("/tmp/" + download.suggestedFilename());
  const jsonData = await JSON.parse(readFileSync("/tmp/new-cold-feud.json", "utf-8"));
  expect(jsonData.rounds[0].question).toBe("Question 1");
  expect(jsonData.rounds[0].answers[0].ans).toBe("Answer 1");
  expect(jsonData.final_round[0].question).toBe("Question 1");
  expect(jsonData.final_round[1].question).toBe("Question 2");
});

test("Can create new game upload existing game", async ({ browser }) => {
  const s = new Setup(browser);
  const host = await s.host();
  await host.page.goto("/new");
  const newGamePage = new NewGamePage(host.page);
  const fileChooserPromise = host.page.waitForEvent("filechooser");
  const gameFilePath = path.join(__dirname, "../", "static", "game.json");
  await newGamePage.gamePicker.click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(gameFilePath);
  const jsonData = await JSON.parse(readFileSync(gameFilePath, "utf-8"));
  await newGamePage.gamePickerSubmitButton.click();
  await expect(async () => {
    expect(await newGamePage.round0QuestionInput.inputValue()).toBe(jsonData.rounds[0].question);
    expect(await newGamePage.round1QuestionInput.inputValue()).toBe(jsonData.rounds[1].question);
    expect(await newGamePage.round2QuestionInput.inputValue()).toBe(jsonData.rounds[2].question);
    expect(await newGamePage.round3QuestionInput.inputValue()).toBe(jsonData.rounds[3].question);
    expect(await newGamePage.round4QuestionInput.inputValue()).toBe(jsonData.rounds[4].question);

    expect(await newGamePage.round5QuestionInput.inputValue()).toBe(jsonData.rounds[5].question);

    expect(await newGamePage.round5Answer0NameInput.inputValue()).toBe(jsonData.rounds[5].answers[0].ans.toString());
    expect(await newGamePage.round5Answer0PointsInput.inputValue()).toBe(jsonData.rounds[5].answers[0].pnt.toString());

    expect(await newGamePage.finalRoundQuestion0Input.inputValue()).toBe(jsonData.final_round[0].question);
    expect(await newGamePage.finalRoundQuestion0Answer0Input.inputValue()).toBe(
      jsonData.final_round[0].answers[0][0].toString()
    );
    expect(await newGamePage.finalRoundQuestion0AnswerPoints0Input.inputValue()).toBe(
      jsonData.final_round[0].answers[0][1].toString()
    );
  }).toPass();
});
