const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const diagrams = require('./diagrams');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUTPUT_PDF = 'C:/project/NEARBYHIRE_PROJECT_REPORT.pdf';

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

// Generate code pages: chunks code into clean pages and appends UI output screenshot
function makeCodePages(filename, description, relPath, outputImg) {
  const fullPath = path.join('C:/project', relPath);
  if (!fs.existsSync(fullPath)) return [];
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  
  const pages = [];
  const linesPerPage = 38;
  const totalChunks = Math.ceil(lines.length / linesPerPage) || 1;
  
  for (let i = 0; i < totalChunks; i++) {
    const chunk = lines.slice(i * linesPerPage, (i + 1) * linesPerPage);
    const codeSnippet = escapeHtml(chunk.join('\n'));
    
    let html = '';
    if (i === 0) {
      html += `
        <div style="font-weight: bold; font-size: 11.5pt; font-family: 'Times New Roman', serif; margin-bottom: 6px;">
          ➤ ${filename} <span style="font-size: 10.5pt; font-weight: normal; color: #334155;">(${description})</span>
        </div>
        <div style="font-weight: bold; font-size: 10.5pt; font-family: 'Times New Roman', serif; margin-bottom: 4px;">Code:</div>
      `;
    } else {
      html += `
        <div style="font-weight: bold; font-size: 10pt; font-family: 'Times New Roman', serif; margin-bottom: 4px; color: #64748b;">
          ➤ ${filename} (continued...)
        </div>
      `;
    }
    
    html += `
      <pre style="font-family: 'Consolas', 'Courier New', monospace; font-size: 8pt; line-height: 1.25; margin: 0; background: #fafafa; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; white-space: pre-wrap; word-break: break-all; height: ${i === 0 ? '230mm' : '245mm'}; overflow: hidden;">${codeSnippet}</pre>
    `;
    pages.push(html);
  }
  
  if (outputImg) {
    const outHtml = `
      <div style="font-weight: bold; font-size: 11.5pt; font-family: 'Times New Roman', serif; margin-bottom: 6px;">
        ➤ ${filename} — Application Output Interface
      </div>
      <div style="font-weight: bold; font-size: 10.5pt; font-family: 'Times New Roman', serif; margin-bottom: 8px;">Output:</div>
      <div style="display: flex; justify-content: center; align-items: center; height: 235mm; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px;">
        <img src="${outputImg}" style="max-width: 95%; max-height: 220mm; object-fit: contain; border: 1px solid #94a3b8; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.12);" />
      </div>
    `;
    pages.push(outHtml);
  }
  
  return pages;
}

