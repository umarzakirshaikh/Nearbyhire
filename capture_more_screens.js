const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUTPUT_DIR = 'C:/project/report_assets';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });

  // Login as Business
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Already'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Fill Business Demo'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.trim() === 'Sign In');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Go to Business tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, button'));
    const btn = btns.find(b => b.textContent.includes('Business'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click "Chat Live"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Chat Live'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_chat.png') });
  console.log('Captured 09_chat.png');

  // Go back to Business tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, button'));
    const btn = btns.find(b => b.textContent.includes('Business'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click "Post a Gig"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Post a Gig'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_post_gig.png') });
  console.log('Captured 10_post_gig.png');

  // Click "My Posts"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('My Posts'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '11_my_posts.png') });
  console.log('Captured 11_my_posts.png');

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
