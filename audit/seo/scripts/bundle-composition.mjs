// Which packages make up the main JS chunk? Reads a sourcemap built with `vite build --sourcemap`.
// Usage: node audit/seo/scripts/bundle-composition.mjs <dir-with-assets>
import fs from "node:fs";
import path from "node:path";
const dir = path.join(process.argv[2], "assets");
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".js.map"))) {
  const map = JSON.parse(fs.readFileSync(path.join(dir, f)));
  const sizes = {};
  map.sources.forEach((src, i) => {
    const m = src.match(/node_modules\/((?:@[^/]+\/)?[^/]+)/);
    const key = m ? m[1] : src.includes("/src/") ? "app: " + src.split("/src/")[1].split("/").slice(0, 3).join("/") : src;
    sizes[key] = (sizes[key] ?? 0) + (map.sourcesContent?.[i]?.length ?? 0);
  });
  const total = Object.values(sizes).reduce((a, b) => a + b, 0);
  console.log(`\n${f} (source bytes before minification: ${Math.round(total / 1024)} kB)`);
  for (const [k, v] of Object.entries(sizes).sort((a, b) => b[1] - a[1]).slice(0, 18))
    console.log(`  ${String(Math.round(v / 1024)).padStart(5)} kB  ${(100 * v / total).toFixed(1).padStart(5)}%  ${k}`);
}
