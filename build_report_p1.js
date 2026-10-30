const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const diagrams = require('./diagrams');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

function getBase64Img(filePath) {
  try {
    const ext = path.extname(filePath).replace('.', '').toLowerCase();
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    const data = fs.readFileSync(filePath).toString('base64');
    return `data:${mime};base64,${data}`;
  } catch (e) {
    return '';
  }
}

const collegeLogo = getBase64Img('C:/project/report_assets/college_logo.jpg');
const welcomeImg = getBase64Img('C:/project/report_assets/01_welcome.png');
const loginImg = getBase64Img('C:/project/report_assets/02_login.png');
const mainFeedImg = getBase64Img('C:/project/report_assets/03_main_feed.png');
const walletImg = getBase64Img('C:/project/report_assets/04_wallet.png');
const profileImg = getBase64Img('C:/project/report_assets/05_profile.png');
const registerImg = getBase64Img('C:/project/report_assets/07_register_student.png');
const businessImg = getBase64Img('C:/project/report_assets/08_business_dashboard.png');
const chatImg = getBase64Img('C:/project/report_assets/09_chat.png');
const postGigImg = getBase64Img('C:/project/report_assets/10_post_gig.png');
const myPostsImg = getBase64Img('C:/project/report_assets/11_my_posts.png');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate code pages: chunks a file's lines and attaches output image on the last page
function generateCodePages(filename, description, filePath, outputImgBase64) {
  const content = fs.readFileSync(path.join('C:/project', filePath), 'utf8');
  const lines = content.split('\n');
  
  const pages = [];
  const linesPerPage = 38; // safe line count to avoid overflow
  
  // If there's an output image, reserve space on the final page or separate output page
  let totalChunks = Math.ceil(lines.length / linesPerPage);
  if (totalChunks === 0) totalChunks = 1;
  
  for (let i = 0; i < totalChunks; i++) {
    const chunkLines = lines.slice(i * linesPerPage, (i + 1) * linesPerPage);
    const codeSnippet = escapeHtml(chunkLines.join('\n'));
    
    let html = '';
    if (i === 0) {
      html += `
        <div style="font-weight: bold; font-size: 11pt; margin-bottom: 6px;">
          ➤ ${filename} (${description})
        </div>
        <div style="font-weight: bold; font-size: 10pt; margin-bottom: 4px;">Code:</div>
      `;
    }
    
    html += `
      <pre style="font-family: 'Consolas', 'Courier New', monospace; font-size: 8pt; line-height: 1.25; margin: 0; background: #fafafa; padding: 6px; border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden; white-space: pre-wrap; word-break: break-all;">${codeSnippet}</pre>
    `;
    
    pages.push(html);
  }

  // If output image provided, add output page
  if (outputImgBase64) {
    const outputHtml = `
      <div style="font-weight: bold; font-size: 11pt; margin-bottom: 6px;">
        ➤ ${filename} — Graphical User Interface Output
      </div>
      <div style="font-weight: bold; font-size: 10.5pt; margin-bottom: 8px;">Output:</div>
      <div style="text-align: center; margin-top: 10px;">
        <img src="${outputImgBase64}" style="max-width: 95%; max-height: 220mm; border: 1px solid #94a3b8; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.12);" />
      </div>
    `;
    pages.push(outputHtml);
  }
  
  return pages;
}

// Assemble all pages
const rawPages = [];

