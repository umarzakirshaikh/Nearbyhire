const puppeteer = require('puppeteer-core');
const fs = require('fs');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

async function testPage() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Convert college logo to base64
  const logoData = fs.readFileSync('C:/project/report_assets/college_logo.jpg').toString('base64');
  const logoSrc = `data:image/jpeg;base64,${logoData}`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <style>
    @page {
      size: 210mm 297mm;
      margin: 0;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Times New Roman', Times, serif;
      background: #ccc;
    }
    .page {
      width: 210mm;
      height: 297mm;
      page-break-after: always;
      background: #fff;
      padding: 12mm 15mm 10mm 15mm;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .inner-border {
      width: 100%;
      height: 267mm;
      border: 1.5px solid #000;
      padding: 30px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
    }
    .page-number {
      position: absolute;
      bottom: 5mm;
      left: 15mm;
      font-size: 11pt;
    }
    h1.report-title {
      font-size: 16pt;
      font-weight: bold;
      letter-spacing: 0.5px;
      margin: 0;
    }
    h2.project-name {
      font-size: 18pt;
      font-weight: bold;
      margin: 15px 0 0 0;
    }
    .sub-text {
      font-size: 12pt;
      margin: 5px 0;
    }
    .student-name {
      font-size: 15pt;
      font-weight: bold;
      margin: 10px 0;
    }
    .guide-name {
      font-size: 15pt;
      font-weight: bold;
      margin: 5px 0;
    }
    .degree-name {
      font-size: 16pt;
      font-weight: bold;
      margin: 5px 0;
    }
    .college-logo {
      width: 130px;
      height: auto;
      margin: 15px 0;
    }
    .college-name {
      font-size: 16pt;
      font-weight: bold;
      margin: 5px 0;
    }
    .academic-year {
      font-size: 14pt;
      font-weight: bold;
      margin: 5px 0;
    }
  </style>
  </head>
  <body>
    <!-- PAGE 1: TITLE PAGE -->
    <div class="page">
      <div class="inner-border">
        <div>
          <div class="sub-text" style="margin-top: 15px;">A PROJECT REPORT</div>
          <div class="sub-text" style="margin: 12px 0;">On</div>
          <div class="project-name">“NEARBYHIRE”</div>
        </div>

        <div>
          <div class="sub-text">Submitted by</div>
          <div class="student-name">Mr. Umar Shaikh</div>
          <div class="sub-text" style="font-style: italic; margin-top: 15px;">In partial fulfilment for the award of the degree</div>
          <div class="sub-text" style="font-style: italic; margin: 8px 0;">Of</div>
          <div class="degree-name">BACHELOR OF SCIENCE</div>
          <div class="sub-text" style="margin: 8px 0;">In</div>
          <div class="degree-name">COMPUTER SCIENCE</div>
        </div>

        <div>
          <div class="sub-text">Under the guidance of</div>
          <div class="guide-name">Mrs. Varsha S. More</div>
          <div class="sub-text" style="font-weight: bold; margin-top: 5px;">Department of Computer Science</div>
        </div>

        <img src="${logoSrc}" class="college-logo" alt="BNN College Logo">

        <div style="margin-bottom: 15px;">
          <div class="college-name">B.N.N. College, Bhiwandi.</div>
          <div class="academic-year">Sem V</div>
          <div class="academic-year">A.Y. 2024-2025</div>
        </div>
      </div>
      <div class="page-number">Page | 1</div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html, { waitUntil: 'load' });
  const pdfBuf = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true
  });

  fs.writeFileSync('C:/project/test_page1.pdf', pdfBuf);
  await browser.close();
  console.log('test_page1.pdf generated successfully!');
}

testPage().catch(console.error);
