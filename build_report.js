const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Helper to encode images
function getBase64Img(filePath) {
  try {
    const ext = path.extname(filePath).replace('.', '');
    const data = fs.readFileSync(filePath).toString('base64');
    return `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,${data}`;
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

console.log('Images loaded. Assembling pages...');
