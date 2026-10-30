const puppeteer = require('puppeteer-core');
const fs = require('fs');
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

  // 1. Welcome Screen
  console.log('Navigating to Welcome...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_welcome.png') });

  // 2. Click "Already Have an Account"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Already'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_login.png') });

  // 3. Click "Fill Student Demo" button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Fill Student Demo'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Click "Sign In"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.trim() === 'Sign In');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // 4. Main Feed (Student Dashboard)
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_main_feed.png') });
  console.log('Captured 03_main_feed.png');

  // 5. Navigate to Wallet
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, button'));
    const btn = btns.find(b => b.textContent.includes('Wallet'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_wallet.png') });
  console.log('Captured 04_wallet.png');

  // 6. Navigate to Profile / Me
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, button'));
    const btn = btns.find(b => b.textContent.includes('Me'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_profile.png') });
  console.log('Captured 05_profile.png');

  // 7. Student Registration Screen
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Student'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_register_student.png') });
  console.log('Captured 07_register_student.png');

  // 8. Business Login & Dashboard
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Already'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Fill Business Demo'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.trim() === 'Sign In');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Business Tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('nav button, button'));
    const btn = btns.find(b => b.textContent.includes('Business'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08_business_dashboard.png') });
  console.log('Captured 08_business_dashboard.png');

  await browser.close();
  console.log('Refreshed all captures successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
