// Records the real app with Chrome's screencast, so the footage stays sharp.
import { chromium, type Locator, type Page } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "public/capture";
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const CURSOR = `
addEventListener("DOMContentLoaded", () => {
  const hide = document.createElement("style");
  hide.textContent = "nextjs-portal { display: none !important; } [data-radix-popper-content-wrapper] { zoom: 0.75; } [data-radix-popper-content-wrapper] > * { zoom: 1.3333; }";
  document.documentElement.appendChild(hide);
  const c = document.createElement("div");
  c.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24"><path d="M5 3l14 8-6 2-3 6z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  c.style.cssText = "position:fixed;left:-40px;top:-40px;z-index:2147483647;pointer-events:none;transition:transform .08s";
  document.documentElement.appendChild(c);
  addEventListener("mousemove", (e) => { c.style.left = e.clientX / 1.3333 + "px"; c.style.top = e.clientY / 1.3333 + "px"; }, true);
  addEventListener("mousedown", () => { c.style.transform = "scale(.8)"; }, true);
  addEventListener("mouseup", () => { c.style.transform = ""; }, true);
});`;

async function startClip(page: Page, name: string) {
    const dir = `${OUT}/${name}`;
    mkdirSync(dir, { recursive: true });
    const cdp = await page.context().newCDPSession(page);
    const frames: { t: number; file: string }[] = [];
    const events: { label: string; t: number }[] = [];
    let first = 0;
    cdp.on("Page.screencastFrame", async (f) => {
        const ts = f.metadata.timestamp ?? Date.now() / 1000;
        if (!first) first = ts;
        const file = `${String(frames.length).padStart(5, "0")}.jpg`;
        writeFileSync(`${dir}/${file}`, Buffer.from(f.data, "base64"));
        frames.push({ t: +(ts - first).toFixed(3), file });
        await cdp
            .send("Page.screencastFrameAck", { sessionId: f.sessionId })
            .catch(() => {});
    });
    await cdp.send("Page.startScreencast", {
        format: "jpeg",
        quality: 92,
        maxWidth: 1920,
        maxHeight: 1080,
        everyNthFrame: 1,
    });
    const started = Date.now();
    return {
        mark(label: string) {
            events.push({ label, t: +((Date.now() - started) / 1000).toFixed(2) });
        },
        async stop() {
            await wait(300);
            await cdp.send("Page.stopScreencast");
            writeFileSync(`${dir}/manifest.json`, JSON.stringify({ frames, events }));
            console.log(
                name,
                "frames:",
                frames.length,
                "last:",
                frames.at(-1)?.t,
                "events:",
                JSON.stringify(events)
            );
            await cdp.detach();
        },
    };
}

async function click(page: Page, target: Locator) {
    const box = await target.first().boundingBox();
    if (!box) throw new Error("Element not visible");
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 28 });
    await wait(150);
    await page.mouse.down();
    await wait(70);
    await page.mouse.up();
}

async function smoothScroll(page: Page, px: number, ms: number) {
    // Passed as text because tsx adds helpers that don't exist in the browser.
    await page.evaluate(`new Promise((done) => {
        const start = scrollY, t0 = performance.now();
        function tick(t) {
            const k = Math.min(1, (t - t0) / ${ms});
            const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
            scrollTo(0, start + ${px} * e);
            if (k < 1) requestAnimationFrame(tick); else done();
        }
        requestAnimationFrame(tick);
    })`);
}

async function addIngredients(page: Page, items: string[]) {
    const input = page.getByPlaceholder("e.g., chicken, rice, garlic");
    await click(page, input);
    for (const item of items) {
        await input.pressSequentially(item, { delay: 65 });
        await wait(120);
        await input.press("Enter");
        await wait(220);
    }
}

