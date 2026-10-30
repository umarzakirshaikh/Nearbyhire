const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function testPdf() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  const testHtml = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Times New Roman', Times, serif;
    }
    .page-container {
      width: 100%;
      height: 260mm;
      box-sizing: border-box;
      border: 1.5px solid #000;
      padding: 30px;
      position: relative;
    }
    .page-footer {
      position: absolute;
      bottom: -10mm;
      left: 0;
      font-size: 10pt;
      font-family: 'Times New Roman', Times, serif;
    }
    .title {
      text-align: center;
      font-size: 20pt;
      font-weight: bold;
      margin-top: 40px;
    }
  </style>
  </head>
  <body>
    <div class="page-container">
      <div class="title">A PROJECT REPORT<br>On<br>“NEARBYHIRE”</div>
      <div class="page-footer">Page | 1</div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(testHtml, { waitUntil: 'load' });
  const pdfBuf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', bottom: '15mm', left: '15mm', right: '15mm' }
  });

  fs.writeFileSync('C:/project/test_out.pdf', pdfBuf);
  await browser.close();
  console.log('test_out.pdf generated, size:', pdfBuf.length);
}

testPdf().catch(console.error);