// ==================== PAGE 1: TITLE PAGE ====================
rawPages.push(`
  <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center;">
    <div>
      <div style="font-size: 13pt; font-weight: bold; margin-top: 15px; letter-spacing: 0.5px;">A PROJECT REPORT</div>
      <div style="font-size: 12pt; margin: 12px 0;">On</div>
      <div style="font-size: 18pt; font-weight: bold; letter-spacing: 0.5px;">“NEARBYHIRE”</div>
      <div style="font-size: 11pt; font-style: italic; color: #475569; margin-top: 4px;">Hyperlocal Student Employment &amp; Micro-Staffing Platform</div>
    </div>

    <div>
      <div style="font-size: 12pt;">Submitted by</div>
      <div style="font-size: 16pt; font-weight: bold; margin: 8px 0;">Mr. Umar Shaikh</div>
      <div style="font-size: 11pt; font-style: italic; margin-top: 14px;">In partial fulfilment for the award of the degree</div>
      <div style="font-size: 11pt; font-style: italic; margin: 6px 0;">Of</div>
      <div style="font-size: 15pt; font-weight: bold;">BACHELOR OF SCIENCE</div>
      <div style="font-size: 11pt; margin: 6px 0;">In</div>
      <div style="font-size: 15pt; font-weight: bold;">COMPUTER SCIENCE</div>
    </div>

    <div>
      <div style="font-size: 12pt;">Under the guidance of</div>
      <div style="font-size: 15pt; font-weight: bold; margin: 6px 0;">Mrs. Varsha S. More</div>
      <div style="font-size: 12pt; font-weight: bold;">Department of Computer Science</div>
    </div>

    <img src="${collegeLogo}" style="width: 130px; height: auto; margin: 10px 0;" alt="BNN College Emblem" />

    <div style="margin-bottom: 10px;">
      <div style="font-size: 16pt; font-weight: bold;">B.N.N. College, Bhiwandi.</div>
      <div style="font-size: 14pt; font-weight: bold; margin: 4px 0;">Sem V</div>
      <div style="font-size: 14pt; font-weight: bold;">A.Y. 2024-2025</div>
    </div>
  </div>
`);

// ==================== PAGE 2: CERTIFICATE ====================
rawPages.push(`
  <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
    <div>
      <img src="${collegeLogo}" style="width: 105px; height: auto; margin-bottom: 8px;" alt="College Logo" />
      <div style="font-size: 10.5pt; font-weight: bold;">Padmashri Annasaheb Jadhav Bhartiya Samaj Unnati Mandal’s</div>
      <div style="font-size: 13pt; font-weight: bold; margin: 3px 0;">B.N.N COLLEGE (ARTS, SCIENCE AND COMMERCE)</div>
      <div style="font-size: 10pt; font-style: italic;">(Affiliated to University of Mumbai)</div>
      <div style="font-size: 10.5pt; font-weight: bold; margin: 2px 0;">BHIWANDI, MAHARASHTRA-421302</div>
      <div style="font-size: 10.5pt; font-weight: bold;">(Self-Funded Courses)</div>
      <div style="font-size: 12pt; font-weight: bold; margin-top: 10px;">Department of Computer Science</div>
      <div style="font-size: 11pt; font-weight: bold;">A.Y. 2024-2025</div>
    </div>

    <div>
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 18px;">CERTIFICATE</div>
      <p style="font-size: 11pt; line-height: 1.7; text-align: justify; margin: 0 10px;">
        This is to certify that <strong>Mr. Umar Shaikh</strong>, of <strong>T.Y. B.Sc. (Sem.-V)</strong> class has satisfactorily completed the Project <strong>“NearbyHire”</strong> to be submitted in the partial fulfilment for the award of <strong>Bachelor of Science in Computer Science</strong> during the academic year <strong>2024– 2025</strong>.
      </p>
    </div>

    <div style="text-align: left; font-size: 11pt; font-weight: bold; margin-left: 10px;">
      Date of Submission:
    </div>

    <div style="display: flex; justify-content: space-between; margin: 20px 10px 10px 10px; font-size: 11pt; font-weight: bold;">
      <div style="text-align: center;">
        <div>Project Guide</div>
        <div style="margin-top: 5px;">(Mrs. Varsha S. More)</div>
      </div>
      <div style="text-align: center;">
        <div>Head / In-Charge,</div>
        <div style="margin-top: 5px;">Department Computer Science</div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin: 25px 10px 10px 10px; font-size: 11pt; font-weight: bold;">
      <div style="text-align: center;">
        <div>College Seal</div>
      </div>
      <div style="text-align: center;">
        <div>Signature of Examiner</div>
      </div>
    </div>
  </div>
`);

