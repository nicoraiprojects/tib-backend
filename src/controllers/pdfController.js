const puppeteer = require("puppeteer");
const TemplateModel = require("../model/templateModel");
const { generateComponentHtml } = require("../utilities/pdfBuilderUtility");

const pdf_generator = async (req, res) => {
  let browser;
  try {
    const templateId = req.params.id;
    const templateData = await TemplateModel.findOne({ templateId });

    if (!templateData) {
      return res
        .status(404)
        .json({ success: false, message: "Template not found" });
    }

    const globalStyles = templateData.globalStyles || {};
    const margins = globalStyles.margins || {
      top: 20,
      right: 15,
      bottom: 15,
      left: 15,
    };

    let allPagesHtml = "";
    templateData.pages.forEach((pageData) => {
      let pageComponentsHtml = "";
      pageData.components.forEach((component) => {
        pageComponentsHtml += generateComponentHtml(component);
      });

      const pageStyle = `position: relative; width: 210mm; height: 297mm; box-sizing: border-box; padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px; page-break-after: always;`;
      allPagesHtml += `<div class="page-container" style="${pageStyle.trim()}">${pageComponentsHtml}</div>`;
    });

    const mainContent = `
      <style>
        body { margin: 0; padding: 0; font-family: ${
          globalStyles.fontFamily || "Arial, sans-serif"
        }; }
        .page-container:last-child { page-break-after: avoid; }
        td p { margin: 0; }
      </style>
      ${allPagesHtml}
    `;

    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const headerHtml = `<div style="width: 100%; font-size: 10px; padding: 15px 40px 0 40px; color: #757575; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
      <img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" />
      <img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" />
    </div>`;

    const footerHtml = `<div style="font-size: 6pt; color: #718096; font-family: Arial, sans-serif; width: 100%; text-align: center; border-top: 0.5pt solid #a0aec0; padding: 5px 40px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center;">
      <span>TIB-SP-TCF-002B</span>
      <span style="flex-grow: 1; text-align: center;">Technical Inspection Bureau (TIB) - PO BOX 25868, Abu Dhabi, UAE TEL+9712 6261737 www.tibuae.com tib@eim.ae</span>
    </div>`;

    await page.setContent(mainContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });

    console.log("PDF generated successfully.");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${
        templateData.title.replace(/[^a-z0-_.]/gi, "_") || "document"
      }.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error during PDF generation:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "PDF generation error",
        error: error.message,
      });
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { pdf_generator };
