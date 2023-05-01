import puppeteer from "puppeteer";
import crypto from "node:crypto";
import fs from "node:fs";

const allData = JSON.parse(fs.readFileSync("./data.json"));
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function main(value) {
  // Format Due Dates
  var dueDate = value.dueDate?.split("-");
  dueDate = `${dueDate[1]}/${dueDate[2]}/${dueDate[0]}`;

  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();

  await page.goto("https://rebulding-iraq.vercel.app/dash", {
    waitUntil: "load",
  });

  // Login Form
  await page.type("#email", "himanshumasant@uxdlabtech.com");
  await page.type("#password", "Uxdlab@123");
  await page.keyboard.press("Enter");

  // Wait  For Selector to Appear
  await page.waitForSelector("#tenderTitle");

  // Tender Details
  await page.type("#tenderTitle", value.tenderTitle);
  await page.type("#tenderValue", value.tenderValue);
  await page.type(".ql-editor", value.tenderDetail);
  await page.type("#documentsURL", value.tenderURL);

  // Go To Next Step
  await page.click("#nextStep");

  // Company Details
  await page.type("#companyName", value.CompanyName);
  await page.type("#companyEmail", value.companyEmail);
  await page.type("#companyWebite", value.WebsiteURL);
  await page.type("#companyPhoneNumber", value.companyPhone);

  // Go To Next Step
  await page.click("#nextStep");

  // Contact Details
  await page.type("#firstName", value.firstName);
  await page.type("#lastName", value.lastName);
  await page.type("#email", value.contactEmail);
  await page.type("#jobTitle", value.jobTitle);
  await page.type("#phoneNumber", value.contactPhone);

  // Go To Next Step
  await page.click("#nextStep");

  // Skip Tender Categories
  await page.click("#nextStep");

  // Due Date
  await page.focus("#selectDueDate");
  await page.$eval("#selectDueDate", (el) => (el.value = ""));
  await page.keyboard.type(dueDate);

  // Go To Next Step
  await page.click("#nextStep");

  await page.screenshot({
    path: `screenshots/${crypto.randomUUID()}.png`,
    fullPage: true,
  });

  // Finish Filling Form
  await page.click("#nextStep");

  await browser.close();
}

allData.forEach(async (e) => {
  await main(e);
  await delay(1500);
});
