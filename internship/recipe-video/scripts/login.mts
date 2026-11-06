// Opens a real browser so you can sign in yourself; saves the session for the recording script.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync(".auth", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: false });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
await page.goto("http://localhost:3000/signin");
await page.waitForURL("**/dashboard**", { timeout: 15 * 60 * 1000 });
await page.waitForTimeout(2000);
await context.storageState({ path: ".auth/state.json", indexedDB: true });
await browser.close();
console.log("Session saved");