async function choose(page: Page, index: number, option: string) {
    await click(page, page.locator('[data-slot="select-trigger"]').nth(index));
    await wait(450);
    await click(page, page.getByRole("option", { name: option, exact: true }));
    await wait(350);
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const options = { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 };

// Test recipes that should not appear in the video. They stay in the account.
const HIDDEN = /poem|asdfgh|crispy plant chicken|cheesy plant-based cutlets/i;
// "--landing" re-records only the signed-out pages and keeps the other footage.
const LANDING_ONLY = process.argv.includes("--landing");
rmSync(LANDING_ONLY ? `${OUT}/landing` : OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Signed out: landing and sign-in pages
{
    const ctx = await browser.newContext(options);
    await ctx.addInitScript(CURSOR);
    const page = await ctx.newPage();
    await page.addInitScript("document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.zoom = '1.3333'; })");
    await page.goto(BASE, { waitUntil: "networkidle" });
    await wait(800);
    const clip = await startClip(page, "landing");
    await page.mouse.move(900, 300, { steps: 10 });
    await wait(1200);
    clip.mark("scroll");
    const height = await page.evaluate(
        () => document.documentElement.scrollHeight - innerHeight
    );
    await smoothScroll(page, height, 7000);
    await wait(500);
    await clip.stop();

    await page.goto(`${BASE}/signin`, { waitUntil: "networkidle" });
    await wait(600);
    await page.screenshot({ path: `${OUT}/signin.jpg`, type: "jpeg", quality: 95 });
    await ctx.close();
}

// Signed in: generate a recipe, get a rejection, view saved recipes
if (!LANDING_ONLY) {
    const ctx = await browser.newContext({ ...options, storageState: ".auth/state.json" });
    await ctx.addInitScript(CURSOR);
    const page = await ctx.newPage();
    await page.addInitScript("document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.zoom = '1.3333'; })");
    await page.route((u) => u.pathname === "/api/recipes", async (route) => {
        const url = new URL(route.request().url());
        const limit = Number(url.searchParams.get("limit")) || 0;
        if (limit) url.searchParams.set("limit", "100");
        const res = await route.fetch({ url: url.toString() });
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.recipes;
        const kept = list.filter(
            (r: { recipe?: { title?: string }; ingredients?: string[] }) =>
                !HIDDEN.test(r.recipe?.title ?? "") &&
                !HIDDEN.test((r.ingredients ?? []).join(" "))
        );
        const shown = limit ? kept.slice(0, limit) : kept;
        await route.fulfill({
            response: res,
            json: Array.isArray(data) ? shown : { ...data, recipes: shown },
        });
    });
    // Replays the curry Gemini already generated, so re-recording adds no duplicate recipe.
    let curryId = "";
    await page.route("**/api/generate-recipe", async (route) => {
        if (route.request().postDataJSON().ingredients.includes("asdfgh")) return route.continue();
        await wait(3800);
        await route.fulfill({ json: { recipeId: curryId } });
    });
    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    await page.getByPlaceholder("e.g., chicken, rice, garlic").waitFor({ timeout: 30000 });
    await wait(1500);
    const token = await page.evaluate("Object.keys(localStorage).filter(k => k.includes('auth-token')).map(k => JSON.parse(localStorage.getItem(k)).access_token)[0]");
    const all = await (await ctx.request.get(`${BASE}/api/recipes`, { headers: { authorization: `Bearer ${token}` } })).json();
    const list = Array.isArray(all) ? all : all.recipes;
    const curry = list.find((r: { recipe?: { title?: string } }) => r.recipe?.title === "Easy Vegan Chickpea and Tomato Curry");
    if (!curry) throw new Error("Curry recipe not found");
    curryId = curry._id;

    const gen = await startClip(page, "generate");
    await page.mouse.move(400, 200, { steps: 8 });
    await wait(500);
    gen.mark("ingredients");
    await addIngredients(page, ["chickpeas", "tomato", "coconut milk", "chicken"]);
    gen.mark("preferences");
    await choose(page, 0, "Dinner");
    await choose(page, 1, "Vegan");
    await choose(page, 2, "Easy");
    await wait(300);
    gen.mark("generate");
    await click(page, page.getByRole("button", { name: "Generate Recipe" }));
    await page.waitForURL("**/recipes/**", { timeout: 60000 });
    await page.getByRole("heading", { name: /Ingredients/ }).first().waitFor({ timeout: 30000 });
    gen.mark("recipe");
    await wait(1800);
    const h = await page.evaluate(
        () => document.documentElement.scrollHeight - innerHeight
    );
    gen.mark("scroll");
    await smoothScroll(page, h, 6500);
    await wait(900);
    gen.mark("end");
    await gen.stop();

    await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
    await page.getByPlaceholder("e.g., chicken, rice, garlic").waitFor();
    await wait(1200);
    const rej = await startClip(page, "reject");
    await page.mouse.move(400, 200, { steps: 8 });
    await wait(300);
    rej.mark("ingredients");
    await addIngredients(page, ["asdfgh", "qwerty", "zzzz"]);
    rej.mark("generate");
    await click(page, page.getByRole("button", { name: "Generate Recipe" }));
    await page.getByText("Let's try different ingredients").waitFor({ timeout: 60000 });
    rej.mark("popup");
    await wait(3000);
    await rej.stop();

    await page.goto(`${BASE}/recipes`, { waitUntil: "networkidle" });
    await wait(2500);
    await page.screenshot({ path: `${OUT}/recipes.jpg`, type: "jpeg", quality: 95 });
    await ctx.close();
}
await browser.close();
