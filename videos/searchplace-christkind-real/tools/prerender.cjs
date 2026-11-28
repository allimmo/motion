// Pre-renders the static scene layers from assets/scenes.js into assets/img/*.png (2x).
// Usage: node tools/prerender.cjs   (from the project folder)
const path = require("path");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "..");
const LAYERS = [
  ["attic_bg", "atticBg", 840, 1494, false],
  ["attic_desk", "atticDesk", 840, 1494, true],
  ["loft_view", "loftView", 840, 1494, false],
  ["loft_room", "loftRoom", 840, 1494, true],
  ["loft_full", ["loftView", "loftRoom"], 840, 1494, false],
  ["altbau", "altbauThumb", 840, 380, false],
  ["penthouse", "penthouseThumb", 840, 380, false],
  ["phone_bg", "phoneBg", 840, 1494, false],
  ["night_bg", "nightBg", 840, 1494, false],
];
(async () => {
  const b = await chromium.launch();
  for (const [name, fn, w, h, transparent] of LAYERS) {
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
    await p.setContent(`<!doctype html><html><head><style>html,body{margin:0;width:${w}px;height:${h}px;background:transparent;overflow:hidden}.l{position:absolute;left:0;top:0;width:${w}px;height:${h}px}</style></head><body></body></html>`);
    await p.addScriptTag({ path: path.join(root, "assets/scenes.js") });
    const fns = Array.isArray(fn) ? fn : [fn];
    await p.evaluate((fns) => {
      fns.forEach((n) => {
        const d = document.createElement("div");
        d.className = "l";
        d.innerHTML = window.SPScene[n]();
        document.body.appendChild(d);
      });
    }, fns);
    await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(root, "assets/img", name + ".png"), omitBackground: transparent });
    await p.close();
    console.log("rendered", name);
  }
  await b.close();
})();