// ==================== PAGE 3: DECLARATION ====================
rawPages.push(`
  <div style="height: 100%; display: flex; flex-direction: column;">
    <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-top: 20px; margin-bottom: 35px;">
      DECLARATION BY THE STUDENT
    </div>
    
    <p style="font-size: 11.5pt; line-height: 1.8; text-align: justify; margin: 0 15px;">
      I, <strong>Mr. Umar Shaikh</strong>, hereby declare that the project entitled <strong>“NearbyHire”</strong> submitted in the partial fulfilment for the award of <strong>Bachelor of Science in Computer Science</strong> during the academic year <strong>2024 – 2025</strong> is my original work and the project has not formed the basis for the award of any degree, associateship, fellowship or any other similar titles.
    </p>

    <div style="margin-top: 60px; margin-right: 25px; text-align: right; font-size: 12pt; font-weight: bold;">
      Signature of the Student: ____________________
    </div>

    <div style="margin-top: 40px; margin-left: 20px; font-size: 11.5pt; font-weight: bold; line-height: 2;">
      <div>Place: Bhiwandi</div>
      <div>Date:</div>
    </div>
  </div>
`);

// ==================== PAGE 4: ACKNOWLEDGEMENT ====================
rawPages.push(`
  <div style="height: 100%; display: flex; flex-direction: column;">
    <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-top: 20px; margin-bottom: 25px;">
      ACKNOWLEDGEMENT
    </div>

    <p style="font-size: 11pt; line-height: 1.65; text-align: justify; margin: 0 10px 12px 10px;">
      I would like to extend our heartiest thanks with a deep sense of gratitude and respect to all those who provided me immense help and guidance during my project work. I would like to thank my project guide <strong>Mrs. Varsha S. More</strong> for providing an inspiring vision, technical insight, and steadfast direction throughout the development of the system.
    </p>

    <p style="font-size: 11pt; line-height: 1.65; text-align: justify; margin: 0 10px 12px 10px;">
      I have been greatly benefited from her regular critical reviews and inspiration throughout my work. I am grateful to her for her guidance, encouragement, understanding and insightful support in the development process. I would also like to thank my college for giving required resources whenever I wanted and for giving the opportunity to develop the project.
    </p>

    <p style="font-size: 11pt; line-height: 1.65; text-align: justify; margin: 0 10px 12px 10px;">
      I would like to express my sincere thanks to our Principal <strong>Dr. Ashok D. Wagh</strong> and our Head of Department <strong>Mr. Pramod L. Shewale</strong> for having facilitated us with the essential infrastructure &amp; computing resources without which this project would not have seen light of the day. I am also thankful to entire faculty and staff of Computer Science for their constant Encouragement, suggestions and moral support throughout the duration of my project.
    </p>

    <p style="font-size: 11pt; line-height: 1.65; text-align: justify; margin: 0 10px 25px 10px;">
      Last but not the least, I would like to mention here that I am greatly indebted to each and everybody my friends and family who have been associated with my project at any stage but whose name does not find a place in this acknowledgement.
    </p>

    <div style="margin-top: 30px; margin-right: 20px; text-align: right; font-size: 11.5pt;">
      <div>With Sincere Regards,</div>
      <div style="font-weight: bold; margin-top: 10px; font-size: 12pt;">Mr. Umar Shaikh</div>
    </div>
  </div>
`);

// ==================== PAGE 5: PROJECT BRANDING ====================
rawPages.push(`
  <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
    <div style="width: 130px; height: 130px; border-radius: 28px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35); margin-bottom: 25px;">
      <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>
    <div style="font-size: 24pt; font-weight: bold; letter-spacing: 1px; color: #0f172a; margin-bottom: 8px;">“NEARBYHIRE”</div>
    <div style="font-size: 14pt; font-weight: bold; text-decoration: underline; color: #059669; letter-spacing: 0.5px;">HYPERLOCAL STUDENT EMPLOYMENT PLATFORM</div>
    <div style="font-size: 11pt; color: #64748b; font-style: italic; margin-top: 15px; max-width: 450px; line-height: 1.5;">
      Connecting students looking for flexible gigs with neighborhood businesses requiring immediate, verified talent.
    </div>
  </div>
`);

// ==================== PAGE 6: TABLE OF CONTENTS (Placeholder, updated dynamically) ====================
// We will generate this after computing chapter page numbers!

console.log('Preliminary pages loaded.');
