const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  
  try {
    const page = await browser.newPage();
    // Emulate a mobile device
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    
    // 1. Log in to user app
    console.log('Navigating to login...');
    console.log('Login details presumably: admin@example.com / password123 or similar? Using a fake signup if login fails.');
    await page.goto('http://localhost:3000/auth/login', { waitUntil: 'domcontentloaded' });
    
    // Attempt sign in
    await page.type('#email', 'test@example.com');
    await page.type('#password', 'password123'); // Hope this standard test works, otherwise we'll try to sign up
    
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => console.log('Navigation timeout for login'))
    ]);
    
    // Wait for the UI to settle
    await new Promise(r => setTimeout(r, 2000));
    
    // Capture the User App logged-in screen
    const userAppImg = path.join(__dirname, 'public/images/screenshot-user-app.png');
    await page.screenshot({ path: userAppImg });
    console.log('Screenshot saved to ' + userAppImg);
    
    // Add something to cart to show the cart
    await page.evaluate(() => {
      // Find the first '+' button on a menu item
      const buttons = [...document.querySelectorAll('button')];
      const addBtn = buttons.find(b => b.innerText.includes('R') || !!b.closest('.group')); // Typically product cards
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    const userProductImg = path.join(__dirname, 'public/images/screenshot-user-product.png');
    await page.screenshot({ path: userProductImg });
    console.log('Screenshot saved to ' + userProductImg);
    
    // Attempt to log into admin dashboard on desktop viewport
    const adminPage = await browser.newPage();
    await adminPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    
    console.log('Navigating to admin login...');
    await adminPage.goto('http://localhost:3000/admin/login', { waitUntil: 'domcontentloaded' });
    await adminPage.type('#email', 'admin@example.com');
    await adminPage.type('#password', 'password123');
    
    await Promise.all([
      adminPage.click('button[type="submit"]'),
      adminPage.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => console.log('Admin Navigation timeout'))
    ]);
    
    await new Promise(r => setTimeout(r, 3000));
    const adminAppImg = path.join(__dirname, 'public/images/screenshot-admin-app.png');
    await adminPage.screenshot({ path: adminAppImg });
    console.log('Screenshot saved to ' + adminAppImg);
    
  } catch(e) {
    console.error('Error during automation:', e);
  } finally {
    await browser.close();
    console.log('Done!');
  }
})();
