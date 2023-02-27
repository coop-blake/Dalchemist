/**
 * @module CreatePDF
 * @category Aura Cacia Tags
 */
import { launch } from "puppeteer";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

//const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

async function printPDF() {
  const browser = await launch({ headless: true });
  const page = await browser.newPage();
  const filePathURL = pathToFileURL(path.join(__dirname, "/renderTags.html"));
  await page.goto(`http://127.0.0.1:3002/src/ac/renderTags.html`, {
    waitUntil: "networkidle0",
  });


  const pdf = await page.pdf({
    format: "TABLOID",
    landscape: true,
    path: "./pup/ac.pdf",
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
  return pdf;
}

printPDF().then();
