import { getBrowser } from "./browser.js";

class PdfService {
  async generate(html: string) {
    const browser = await getBrowser();

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle",
    });

    const pdf = await page.pdf({
      format: "A4",

      printBackground: true,

      margin: {
        top: "12mm",

        bottom: "12mm",

        left: "10mm",

        right: "10mm",
      },
    });

    await page.close();

    return pdf;
  }
}

export default new PdfService();