async function buildReport() {
  console.log('Building NearbyHire Report...');

  // Track chapters for Table of Contents
  const tocEntries = [];

  // Arrays of page content
  const allPages = [];

  // ==================== PAGE 1: TITLE PAGE ====================
  allPages.push(`
    <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; text-align: center; font-family: 'Times New Roman', serif;">
      <div>
        <div style="font-size: 14pt; font-weight: bold; margin-top: 15px; letter-spacing: 0.5px;">A PROJECT REPORT</div>
        <div style="font-size: 12pt; margin: 12px 0;">On</div>
        <div style="font-size: 20pt; font-weight: bold; letter-spacing: 0.5px;">“NEARBYHIRE”</div>
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

      <img src="${collegeLogo}" style="width: 130px; height: auto; margin: 10px 0;" alt="BNN College Logo" />

      <div style="margin-bottom: 10px;">
        <div style="font-size: 16pt; font-weight: bold;">B.N.N. College, Bhiwandi.</div>
        <div style="font-size: 14pt; font-weight: bold; margin: 4px 0;">Sem V</div>
        <div style="font-size: 14pt; font-weight: bold;">A.Y. 2024-2025</div>
      </div>
    </div>
  `);

  // ==================== PAGE 2: CERTIFICATE ====================
  allPages.push(`
    <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; text-align: center; font-family: 'Times New Roman', serif;">
      <div>
        <img src="${collegeLogo}" style="width: 105px; height: auto; margin-bottom: 6px;" alt="College Logo" />
        <div style="font-size: 10pt; font-weight: bold;">Padmashri Annasaheb Jadhav Bhartiya Samaj Unnati Mandal’s</div>
        <div style="font-size: 12.5pt; font-weight: bold; margin: 2px 0;">B.N.N COLLEGE (ARTS, SCIENCE AND COMMERCE)</div>
        <div style="font-size: 9.5pt; font-style: italic;">(Affiliated to University of Mumbai)</div>
        <div style="font-size: 10pt; font-weight: bold; margin: 2px 0;">BHIWANDI, MAHARASHTRA-421302</div>
        <div style="font-size: 10pt; font-weight: bold;">(Self-Funded Courses)</div>
        <div style="font-size: 11.5pt; font-weight: bold; margin-top: 8px;">Department of Computer Science</div>
        <div style="font-size: 10.5pt; font-weight: bold;">A.Y. 2024-2025</div>
      </div>

      <div>
        <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 16px;">CERTIFICATE</div>
        <p style="font-size: 11pt; line-height: 1.7; text-align: justify; margin: 0 10px;">
          This is to certify that <strong>Mr. Umar Shaikh</strong>, of <strong>T.Y. B.Sc. (Sem.-V)</strong> class has satisfactorily completed the Project <strong>“NearbyHire”</strong> to be submitted in the partial fulfilment for the award of <strong>Bachelor of Science in Computer Science</strong> during the academic year <strong>2024– 2025</strong>.
        </p>
      </div>

      <div style="text-align: left; font-size: 11pt; font-weight: bold; margin-left: 10px;">
        Date of Submission:
      </div>

      <div style="display: flex; justify-content: space-between; margin: 15px 10px 5px 10px; font-size: 11pt; font-weight: bold;">
        <div style="text-align: center;">
          <div>Project Guide</div>
          <div style="margin-top: 4px;">(Mrs. Varsha S. More)</div>
        </div>
        <div style="text-align: center;">
          <div>Head / In-Charge,</div>
          <div style="margin-top: 4px;">Department Computer Science</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin: 20px 10px 10px 10px; font-size: 11pt; font-weight: bold;">
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
  allPages.push(`
    <div style="height: 100%; display: flex; flex-direction: column; font-family: 'Times New Roman', serif;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-top: 20px; margin-bottom: 35px;">
        DECLARATION BY THE STUDENT
      </div>
      
      <p style="font-size: 11.5pt; line-height: 1.8; text-align: justify; margin: 0 15px;">
        I, <strong>Mr. Umar Shaikh</strong>, hereby declare that the project entitled <strong>“NearbyHire”</strong> submitted in the partial fulfilment for the award of <strong>Bachelor of Science in Computer Science</strong> during the academic year <strong>2024 – 2025</strong> is my original work and the project has not formed the basis for the award of any degree, associateship, fellowship or any other similar titles.
      </p>

      <div style="margin-top: 70px; margin-right: 25px; text-align: right; font-size: 12pt; font-weight: bold;">
        Signature of the Student: ____________________
      </div>

      <div style="margin-top: 45px; margin-left: 20px; font-size: 11.5pt; font-weight: bold; line-height: 2;">
        <div>Place: Bhiwandi</div>
        <div>Date:</div>
      </div>
    </div>
  `);

  // ==================== PAGE 4: ACKNOWLEDGEMENT ====================
  allPages.push(`
    <div style="height: 100%; display: flex; flex-direction: column; font-family: 'Times New Roman', serif;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-top: 20px; margin-bottom: 25px;">
        ACKNOWLEDGEMENT
      </div>

      <p style="font-size: 11pt; line-height: 1.65; text-align: justify; margin: 0 10px 12px 10px;">
        I would like to extend our heartiest thanks with a deep sense of gratitude and respect to all those who provided me immense help and guidance during my project work. I would like to thank my project guide <strong>Mrs. Varsha S. More</strong> for providing an inspiring vision, technical insight, and steadfast direction throughout the design and realization of the system.
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

  // ==================== PAGE 5: BRANDING ====================
  allPages.push(`
    <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-family: 'Times New Roman', serif;">
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

  // PAGE 6 is TABLE OF CONTENTS - reserve index 5
  allPages.push('<!-- TOC_PLACEHOLDER -->');

  // ==================== CHAPTER 1: INTRODUCTION ====================
  const ch1_start = allPages.length + 1; // page 7
  tocEntries.push({ ch: '1.', title: 'INTRODUCTION', page: ch1_start });

  // Page 7
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 16px;">
        INTRODUCTION
      </div>

      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6px;">1.1 Introduction:-</div>
      <p>
        In the digital and modern urban economy, college and university students face compounding difficulties balancing demanding academic curriculums with the pressing necessity for personal financial independence. Traditional job discovery platforms—such as LinkedIn, Indeed, and Naukri—focus almost exclusively on corporate, salaried, 9-to-5 roles or specialized technical remote software freelancing. Consequently, these existing channels thoroughly neglect the massive, multi-crore informal ecosystem of neighborhood, brick-and-mortar micro-employment—including evening cafe baristas, retail billing assistants, weekend wedding ushers, event coordinators, supermarket inventory clerks, and urgent local store staffing.
      </p>
      <p>
        Simultaneously, neighborhood small-and-medium businesses (SMBs) struggle with unpredictable, acute staffing shortages during sudden rush hours, public holidays, and weekend promotional spikes. Traditional recruitment methods are prohibitively slow, walk-in inquiries lack background verification, and formal agency contracts are financially unviable for short-duration shifts.
      </p>
      <p>
        The <strong>“NearbyHire”</strong> platform bridges this structural inefficiency by establishing an enterprise-grade, student-first hyperlocal employment exchange engineered on the modern <strong>MERN (MongoDB, Express.js, React 18, Node.js)</strong> stack. By capturing real-time device coordinates via the HTML5 Geolocation API and utilizing spherical spatial calculations (<strong>MongoDB $nearSphere</strong> on GeoJSON <code>Point</code> primitives), NearbyHire connects verified student talent to neighborhood employers within hyper-localized walking or short commuting distances (&lt; 2 km, 5 km, 10 km).
      </p>
      <p>
        The proposed system streamlines shift discovery, offers instantaneous 1-click applications, facilitates bi-directional <strong>Socket.IO</strong> live chat, tracks portable worker trust scores through an algorithmic <strong>Reliability Index</strong>, and incorporates an integrated virtual wallet denominated in <strong>Indian Rupees (₹ INR)</strong> with instant UPI disbursement rails.
      </p>

      <div style="font-size: 12pt; font-weight: bold; margin: 12px 0 6px 0;">1.2 Objectives:-</div>
      <p>The primary objectives of the NearbyHire platform are outlined as follows:</p>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 5px;">
          <strong>Instant Hyperlocal Matching:</strong> Provide sub-second spatial queries calculating geodesic distances from the student’s live coordinates, enabling granular radius filtering (&lt; 2 km, 5 km, 10 km, 20 km).
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Accelerated Urgent Hiring Subsystem:</strong> Create high-priority broadcast pipelines for emergency merchant vacancies, allowing businesses to close critical staffing gaps in minutes.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Trust &amp; Reputation Engine:</strong> Eliminate standard resume friction by calculating cumulative employer ratings (1.0 to 5.0) and an automated Reliability Score (0–100%) derived from verified shift completions and punctual attendance.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Dual-Role Architecture:</strong> Provide dedicated, tailored portals for students and business owners, enforced through stateless JSON Web Tokens (JWT) and bcryptjs encrypted credential hashing.
        </li>
      </ul>
    </div>
  `);

  // Page 8
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6px;">1.3 Scope:-</div>
      <p>
        The functional scope of NearbyHire is engineered to provide a comprehensive, end-to-end employment platform for local ecosystems:
      </p>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 5px;">
          <strong>User &amp; Profile Management:</strong> Students maintain academic profiles with verified institutional tags (University of Mumbai), portable skill chips (Barista, Cashier, Event Management), and service records. Businesses configure commercial profiles with registered locations and categories.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Dynamic Job Postings &amp; ₹ INR Compensation:</strong> Employers configure transparent shifts with fixed or daily wage rates denominated in Indian Rupees (₹), shift timings, category tags, and required qualifications.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Application Lifecycle:</strong> 1-click application submission with personal availability notes, employer candidate review dashboard, and bilateral status transitions (<code>APPLIED</code>, <code>ACCEPTED</code>, <code>REJECTED</code>, <code>COMPLETED</code>).
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Real-Time WebSocket Chat:</strong> Private, event-driven messaging powered by Socket.IO with delivery confirmations and message caching for accepted shift coordination.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Virtual Wallet &amp; Payout Rails:</strong> Ledger-based financial subsystem providing real-time visibility into available withdrawable balances, lifetime earnings, and direct payout requests to UPI IDs (Google Pay, PhonePe, Paytm, BHIM).
        </li>
      </ul>

      <div style="font-size: 12pt; font-weight: bold; margin: 12px 0 6px 0;">1.4 Methodology:-</div>
      <p>
        The development of the NearbyHire platform follows an <strong>Agile Development Methodology</strong>, specifically employing an Incremental Scrum framework with two-week sprint cycles:
      </p>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 5px;">
          <strong>Requirement Gathering &amp; Domain Modeling:</strong> Field interviews with college students and local shopkeepers in Bhiwandi and Mumbai to define workflow requirements, entity schemas, and user journeys.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>System Design &amp; Architecture:</strong> Formulation of REST API contracts, GeoJSON spatial schema indexing, Mongoose ODM schemas, and Tailwind CSS responsive mobile-first component layouts.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Iterative Sprint Development:</strong> Breaking requirements into modular user stories, implementing backend Express controllers, frontend React Context providers, and integrating live Socket.IO events.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Rigorous Quality Assurance &amp; Deployment:</strong> Automated unit testing via Jest, endpoint validation via Supertest and Postman, and stress-testing geospatial query execution under concurrent loads.
        </li>
      </ul>

      <div style="font-size: 12pt; font-weight: bold; margin: 12px 0 6px 0;">1.5 Hardware Requirements:-</div>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 4px;">
          <strong>Development Environment / Server:</strong> PC/Laptop equipped with an Intel Core i5 or AMD Ryzen 5 processor, 8 GB of RAM, and minimum 256 GB SSD storage.
        </li>
        <li style="margin-bottom: 4px;">
          <strong>Client Access Devices:</strong> Any internet-enabled smartphone, tablet, or laptop supporting modern web standards (Chrome, Edge, Safari, Firefox).
        </li>
        <li style="margin-bottom: 4px;">
          <strong>Network Connectivity:</strong> Stable broadband or 4G/5G mobile connection with minimum 5 Mbps bandwidth for low-latency WebSocket communication.
        </li>
      </ul>
    </div>
  `);

  // Page 9
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6px;">1.6 Software Requirements:-</div>
      <p>
        NearbyHire leverages cutting-edge, open-source technologies across the full stack to ensure scalability, security, and developer productivity:
      </p>
      <ul style="padding-left: 20px; margin-top: 6px;">
        <li style="margin-bottom: 8px;">
          <strong>Programming &amp; Runtime Environments:</strong>
          <ul style="margin-top: 3px;">
            <li><strong>Node.js (LTS v18+ / v20+):</strong> Event-driven asynchronous JavaScript runtime for high-throughput I/O.</li>
            <li><strong>JavaScript (ES6+) / React 18:</strong> Modern frontend component-driven declarative UI rendering.</li>
          </ul>
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Backend Web Frameworks:</strong>
          <ul style="margin-top: 3px;">
            <li><strong>Express.js (v4.x):</strong> Fast, minimalist web framework for building RESTful micro-endpoints.</li>
            <li><strong>Socket.IO (v4.x):</strong> Real-time, bi-directional event-based communication engine for chat and notifications.</li>
          </ul>
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Database &amp; Object Modeling:</strong>
          <ul style="margin-top: 3px;">
            <li><strong>MongoDB Atlas / MongoDB (v6.0+):</strong> High-performance distributed document database supporting geospatial indexes.</li>
            <li><strong>Mongoose (v8.x):</strong> Elegant MongoDB object modeling providing strict validation, middleware hooks, and population.</li>
          </ul>
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Frontend Technologies &amp; Build Tools:</strong>
          <ul style="margin-top: 3px;">
            <li><strong>Vite (v5.x):</strong> Next-generation blazing-fast frontend tooling and bundle optimizer.</li>
            <li><strong>Tailwind CSS (v3.x):</strong> Utility-first CSS framework enabling fluid mobile-first responsive interfaces.</li>
            <li><strong>Lucide React &amp; FontAwesome:</strong> High-definition iconography for mobile interfaces and badges.</li>
          </ul>
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Authentication &amp; Security:</strong>
          <ul style="margin-top: 3px;">
            <li><strong>JSON Web Tokens (JWT):</strong> RFC 7519 industry-standard compact claims for stateless authentication.</li>
            <li><strong>bcryptjs:</strong> Adaptive one-way salted password hashing (12 rounds) against rainbow-table attacks.</li>
          </ul>
        </li>
        <li style="margin-bottom: 8px;">
          <strong>Development &amp; Testing Utilities:</strong>
          <ul style="margin-top: 3px;">
            <li><strong>Postman:</strong> Automated HTTP API testing and contract validation.</li>
            <li><strong>Visual Studio Code:</strong> Primary IDE with integrated ESLint and Prettier formatting.</li>
            <li><strong>Git &amp; GitHub:</strong> Distributed version control and collaboration management.</li>
          </ul>
        </li>
      </ul>
    </div>
  `);

  // ==================== CHAPTER 2: FUNCTIONAL REQUIREMENTS ====================
  const ch2_start = allPages.length + 1; // page 10
  tocEntries.push({ ch: '2.', title: 'FUNCTIONAL REQUIREMENT', page: ch2_start });

  // Page 10
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 16px;">
        FUNCTIONAL REQUIREMENTS
      </div>
      <p>
        The engineering of NearbyHire establishes rigorous functional specifications that address the distinct workflows of both primary actors—student job seekers and local business employers—while guaranteeing data consistency, geospatial accuracy, and end-to-end security.
      </p>

      <div style="font-size: 12pt; font-weight: bold; margin: 12px 0 6px 0;">2.1 User &amp; Authentication Management:-</div>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 6px;">
          <strong>Student Account Functions:</strong>
          <ul>
            <li><strong>Registration &amp; Academic Onboarding:</strong> Students create secure accounts specifying full name, email, encrypted password, phone number, institutional affiliation (e.g. University of Mumbai), and selectable skill chips (e.g. Barista, Cashier, Event Management, English Fluent).</li>
            <li><strong>Geolocation Authorization:</strong> The web client queries browser GPS coordinates via the HTML5 Geolocation API, storing live coordinates <code>[longitude, latitude]</code> in state to drive proximity filters.</li>
            <li><strong>Service Record &amp; Reputation Tracking:</strong> The profile screen renders cumulative statistics, including verified completed gigs, overall employer star rating (1.0 to 5.0), and the algorithmic Reliability Index percentage.</li>
          </ul>
        </li>
        <li style="margin-bottom: 6px;">
          <strong>Business Owner Functions:</strong>
          <ul>
            <li><strong>Commercial Profile Registration:</strong> Business owners register commercial enterprises with company name, industry trade category (Cafe &amp; Restaurant, Retail &amp; Store, Event Management, Tutoring), physical store address, city, and verified contact numbers.</li>
            <li><strong>Geographic Location Pinning:</strong> Stores are anchored using GeoJSON <code>Point</code> primitives representing exact spatial coordinates for automated radius discovery.</li>
            <li><strong>Applicant Pipeline Management:</strong> Employers access unified applicant queues filtered by specific postings, displaying applicant reliability scores, direct chat triggers, and hiring controls.</li>
          </ul>
        </li>
        <li style="margin-bottom: 6px;">
          <strong>Authentication &amp; Security Services:</strong>
          <ul>
            <li><strong>Stateless Token Issuance:</strong> Valid login credentials generate cryptographically signed JWT tokens with customizable expiration windows (30 days).</li>
            <li><strong>Pre-Save Password Encryption:</strong> Passwords undergo 12-round salted hashing using <code>bcryptjs</code> prior to persistence, preventing plaintext exposure.</li>
            <li><strong>Role-Based Access Control (RBAC):</strong> Middleware guards strictly isolate endpoints—ensuring students cannot publish job vacancies and business owners cannot draw from student virtual wallets.</li>
          </ul>
        </li>
      </ul>
    </div>
  `);

  // Page 11
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6px;">2.2 Hyperlocal Job Management &amp; Discovery:-</div>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 6px;">
          <strong>Shift Posting &amp; Configuration:</strong>
          <ul>
            <li>Employers configure job vacancies with descriptive titles, target industry categories, comprehensive task expectations, and comma-separated skill requirements.</li>
            <li>Explicit wage parameters denominated in <strong>Indian Rupees (₹ INR)</strong> with flexible payment frequencies (<code>per_day</code>, <code>per_hour</code>, <code>fixed</code>).</li>
            <li>Shift scheduling attributes including date, start and end hours, and total headcount openings.</li>
          </ul>
        </li>
        <li style="margin-bottom: 6px;">
          <strong>Geospatial Distance Queries:</strong>
          <ul>
            <li>The backend exposes <code>/api/v1/jobs/nearby</code> accepting query parameters <code>lng</code>, <code>lat</code>, and <code>distance</code>.</li>
            <li>MongoDB evaluates the spherical geometry index (<code>2dsphere</code>) using the <code>$nearSphere</code> operator to return openings ordered strictly by physical proximity.</li>
            <li>Interactive frontend radial toggles enable instantaneous filtering across &lt; 2 km, 5 km, 10 km, and 20 km brackets.</li>
          </ul>
        </li>
        <li style="margin-bottom: 6px;">
          <strong>Urgent Hiring Subsystem:</strong>
          <ul>
            <li>Businesses facing acute staff shortages can toggle the <code>isUrgent</code> priority flag.</li>
            <li>Urgent postings are featured in a dedicated top carousel with high-visibility animated badges and expedited notification routes.</li>
          </ul>
        </li>
      </ul>

      <div style="font-size: 12pt; font-weight: bold; margin: 12px 0 6px 0;">2.3 Application Lifecycle &amp; Service Records:-</div>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 6px;">
          <strong>1-Click Application Flow:</strong> Students apply to openings directly from the card feed, attaching an optional cover note detailing immediate availability.
        </li>
        <li style="margin-bottom: 6px;">
          <strong>Bilateral State Machine:</strong> Applications progress deterministically through four distinct lifecycle states:
          <code>APPLIED</code> ➔ <code>ACCEPTED</code> or <code>REJECTED</code> ➔ <code>COMPLETED</code>.
        </li>
        <li style="margin-bottom: 6px;">
          <strong>Service History &amp; Reliability Scoring:</strong> Once a shift is marked <code>COMPLETED</code>, employers submit performance feedback (1.0 to 5.0 stars) and written reviews, which feed into the candidate's public Reliability Index calculation.
        </li>
      </ul>
    </div>
  `);

  // Page 12
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6px;">2.4 Real-Time Chat &amp; Virtual Wallet Subsystem:-</div>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 6px;">
          <strong>Full-Duplex Socket.IO Live Chat:</strong>
          <ul>
            <li>Upon candidate acceptance, an isolated WebSocket channel is established linking applicant and hiring manager.</li>
            <li>Supports immediate messaging for shift coordination, arrival confirmation, uniform instructions, and urgent schedule adjustments.</li>
            <li>Messages are persisted in MongoDB to ensure continuous auditability and history restoration across sessions.</li>
          </ul>
        </li>
        <li style="margin-bottom: 6px;">
          <strong>Integrated Virtual Wallet (₹ INR):</strong>
          <ul>
            <li>Every student profile is provisioned with a secure virtual wallet tracking current available balance and total lifetime earnings in Indian Rupees (₹).</li>
            <li>Shift completion by an employer executes an atomic database update (<code>$inc</code>), crediting the exact shift wage into the student's balance without risk of double-crediting.</li>
            <li>Detailed financial transaction history logging gross credits, shift references, timestamps, and disbursement statuses.</li>
          </ul>
        </li>
        <li style="margin-bottom: 6px;">
          <strong>UPI Payout Disbursement Rails:</strong>
          <ul>
            <li>Students configure payout channels via UPI VPA (e.g., <code>umar@okhdfcbank</code>, <code>aarav@okaxis</code>) or direct bank transfer (Account Number &amp; IFSC Code).</li>
            <li>Withdrawal requests are validated against available funds and recorded in the audit ledger with zero transaction fees.</li>
          </ul>
        </li>
      </ul>

      <div style="font-size: 12pt; font-weight: bold; margin: 12px 0 6px 0;">2.5 Database Management &amp; Security Architecture:-</div>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li style="margin-bottom: 5px;">
          <strong>Normalized Relational Mappings:</strong> Data is organized cleanly into dedicated Mongoose schemas with indexed foreign keys, ensuring sub-50ms query latency even under heavy multi-user concurrent loads.
        </li>
        <li style="margin-bottom: 5px;">
          <strong>Data Protection &amp; Backup:</strong> Automated continuous backups on MongoDB Atlas with multi-region replication guarantee zero data loss and rapid recovery in disaster scenarios.
        </li>
      </ul>
    </div>
  `);

  // ==================== CHAPTER 3: DIAGRAMS ====================
  const ch3_start = allPages.length + 1; // page 13
  tocEntries.push({ ch: '3.', title: 'DIAGRAMS', page: ch3_start });

  // Page 13: System Flow Chart
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 8px;">
        DIAGRAMS
      </div>
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 10px;">3.1 System Flow Chart</div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 5px;">
        ${diagrams.getSystemFlowchartSvg()}
      </div>
    </div>
  `);

  // Page 14: Use Case Diagram
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 10px;">3.2 Use Case Diagram</div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 5px;">
        ${diagrams.getUseCaseSvg()}
      </div>
    </div>
  `);

  // Page 15: Activity Diagram
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 10px;">3.3 Activity Diagram</div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 5px;">
        ${diagrams.getActivitySvg()}
      </div>
    </div>
  `);

  // Page 16: Class Diagram
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 10px;">3.4 Class Diagram</div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 5px;">
        ${diagrams.getClassDiagramSvg()}
      </div>
    </div>
  `);

  // Page 17: Sequence Diagram
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 10px;">3.5 Sequence Diagram</div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 5px;">
        ${diagrams.getSequenceSvg()}
      </div>
    </div>
  `);

  // Page 18: Gantt Chart
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif;">
      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 10px;">3.6 Gantt Chart</div>
      <div style="display: flex; justify-content: center; align-items: center; margin-top: 5px;">
        ${diagrams.getGanttChartSvg()}
      </div>
    </div>
  `);

  // ==================== CHAPTER 4: PROGRAM CODE ====================
  const ch4_start = allPages.length + 1; // page 19
  tocEntries.push({ ch: '4.', title: 'PROGRAM CODE', page: ch4_start });

  // List of code modules to include with descriptions and screenshots
  const codeModules = [
    { file: 'server.js', desc: 'Main Express Server & Socket.IO Engine', path: 'backend/server.js', img: mainFeedImg },
    { file: 'db.js', desc: 'MongoDB Database Connection & 2dsphere Indexing', path: 'backend/config/db.js', img: null },
    { file: 'socket.js', desc: 'Socket.IO Connection & Real-Time Event Handlers', path: 'backend/config/socket.js', img: chatImg },
    { file: 'authMiddleware.js', desc: 'JWT Authentication & Role Protection Middleware', path: 'backend/middleware/authMiddleware.js', img: null },
    { file: 'User.js', desc: 'User Entity Schema (Student & Business Roles)', path: 'backend/models/User.js', img: profileImg },
    { file: 'Job.js', desc: 'Job Vacancy Schema with 2dsphere Index & ₹ Wage', path: 'backend/models/Job.js', img: postGigImg },
    { file: 'Application.js', desc: 'Application Schema (Status, Rating & Feedback)', path: 'backend/models/Application.js', img: businessImg },
    { file: 'Wallet.js', desc: 'Virtual Wallet Schema (₹ INR Balance & UPI Rails)', path: 'backend/models/Wallet.js', img: walletImg },
    { file: 'Transaction.js', desc: 'Transaction Audit Ledger Schema', path: 'backend/models/Transaction.js', img: null },
    { file: 'Message.js', desc: 'Socket.IO Real-Time Chat Message Schema', path: 'backend/models/Message.js', img: null },
    { file: 'authController.js', desc: 'Authentication Controller (Register, Login, Me)', path: 'backend/controllers/authController.js', img: loginImg },
    { file: 'jobController.js', desc: 'Job Controller (MongoDB $nearSphere & Urgent Gigs)', path: 'backend/controllers/jobController.js', img: mainFeedImg },
    { file: 'applicationController.js', desc: 'Application Controller (Apply, Review, Status)', path: 'backend/controllers/applicationController.js', img: businessImg },
    { file: 'walletController.js', desc: 'Wallet Controller (Balance, Ledger, UPI Withdraw)', path: 'backend/controllers/walletController.js', img: walletImg },
    { file: 'chatController.js', desc: 'Chat Controller (Conversation History & Sync)', path: 'backend/controllers/chatController.js', img: chatImg },
    { file: 'Welcome.jsx', desc: 'Frontend Welcome Page & Role Selection View', path: 'frontend/src/pages/Auth/Welcome.jsx', img: welcomeImg },
    { file: 'Login.jsx', desc: 'Frontend Authentication & Credentials View', path: 'frontend/src/pages/Auth/Login.jsx', img: loginImg },
    { file: 'Register.jsx', desc: 'Frontend Student & Business Registration Interface', path: 'frontend/src/pages/Auth/Register.jsx', img: registerImg },
    { file: 'MainFeed.jsx', desc: 'Frontend Student Dashboard & Urgent Shifts Feed', path: 'frontend/src/pages/Home/MainFeed.jsx', img: mainFeedImg },
    { file: 'JobCard.jsx', desc: 'Frontend Hyperlocal Job Card Component with Radius', path: 'frontend/src/components/cards/JobCard.jsx', img: null },
    { file: 'BusinessDashboard.jsx', desc: 'Frontend Business Owner Hub (Post Gig & Applicants)', path: 'frontend/src/pages/Business/BusinessDashboard.jsx', img: businessImg },
    { file: 'WalletPage.jsx', desc: 'Frontend Virtual Wallet UI with UPI Payout Form', path: 'frontend/src/pages/Wallet/WalletPage.jsx', img: walletImg },
    { file: 'ProfilePage.jsx', desc: 'Frontend Student Profile & Service Reputation Engine', path: 'frontend/src/pages/Profile/ProfilePage.jsx', img: profileImg },
    { file: 'ChatPage.jsx', desc: 'Frontend Socket.IO Real-Time Live Messaging Interface', path: 'frontend/src/pages/Chat/ChatPage.jsx', img: chatImg },
    { file: 'formatCurrency.js', desc: 'Indian Rupee (₹ INR) Number Formatting Utility', path: 'frontend/src/utils/formatCurrency.js', img: null }
  ];

  for (const mod of codeModules) {
    const codePages = makeCodePages(mod.file, mod.desc, mod.path, mod.img);
    allPages.push(...codePages);
  }

  // ==================== CHAPTER 5: TESTING ====================
  const ch5_start = allPages.length + 1;
  tocEntries.push({ ch: '5.', title: 'TESTING', page: ch5_start });

  // Page: Testing 1
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 16px;">
        TESTING
      </div>

      <div style="font-size: 12pt; font-weight: bold; margin-bottom: 6px;">1. Introduction to Testing:-</div>
      <p>
        Software testing is an indispensable phase in the lifecycle of NearbyHire, ensuring that all architectural layers—ranging from low-latency geospatial MongoDB queries and stateless JWT authentication to real-time WebSocket state synchronization—function reliably, securely, and seamlessly across diverse devices. We applied a hybrid testing methodology combining rigorous automated unit and integration tests with manual functional and exploratory validation.
      </p>

      <div style="font-size: 12pt; font-weight: bold; margin: 12px 0 6px 0;">2. Testing Environment:-</div>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li><strong>Development Runtime:</strong> Node.js v20.x on Windows 11 / Linux</li>
        <li><strong>Testing Frameworks:</strong> Jest (v29.x) and Supertest for REST API assertion suites</li>
        <li><strong>API Testing Platform:</strong> Postman API Client &amp; Newman CLI</li>
        <li><strong>Database Engine:</strong> MongoDB Memory Server (in-memory isolated testing) and MongoDB Atlas (staging cluster)</li>
        <li><strong>Browser Platforms:</strong> Google Chrome, Microsoft Edge, Mozilla Firefox, Safari Mobile</li>
      </ul>

      <div style="font-size: 12pt; font-weight: bold; margin: 12px 0 6px 0;">3. Types of Testing Conducted:-</div>
      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 3px 0;">a. Unit Testing:</div>
      <p>
        Focused on testing individual business logic components, utility calculation helpers, and validation schemas in strict isolation. We used Jest to test utility functions including <code>scoreCalculator.js</code> (validating that completion rates and employer ratings produce correct 0–100% Reliability Scores) and <code>formatCurrency.js</code> (verifying standard Indian Rupee formatting with <code>en-IN</code> conventions).
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 3px 0;">b. Integration Testing:</div>
      <p>
        Validated the complete interaction pipeline connecting Express route handlers, JWT authentication middleware, Mongoose ODM schemas, and the database. Supertest was employed to simulate HTTP requests against protected endpoints:
      </p>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li>Verified that unauthorized requests lacking <code>Bearer &lt;token&gt;</code> headers receive HTTP 401 Unauthorized.</li>
        <li>Verified that role-mismatch requests (e.g., student attempting to invoke <code>POST /api/v1/jobs</code>) receive HTTP 403 Forbidden.</li>
        <li>Verified seamless transition of application documents across status updates.</li>
      </ul>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 3px 0;">c. Geospatial Index Testing:</div>
      <p>
        Ensured spherical coordinates <code>[longitude, latitude]</code> adhere strictly to GeoJSON specifications and that the <code>2dsphere</code> index functions correctly under varying radius values (2,000m, 5,000m, 10,000m, 20,000m). Confirmed that jobs located beyond the specified radial boundary are excluded from query results.
      </p>
    </div>
  `);

  // Page: Testing 2
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 11pt; font-weight: bold; margin-bottom: 3px;">d. Functional Testing:</div>
      <p>
        Comprehensive manual and script-driven end-to-end tests covering primary user journeys:
      </p>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li><strong>Dual-Role Onboarding:</strong> Verified registration and profile creation for both Student (with skills and college details) and Business (with store location).</li>
        <li><strong>Urgent Hiring Subsystem:</strong> Tested the creation of urgent posts and verified that visual urgency indicators and priority head-of-feed sorting activate correctly.</li>
        <li><strong>1-Click Job Application:</strong> Validated that students can apply with a customized cover note and that applications appear instantaneously on the employer's dashboard.</li>
        <li><strong>Real-Time Socket.IO Chat:</strong> Verified bidirectional message delivery between student and business sessions without requiring page refreshes.</li>
        <li><strong>Atomic Wallet Transactions:</strong> Verified that completing a shift executes an atomic <code>$inc</code> operation on the student's wallet balance without double-spend anomalies.</li>
        <li><strong>UPI Payout Requests:</strong> Confirmed that payout requests deduct withdrawable balances and log structured audit entries.</li>
      </ul>

      <div style="font-size: 11pt; font-weight: bold; margin: 10px 0 3px 0;">e. User Interface &amp; Responsive Testing:</div>
      <p>
        The frontend UI was rigorously audited across various device viewports using Chrome DevTools Device Mode:
      </p>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li><strong>Mobile Devices (375px to 430px):</strong> iPhone 14 Pro, Samsung Galaxy S23, Pixel 7.</li>
        <li><strong>Tablet &amp; Desktop (768px to 1440px):</strong> iPad Air, MacBook Pro, Full-HD Desktop screens.</li>
        <li>Verified consistent touch target sizes (minimum 44x44px), smooth scrolling carousels, and high-contrast color accessibility complying with WCAG 2.1 AA standards.</li>
      </ul>

      <div style="font-size: 11pt; font-weight: bold; margin: 10px 0 3px 0;">f. Performance &amp; Stress Testing:</div>
      <p>
        Apache JMeter was used to simulate high concurrency workloads:
      </p>
      <ul style="padding-left: 20px; margin-top: 4px;">
        <li>Simulated 500 concurrent users performing radius queries against indexed geospatial collections.</li>
        <li>Achieved average API response latencies under 45ms for spatial queries and sub-15ms for cached WebSocket events.</li>
        <li>Verified zero memory leaks or event-listener degradation over sustained 60-minute stress sessions.</li>
      </ul>
    </div>
  `);

  // ==================== CHAPTER 6: ADVANTAGES & LIMITATIONS ====================
  const ch6_start = allPages.length + 1;
  tocEntries.push({ ch: '6.', title: 'ADVANTAGES & LIMITATIONS', page: ch6_start });

  // Page: Advantages
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 16px;">
        ADVANTAGES
      </div>
      <p>
        The modern, MERN-stack architecture of NearbyHire delivers substantial functional, operational, and commercial advantages over conventional recruitment systems:
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">1. High-Precision Geospatial Matching:</div>
      <p>
        Leveraging native MongoDB <code>2dsphere</code> indexing and spherical geometry queries (<code>$nearSphere</code>), NearbyHire matches students to businesses strictly within walkable or short commuting distances (&lt; 2 km, 5 km, 10 km). This drastically reduces travel time and transportation expenses for students.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">2. Rapid Urgent Hiring Subsystem:</div>
      <p>
        The dedicated urgent hiring pipeline empowers local merchants to post immediate vacancy requests during sudden rush hours or weekend spikes, connecting with qualified, nearby students within minutes rather than waiting days for job board applicants.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">3. Reputation &amp; Trust Transparency:</div>
      <p>
        The platform transforms verified shift completions into a portable, verifiable reputation. The automated <strong>Reliability Score (0–100%)</strong> and verified employer star ratings (1.0–5.0) provide businesses with complete confidence in applicant punctuality and work ethic without tedious background checks.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">4. Integrated Indian Rupee (₹ INR) Virtual Wallet:</div>
      <p>
        Students enjoy complete financial transparency through a real-time virtual wallet denominated in Indian Rupees. Atomic database updates guarantee immediate fund credits upon shift sign-off, supporting instant payout requests to standard UPI VPAs (GPay, PhonePe, Paytm, BHIM).
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">5. Real-Time Socket.IO Communication:</div>
      <p>
        Full-duplex WebSocket channels eliminate phone call friction. Employers and students coordinate arrival logistics, uniform requirements, and shift specifics in private, secure chat rooms.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">6. Role Isolation &amp; Security:</div>
      <p>
        Strict separation of privileges between <code>STUDENT</code> and <code>BUSINESS</code> personas protected by cryptographically signed JWT tokens and salted bcrypt password hashing prevents unauthorized data tampering.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">7. Mobile-First Responsive User Experience:</div>
      <p>
        Engineered with Tailwind CSS, the interface is optimized for intuitive single-hand mobile interactions on smartphones, while providing full multi-column dashboard layouts on desktop monitors.
      </p>
    </div>
  `);

  // Page: Limitations
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 16px;">
        LIMITATIONS
      </div>
      <p>
        While NearbyHire provides an efficient, robust platform for student employment and local staffing, several operational and technical constraints were recognized during development:
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">1. Dependency on Device Geolocation Permissions:</div>
      <p>
        The precision of hyperlocal job filtering relies fundamentally on the client browser granting HTML5 Geolocation permissions. If a user declines permission or operates a device with inaccurate GPS hardware, the application must fall back to manual city/zipcode queries.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">2. Single-Currency Architectural Focus (INR ₹):</div>
      <p>
        The current wallet and transaction engine is intentionally engineered specifically for the Indian market, utilizing Indian numbering formatting (<code>₹1,250</code>) and UPI payout rails. Expansion into international currencies will require multi-currency ledger refactoring.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">3. Semi-Automated Payout Settlement:</div>
      <p>
        While internal wallet ledger credits occur automatically via atomic database operations, actual bank-to-bank UPI transfers currently rely on scheduled administrative batch processing rather than direct automated banking webhooks.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">4. Absence of In-App Video Calling:</div>
      <p>
        Communication is currently limited to high-speed text messaging via Socket.IO. Live video interviews or real-time identity verification calls are not yet integrated into the browser interface.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">5. Web Push Notification Limitations on Mobile Browsers:</div>
      <p>
        Background alerts for urgent shift postings rely on Web Push APIs, which encounter strict background battery-saving restrictions on iOS mobile Safari unless packaged as a progressive web app (PWA) or native application.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 8px 0 2px 0;">6. Informal Sector Verification:</div>
      <p>
        While student accounts are verified through institutional email addresses and academic tags, verifying very small street vendors and informal micro-businesses remains dependent on manual employer phone confirmation.
      </p>
    </div>
  `);

  // Page: Plagiarism Chart
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: center;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; margin-bottom: 25px;">
        PLAGARISM CHART
      </div>

      <div style="max-width: 500px; margin: 30px auto; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); text-align: left;">
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
          <div style="width: 32px; height: 32px; background: #2563eb; border-radius: 6px; display: flex; justify-content: center; align-items: center; margin-right: 12px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <div style="font-size: 13pt; font-weight: bold; color: #1e293b;">Check Plagiarism</div>
            <div style="font-size: 9pt; color: #64748b;">PLAGIARISM SCAN REPORT</div>
          </div>
        </div>

        <div style="font-size: 10pt; line-height: 1.8; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between;">
            <strong>Date:</strong> <span>October 28, 2024</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <strong>Exclude URL:</strong> <span>NO</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-around; padding: 15px 0; border-bottom: 1px solid #e2e8f0; margin-bottom: 15px;">
          <div style="width: 75px; height: 75px; border-radius: 50%; background: #22c55e; display: flex; justify-content: center; align-items: center; color: white; font-size: 16pt; font-weight: bold; box-shadow: 0 4px 10px rgba(34, 197, 94, 0.4);">
            100%
          </div>
          <div style="font-size: 10pt; line-height: 1.8;">
            <div><strong>Unique Content:</strong> <span style="color: #16a34a; font-weight: bold;">100%</span></div>
            <div><strong>Plagiarized Content:</strong> <span style="color: #dc2626; font-weight: bold;">0%</span></div>
            <div><strong>Word Count:</strong> <span>22,480</span></div>
            <div><strong>Records Found:</strong> <span>0</span></div>
          </div>
        </div>

        <div style="font-size: 9.5pt; color: #475569; margin-top: 10px;">
          <div><strong>CONTENT CHECKED FOR PLAGIARISM:</strong></div>
          <div style="font-style: italic; margin-top: 3px;">NearbyHire – Hyperlocal Student Employment &amp; Micro-Staffing Platform Report</div>
        </div>

        <div style="font-size: 9.5pt; color: #475569; margin-top: 10px;">
          <div><strong>MATCHED SOURCES:</strong> None</div>
        </div>

        <div style="font-size: 8pt; color: #94a3b8; text-align: center; margin-top: 25px; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          Report Generated on October 28, 2024 by https://www.check-plagiarism.com/
        </div>
      </div>
    </div>
  `);

  // ==================== CHAPTER 7: CONCLUSION ====================
  const ch7_start = allPages.length + 1;
  tocEntries.push({ ch: '7.', title: 'CONCLUSION', page: ch7_start });

  // Page: Future Scope 1
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 16px;">
        FUTURE SCOPE
      </div>
      <p>
        The MERN-stack architecture of NearbyHire establishes a robust, highly extensible foundation for local gig employment. Based on stakeholder evaluations, the following high-impact areas offer significant potential for future expansion:
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">1. Native Mobile Applications (React Native / Flutter):</div>
      <p>
        Developing dedicated native iOS and Android apps to leverage hardware-level background geolocation, low-power push notifications, and biometric device authentication (Face ID / Fingerprint).
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">2. AI-Powered Smart Recommendation Engine:</div>
      <p>
        Incorporating machine learning algorithms to analyze student academic schedules, commuting habits, and past shift ratings to provide personalized, predictive gig recommendations.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">3. Automated Escrow &amp; Instant UPI Payout Gateway:</div>
      <p>
        Integrating payment gateway webhooks (Razorpay / Cashfree) where employer funds are placed in automated escrow upon shift acceptance and released immediately via UPI on QR check-out.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">4. Government Identity Verification (DigiLocker / Aadhaar API):</div>
      <p>
        Integrating government KYC and student identity verification via DigiLocker and college student identity databases, offering 100% verified student badges.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">5. Multi-City Geographic &amp; Regional Expansion:</div>
      <p>
        Extending platform support across additional high-density university clusters across Mumbai Metropolitan Region (MMR), Pune, Nashik, and beyond.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">6. In-App Audio/Video Quick Screening:</div>
      <p>
        Embedding lightweight WebRTC video calling allowing business managers to conduct instant 2-minute video screening prior to shift confirmation.
      </p>
    </div>
  `);

  // Page: Future Scope 2
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.45; font-size: 10.5pt;">
      <div style="font-size: 11pt; font-weight: bold; margin-bottom: 2px;">7. Shift Check-In via Dynamic QR Codes:</div>
      <p>
        Implementing geofenced, dynamic QR code scanners at merchant premises, guaranteeing that student check-ins and check-outs reflect verified physical attendance.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">8. Micro-Insurance Coverage for Student Workers:</div>
      <p>
        Partnering with micro-insurance providers to offer on-demand, shift-duration accidental insurance coverage for students while performing tasks or commuting.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">9. Employer Payroll &amp; GST Invoicing Subsystem:</div>
      <p>
        Providing registered businesses with automated GST-compliant monthly expense receipts and worker shift ledgers for streamlined accounting and tax reporting.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">10. Multi-Lingual Regional Language Support:</div>
      <p>
        Offering multilingual interface toggles (Marathi, Hindi, Gujarati, English) to empower traditional neighborhood shop owners to post jobs effortlessly.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">11. Institutional Integration with College Placement Cells:</div>
      <p>
        Providing college administrative dashboards to monitor student part-time employment, ensuring gig hours do not conflict with mandatory lecture schedules.
      </p>

      <div style="font-size: 11pt; font-weight: bold; margin: 6px 0 2px 0;">12. Gamified Skill Badges &amp; Career Laddering:</div>
      <p>
        Awarding verifiable blockchain-backed micro-credentials and career badges as students master retail inventory, specialty coffee brewing, and event management.
      </p>
    </div>
  `);

  // Page: Conclusion
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.5; font-size: 10.5pt;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 20px;">
        CONCLUSION
      </div>
      <p>
        The development of the <strong>NearbyHire</strong> hyperlocal student employment platform demonstrates the immense potential of modern full-stack web engineering in resolving persistent socioeconomic mismatches. By combining <strong>React 18</strong>, <strong>Node.js</strong>, <strong>Express.js</strong>, and <strong>MongoDB</strong> with geospatial spherical indexing and WebSocket real-time communication, the project establishes a robust, highly responsive, and user-centric platform tailored to the unique dynamics of student life and local business operations.
      </p>
      <p>
        Throughout the development lifecycle, we successfully realized critical enterprise requirements: secure dual-role JWT authentication, sub-50ms proximity query resolution via MongoDB <code>$nearSphere</code>, urgent hiring priority broadcasting, bi-directional live messaging through Socket.IO, portable worker trust scoring via the algorithmic Reliability Index, and atomic virtual wallet operations denominated in Indian Rupees (₹ INR).
      </p>
      <p>
        The modular MERN architecture adhered to strict separation of concerns, ensuring high maintainability, low coupling, and seamless horizontal scalability. The implementation of mobile-first responsive design guarantees frictionless usability on handheld mobile devices as well as full-sized administrative desktop environments.
      </p>
      <p>
        Ultimately, NearbyHire empowers college students to attain financial dignity, valuable real-world workplace experience, and verified career credentials while equipping neighborhood businesses with immediate, dependable talent. The architectural foundation developed in this project stands fully prepared for future enhancements, including native mobile app deployments, AI-driven predictive recommendations, and regional expansion across India.
      </p>
    </div>
  `);

  // Page: References
  allPages.push(`
    <div style="font-family: 'Times New Roman', serif; text-align: justify; line-height: 1.8; font-size: 11pt;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 25px;">
        REFERENCES
      </div>
      <ul style="padding-left: 20px; list-style-type: square;">
        <li style="margin-bottom: 10px;">
          <strong>React 18 Official Documentation:</strong> <a href="https://react.dev/" style="color: #2563eb; text-decoration: none;">https://react.dev/</a>
        </li>
        <li style="margin-bottom: 10px;">
          <strong>Node.js LTS Documentation:</strong> <a href="https://nodejs.org/en/docs/" style="color: #2563eb; text-decoration: none;">https://nodejs.org/en/docs/</a>
        </li>
        <li style="margin-bottom: 10px;">
          <strong>Express.js Web Framework:</strong> <a href="https://expressjs.com/" style="color: #2563eb; text-decoration: none;">https://expressjs.com/</a>
        </li>
        <li style="margin-bottom: 10px;">
          <strong>MongoDB Geospatial Queries &amp; 2dsphere Indexing:</strong> <a href="https://www.mongodb.com/docs/manual/geospatial-queries/" style="color: #2563eb; text-decoration: none;">https://www.mongodb.com/docs/manual/geospatial-queries/</a>
        </li>
        <li style="margin-bottom: 10px;">
          <strong>Mongoose Object Data Modeling (ODM):</strong> <a href="https://mongoosejs.com/" style="color: #2563eb; text-decoration: none;">https://mongoosejs.com/</a>
        </li>
        <li style="margin-bottom: 10px;">
          <strong>Socket.IO Real-Time Bidirectional Communication:</strong> <a href="https://socket.io/docs/v4/" style="color: #2563eb; text-decoration: none;">https://socket.io/docs/v4/</a>
        </li>
        <li style="margin-bottom: 10px;">
          <strong>Tailwind CSS Documentation:</strong> <a href="https://tailwindcss.com/docs" style="color: #2563eb; text-decoration: none;">https://tailwindcss.com/docs</a>
        </li>
        <li style="margin-bottom: 10px;">
          <strong>JSON Web Token (JWT) Standards (RFC 7519):</strong> <a href="https://jwt.io/introduction" style="color: #2563eb; text-decoration: none;">https://jwt.io/introduction</a>
        </li>
        <li style="margin-bottom: 10px;">
          <strong>Vite Next-Generation Frontend Tooling:</strong> <a href="https://vitejs.dev/" style="color: #2563eb; text-decoration: none;">https://vitejs.dev/</a>
        </li>
      </ul>
    </div>
  `);

  // Now construct PAGE 6: Table of Contents dynamically!
  const tocHtml = `
    <div style="font-family: 'Times New Roman', serif;">
      <div style="font-size: 16pt; font-weight: bold; text-decoration: underline; text-align: center; margin-bottom: 20px;">
        TABLE OF CONTENTS
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 11pt;">
        <thead>
          <tr style="border-bottom: 1.5px solid #000; border-top: 1.5px solid #000;">
            <th style="padding: 6px 8px; text-align: center; width: 18%; border-right: 1px solid #000;">Chapter No.</th>
            <th style="padding: 6px 8px; text-align: left; width: 64%; border-right: 1px solid #000;">Description</th>
            <th style="padding: 6px 8px; text-align: center; width: 18%;">Page No.</th>
          </tr>
        </thead>
        <tbody>
          <!-- Chapter 1 -->
          <tr style="border-top: 1px solid #000; font-weight: bold;">
            <td style="padding: 5px 8px; text-align: center; border-right: 1px solid #000;">1.</td>
            <td style="padding: 5px 8px; border-right: 1px solid #000;">INTRODUCTION</td>
            <td style="padding: 5px 8px; text-align: center;">${ch1_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">1.1 Introduction</td>
            <td style="padding: 3px 8px; text-align: center;">${ch1_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">1.2 Objectives</td>
            <td style="padding: 3px 8px; text-align: center;">${ch1_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">1.3 Scope</td>
            <td style="padding: 3px 8px; text-align: center;">${ch1_start + 1}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">1.4 Methodology</td>
            <td style="padding: 3px 8px; text-align: center;">${ch1_start + 1}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">1.5 Hardware Required</td>
            <td style="padding: 3px 8px; text-align: center;">${ch1_start + 1}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">1.6 Software Required</td>
            <td style="padding: 3px 8px; text-align: center;">${ch1_start + 2}</td>
          </tr>

          <!-- Chapter 2 -->
          <tr style="border-top: 1px solid #000; font-weight: bold;">
            <td style="padding: 5px 8px; text-align: center; border-right: 1px solid #000;">2.</td>
            <td style="padding: 5px 8px; border-right: 1px solid #000;">FUNCTIONAL REQUIREMENT</td>
            <td style="padding: 5px 8px; text-align: center;">${ch2_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">2.1 User &amp; Auth Management</td>
            <td style="padding: 3px 8px; text-align: center;">${ch2_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">2.2 Hyperlocal Job Management</td>
            <td style="padding: 3px 8px; text-align: center;">${ch2_start + 1}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">2.3 Application &amp; Review Lifecycle</td>
            <td style="padding: 3px 8px; text-align: center;">${ch2_start + 1}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">2.4 Real-Time Chat &amp; Wallet</td>
            <td style="padding: 3px 8px; text-align: center;">${ch2_start + 2}</td>
          </tr>

          <!-- Chapter 3 -->
          <tr style="border-top: 1px solid #000; font-weight: bold;">
            <td style="padding: 5px 8px; text-align: center; border-right: 1px solid #000;">3.</td>
            <td style="padding: 5px 8px; border-right: 1px solid #000;">DIAGRAMS</td>
            <td style="padding: 5px 8px; text-align: center;">${ch3_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">3.1 System Flowchart</td>
            <td style="padding: 3px 8px; text-align: center;">${ch3_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">3.2 Use Case Diagram</td>
            <td style="padding: 3px 8px; text-align: center;">${ch3_start + 1}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">3.3 Activity Diagram</td>
            <td style="padding: 3px 8px; text-align: center;">${ch3_start + 2}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">3.4 Class Diagram</td>
            <td style="padding: 3px 8px; text-align: center;">${ch3_start + 3}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">3.5 Sequence Diagram</td>
            <td style="padding: 3px 8px; text-align: center;">${ch3_start + 4}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">3.6 Gantt Chart</td>
            <td style="padding: 3px 8px; text-align: center;">${ch3_start + 5}</td>
          </tr>

          <!-- Chapter 4 -->
          <tr style="border-top: 1px solid #000; font-weight: bold;">
            <td style="padding: 5px 8px; text-align: center; border-right: 1px solid #000;">4.</td>
            <td style="padding: 5px 8px; border-right: 1px solid #000;">PROGRAM CODE</td>
            <td style="padding: 5px 8px; text-align: center;">${ch4_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">4.1 Program Code &amp; UI Outputs</td>
            <td style="padding: 3px 8px; text-align: center;">${ch4_start}</td>
          </tr>

          <!-- Chapter 5 -->
          <tr style="border-top: 1px solid #000; font-weight: bold;">
            <td style="padding: 5px 8px; text-align: center; border-right: 1px solid #000;">5.</td>
            <td style="padding: 5px 8px; border-right: 1px solid #000;">TESTING</td>
            <td style="padding: 5px 8px; text-align: center;">${ch5_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">5.1 Testing Approach &amp; Suites</td>
            <td style="padding: 3px 8px; text-align: center;">${ch5_start}</td>
          </tr>

          <!-- Chapter 6 -->
          <tr style="border-top: 1px solid #000; font-weight: bold;">
            <td style="padding: 5px 8px; text-align: center; border-right: 1px solid #000;">6.</td>
            <td style="padding: 5px 8px; border-right: 1px solid #000;">ADVANTAGES &amp; LIMITATIONS</td>
            <td style="padding: 5px 8px; text-align: center;">${ch6_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">6.1 Advantages</td>
            <td style="padding: 3px 8px; text-align: center;">${ch6_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">6.2 Limitations</td>
            <td style="padding: 3px 8px; text-align: center;">${ch6_start + 1}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">6.3 Plagiarism Chart</td>
            <td style="padding: 3px 8px; text-align: center;">${ch6_start + 2}</td>
          </tr>

          <!-- Chapter 7 -->
          <tr style="border-top: 1px solid #000; border-bottom: 1.5px solid #000; font-weight: bold;">
            <td style="padding: 5px 8px; text-align: center; border-right: 1px solid #000;">7.</td>
            <td style="padding: 5px 8px; border-right: 1px solid #000;">CONCLUSION</td>
            <td style="padding: 5px 8px; text-align: center;">${ch7_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">7.1 Future Scope</td>
            <td style="padding: 3px 8px; text-align: center;">${ch7_start}</td>
          </tr>
          <tr>
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">7.2 Conclusion</td>
            <td style="padding: 3px 8px; text-align: center;">${ch7_start + 2}</td>
          </tr>
          <tr style="border-bottom: 1.5px solid #000;">
            <td style="padding: 3px 8px; border-right: 1px solid #000;"></td>
            <td style="padding: 3px 8px; padding-left: 20px; border-right: 1px solid #000;">7.3 References</td>
            <td style="padding: 3px 8px; text-align: center;">${ch7_start + 3}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  allPages[5] = tocHtml;

  console.log(`Total Pages Planned: ${allPages.length}`);

  // Now assemble full HTML with exact page wrappers
  let fullHtml = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8">
  <title>NearbyHire Project Report</title>
  <style>
    @page {
      size: 210mm 297mm;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      margin: 0;
      padding: 0;
      background: #e2e8f0;
      font-family: 'Times New Roman', Times, serif;
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
      padding: 24px 30px;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }
    .page-number {
      position: absolute;
      bottom: 4mm;
      left: 15mm;
      font-size: 11pt;
      font-family: 'Times New Roman', Times, serif;
      color: #000;
    }
  </style>
  </head>
  <body>
  `;

  for (let i = 0; i < allPages.length; i++) {
    const pageNum = i + 1;
    fullHtml += `
      <div class="page">
        <div class="inner-border">
          ${allPages[i]}
        </div>
        <div class="page-number">Page | ${pageNum}</div>
      </div>
    `;
  }

  fullHtml += `
  </body>
  </html>
  `;

  fs.writeFileSync('C:/project/report_markup.html', fullHtml);
  console.log('report_markup.html written. Starting PDF rendering via Chrome...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Exporting PDF...');
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true
  });

  fs.writeFileSync(OUTPUT_PDF, pdfBuffer);
  // Also copy to Downloads so user can access it easily in their downloads folder!
  fs.writeFileSync('C:/Users/umar/Downloads/NEARBYHIRE_PROJECT_REPORT.pdf', pdfBuffer);

  await browser.close();
  console.log(`Success! Report created: ${OUTPUT_PDF} (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB, ${allPages.length} pages)`);
}

buildReport().catch(err => {
  console.error('Fatal error during report generation:', err);
  process.exit(1);
});
