import { chromium } from 'playwright-core';
import { fileURLToPath } from 'url';
import path from 'path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const pages = [
  { file: 'design-1-refined.html',  name: 'design-1-refined' },
  { file: 'design-2-terminal.html', name: 'design-2-terminal' },
  { file: 'design-3-editorial.html', name: 'design-3-editorial' },
];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
for (const p of pages) {
  const url = 'file://' + path.join(dir, p.file);
  // Desktop dark
  for (const scheme of ['dark', 'light']) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: scheme,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(dir, `shot-${p.name}-desktop-${scheme}.png`) });
    await ctx.close();
  }
  // Mobile dark
  const mctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'dark',
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mpage = await mctx.newPage();
  await mpage.goto(url, { waitUntil: 'networkidle' });
  await mpage.waitForTimeout(900);
  await mpage.screenshot({ path: path.join(dir, `shot-${p.name}-mobile-dark.png`) });
  await mctx.close();
  console.log('shot', p.name);
}
await browser.close();
console.log('done');
