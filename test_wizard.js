const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

(async () => {
  console.log('Starting puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 900 });
  
  // Listen for console logs and page errors
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));
  
  try {
    // Navigate to login
    console.log('Navigating to login page...');
    await page.goto('http://localhost:5173/#/login', { waitUntil: 'networkidle2' });
    
    // Fill credentials
    console.log('Logging in...');
    await page.type('input[type="email"]', 'admin@ascas.com');
    await page.type('input[type="password"]', 'admin123');
    
    // Click login
    await page.click('button[type="submit"]');
    await delay(1500);
    
    // Navigate to wizard
    console.log('Navigating to billing wizard...');
    await page.goto('http://localhost:5173/#/billing/new', { waitUntil: 'networkidle2' });
    await delay(1000);
    
    // Fill step 1 form
    console.log('Filling Patient Details...');
    const inputs = await page.$$('input');
    
    // Index 3: Patient Name
    await inputs[3].type('Aisha Rahman');
    // Index 4: Patient ID
    await inputs[4].type('ASCAS-PT-9901');
    // Index 5: Age
    await inputs[5].type('31');
    
    // Select Custom Doctor: Click Dr. [other] button
    console.log('Selecting Dr. [other]...');
    const doctorButtons = await page.$$('button');
    for (const btn of doctorButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Dr. [other]')) {
        await btn.click();
        console.log('Clicked Dr. [other] button.');
        break;
      }
    }
    await delay(500);
    
    // Type custom doctor name in the newly rendered input
    const inputsAfterDoc = await page.$$('input');
    for (let i = 6; i < inputsAfterDoc.length; i++) {
      const ph = await page.evaluate(el => el.placeholder, inputsAfterDoc[i]);
      if (ph && ph.toLowerCase().includes('doctor')) {
        await inputsAfterDoc[i].type('Dr. Divyanand');
        console.log('Entered custom doctor name.');
        break;
      }
    }
    
    // Take screenshot before proceeding
    await page.screenshot({ path: 'step1_filled.png' });
    
    // Click Proceed
    console.log('Submitting step 1...');
    const submitButtons = await page.$$('button');
    for (const btn of submitButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Proceed to Package')) {
        await btn.click();
        console.log('Clicked Proceed to Package Selection.');
        break;
      }
    }
    await delay(1500);
    
    await page.screenshot({ path: 'step2_packages.png' });
    console.log('Step 2 screenshot saved.');
    
    // Select package (first visible package card)
    console.log('Selecting ICSI Basic package...');
    const packageCards = await page.$$('.cursor-pointer, .border-2');
    console.log(`Found ${packageCards.length} package items.`);
    
    let basicIcsiClicked = false;
    for (const card of packageCards) {
      const text = await page.evaluate(el => el.textContent, card);
      if (text && text.includes('ICSI Basic')) {
        await card.click();
        console.log('Selected ICSI Basic.');
        basicIcsiClicked = true;
        break;
      }
    }
    if (!basicIcsiClicked && packageCards.length > 0) {
      await packageCards[0].click();
      console.log('Selected first fallback package.');
    }
    await delay(1500);
    
    // Select an Add-on checkbox (e.g. LAH or MF or single room)
    console.log('Selecting add-ons...');
    const checkboxes = await page.$$('input[type="checkbox"]');
    console.log(`Found ${checkboxes.length} checkboxes.`);
    if (checkboxes.length > 0) {
      await checkboxes[0].click(); // Select first add-on
      console.log('Clicked first add-on checkbox.');
    }
    await delay(500);
    
    // Add custom exclusion
    console.log('Adding custom exclusion...');
    const allInputs = await page.$$('input');
    let exclInput = null;
    for (const input of allInputs) {
      const ph = await page.evaluate(el => el.placeholder, input);
      if (ph && ph.toLowerCase().includes('anesthesia')) {
        exclInput = input;
        break;
      }
    }
    
    if (exclInput) {
      await exclInput.type('Donor egg retrieval charges (if applicable)');
      // Find add button next to it
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && text.trim() === 'Add') {
          await btn.click();
          console.log('Clicked Add exclusion button.');
          break;
        }
      }
    } else {
      console.log('Could not find custom exclusion input field!');
    }
    await delay(1000);
    
    await page.screenshot({ path: 'step2_selected.png' });
    console.log('Step 2 selections screenshot saved.');
    
    // Click Choose Format button
    console.log('Proceeding to Step 3 Format Selection...');
    const step2Buttons = await page.$$('button');
    for (const btn of step2Buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Choose Format')) {
        await btn.click();
        console.log('Clicked Choose Format.');
        break;
      }
    }
    await delay(1500);
    
    await page.screenshot({ path: 'step3_format.png' });
    console.log('Step 3 format choices screenshot saved.');
    
    // Select Detailed Payment card
    console.log('Selecting Detailed Payment format...');
    const formatButtons = await page.$$('button');
    let formatClicked = false;
    for (const btn of formatButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Detailed Payment')) {
        await btn.click();
        console.log('Clicked Detailed Payment.');
        formatClicked = true;
        break;
      }
    }
    await delay(2000);
    
    await page.screenshot({ path: 'step4_preview.png' });
    console.log('Step 4 invoice preview screenshot saved.');
    
    // Evaluate elements
    const results = await page.evaluate(() => {
      const el = document.body;
      return {
        hasAddedItemsHeader: el.innerHTML.includes('Added Items / Procedures'),
        hasPackageExclusionsHeader: el.innerHTML.includes('Package Exclusions (Billed Separately)'),
        text: el.innerText
      };
    });
    console.log('Evaluation Results:', results);
    
  } catch (err) {
    console.error('An error occurred:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
