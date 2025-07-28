// // const puppeteer = require("puppeteer");
// // const TemplateModel = require("../model/templateModel");
// // const { generateComponentHtml } = require("../utilities/pdfBuilderUtility");

// // const pdf_generator = async (req, res) => {
// //   let browser;
// //   try {
// //     const templateId = req.params.id;
// //     const templateData = await TemplateModel.findOne({ templateId });

// //     if (!templateData) {
// //       return res
// //         .status(404)
// //         .json({ success: false, message: "Template not found" });
// //     }

// //     const globalStyles = templateData.globalStyles || {};
// //     const margins = globalStyles.margins || {
// //       top: 20,
// //       right: 15,
// //       bottom: 15,
// //       left: 15,
// //     };

// //     let allPagesHtml = "";
// //     templateData.pages.forEach((pageData) => {
// //       let pageComponentsHtml = "";
// //       pageData.components.forEach((component) => {
// //         pageComponentsHtml += generateComponentHtml(component);
// //       });

// //       const pageStyle = `position: relative; width: 210mm; height: 297mm; box-sizing: border-box; padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px; page-break-after: always;`;
// //       allPagesHtml += `<div class="page-container" style="${pageStyle.trim()}">${pageComponentsHtml}</div>`;
// //     });

// //     const mainContent = `
// //       <style>
// //         body { margin: 0; padding: 0; font-family: ${
// //           globalStyles.fontFamily || "Arial, sans-serif"
// //         }; }
// //         .page-container:last-child { page-break-after: avoid; }
// //         td p { margin: 0; }
// //       </style>
// //       ${allPagesHtml}
// //     `;

// //     browser = await puppeteer.launch({
// //       headless: "new",
// //       args: ["--no-sandbox", "--disable-setuid-sandbox"],
// //     });

// //     const page = await browser.newPage();

// //     const headerHtml = `<div style="width: 100%; font-size: 10px; padding: 15px 40px 0 40px; color: #757575; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
// //       <img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" />
// //       <img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" />
// //     </div>`;

// //     const footerHtml = `<div style="font-size: 6pt; color: #718096; font-family: Arial, sans-serif; width: 100%; text-align: center; border-top: 0.5pt solid #a0aec0; padding: 5px 40px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center;">
// //       <span>TIB-SP-TCF-002B</span>
// //       <span style="flex-grow: 1; text-align: center;">Technical Inspection Bureau (TIB) - PO BOX 25868, Abu Dhabi, UAE TEL+9712 6261737 www.tibuae.com tib@eim.ae</span>
// //     </div>`;

// //     await page.setContent(mainContent, { waitUntil: "networkidle0" });

// //     const pdfBuffer = await page.pdf({
// //       format: "A4",
// //       printBackground: true,
// //       displayHeaderFooter: true,
// //       headerTemplate: headerHtml,
// //       footerTemplate: footerHtml,
// //       margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
// //     });

// //     console.log("PDF generated successfully.");
// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="${
// //         templateData.title.replace(/[^a-z0-_.]/gi, "_") || "document"
// //       }.pdf"`
// //     );
// //     res.send(pdfBuffer);
// //   } catch (error) {
// //     console.error("Error during PDF generation:", error);
// //     res
// //       .status(500)
// //       .json({
// //         success: false,
// //         message: "PDF generation error",
// //         error: error.message,
// //       });
// //   } finally {
// //     if (browser) await browser.close();
// //   }
// // };

// // module.exports = { pdf_generator };

// const puppeteer = require("puppeteer");
// const TemplateModel = require("../model/templateModel");
// const { generateComponentHtml } = require("../utilities/pdfBuilderUtility");

// const pdf_generator = async (req, res) => {
//   let browser;
//   try {
//     const templateId = req.params.id;
//     // ========= NEW: Get the dynamic data from the request body =========
//     const dynamicData = req.body.data || {};
//     console.log("Dynamic Data:", dynamicData);
//     const templateData = await TemplateModel.findOne({ templateId });
//     if (!templateData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Template not found" });
//     }

//     const globalStyles = templateData.globalStyles || {};
//     const margins = globalStyles.margins || {
//       top: 20,
//       right: 15,
//       bottom: 15,
//       left: 15,
//     };

//     let allPagesHtml = "";
//     templateData.pages.forEach((pageData) => {
//       let pageComponentsHtml = "";
//       pageData.components.forEach((component) => {
//         // MODIFIED: Pass the dynamic data to your HTML generator
//         pageComponentsHtml += generateComponentHtml(component, dynamicData);
//       });

//       const pageStyle = `position: relative; width: 210mm; height: 297mm; box-sizing: border-box; padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px; page-break-after: always;`;
//       allPagesHtml += `<div class="page-container" style="${pageStyle.trim()}">${pageComponentsHtml}</div>`;
//     });

//     // NOTE: A base font-size is added here. This is essential for your fixed-height
//     // components to render correctly and not overflow, which causes the two-page layout.
//     // This makes the environment match the one your template was designed for.
//     const mainContent = `
//       <style>
//         body { 
//             margin: 0; 
//             padding: 0; 
//             font-family: ${globalStyles.fontFamily || "Arial, sans-serif"}; 
//             font-size: 7.5pt;
//         }
//         .page-container:last-child { page-break-after: avoid; }
//         td p { margin: 0; }
//       </style>
//       ${allPagesHtml}
//     `;

//     browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });
//     const page = await browser.newPage();

//     const headerHtml = `<div style="width: 100%; font-size: 10px; padding: 15px 40px 0 40px; color: #757575; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;">
//       <img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" />
//       <img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" />
//     </div>`;

//     const footerHtml = `<div style="font-size: 6pt; color: #718096; font-family: Arial, sans-serif; width: 100%; text-align: center; border-top: 0.5pt solid #a0aec0; padding: 5px 40px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center;">
//       <span>TIB-SP-TCF-002B</span>
//       <span style="flex-grow: 1; text-align: center;">Technical Inspection Bureau (TIB) - PO BOX 25868, Abu Dhabi, UAE TEL+9712 6261737 www.tibuae.com tib@eim.ae</span>
//       <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
//     </div>`;

//     await page.setContent(mainContent, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       displayHeaderFooter: true,
//       headerTemplate: headerHtml,
//       footerTemplate: footerHtml,
//       // NOTE: Margins are required for the header/footer to be displayed.
//       // Your code had 0px, which would hide them. This is corrected to match the desired output.
//       margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
//     });

//     console.log("PDF generated successfully.",pdfBuffer);
    
//     console.log("PDF generated successfully.");
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${
//         templateData.title.replace(/[^a-z0-_.]/gi, "_") || "document"
//       }.pdf"`
//     );
//     res.send(pdfBuffer);

//   } catch (error) {
//     console.error("Error during PDF generation:", error);
//     res.status(500).json({
//       success: false,
//       message: "PDF generation error",
//       error: error.message,
//     });
//   } finally {
//     if (browser) await browser.close();
//   }
// };

// module.exports = { pdf_generator };


//





// const puppeteer = require("puppeteer");
// const TemplateModel = require("../model/templateModel");
// const { generateComponentHtml } = require("../utilities/pdfBuilderUtility");

// const pdf_generator = async (req, res) => {
//   let browser;
//   try {
//     const templateId = req.params.id;
//     const dynamicData = req.body.data || {};
    
//     const templateData = await TemplateModel.findOne({ templateId });
//     if (!templateData) {
//       return res.status(404).json({ success: false, message: "Template not found" });
//     }

//     const globalStyles = templateData.globalStyles || {};
//     const margins = globalStyles.margins || { top: 20, right: 15, bottom: 15, left: 15 };
    
//     let allPagesHtml = "";
//     templateData.pages.forEach((pageData) => {
//       let pageComponentsHtml = "";
//       pageData.components.forEach((component) => {
//         pageComponentsHtml += generateComponentHtml(component, dynamicData);
//       });
//       // The page-container has padding to create the visual margin inside the page
//       const pageContainerStyle = `position: relative; width: 210mm; height: 297mm; box-sizing: border-box; padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px; page-break-after: always;`;
//       allPagesHtml += `<div class="page-container" style="${pageContainerStyle.trim()}">${pageComponentsHtml}</div>`;
//     });

//     // We add a base font-size to the body. This is CRITICAL. It ensures that the text renders at a scale
//     // that fits within the fixed heights defined in your JSON, preventing overflow to a second page.
//     const mainContent = `
//         <style>
//             body { 
//                 margin: 0; 
//                 padding: 0; 
//                 font-family: ${globalStyles.fontFamily || "Arial, sans-serif"}; 
//                 font-size: 7.5pt;
//             } 
//             .page-container:last-child { page-break-after: avoid; } 
//             td p { margin: 0; } 
//         </style>
//         ${allPagesHtml}
//     `;

//     browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
//     const page = await browser.newPage();
    
//     // Your requested header and footer templates
//     const headerHtml = `<div style="width: 100%; font-size: 10px; padding: 15px 40px 0 40px; color: #757575; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;"><img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" /><img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" /></div>`;
//     const footerHtml = `<div style="font-size: 6pt; color: #718096; font-family: Arial, sans-serif; width: 100%; text-align: center; border-top: 0.5pt solid #a0aec0; padding: 5px 40px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center;"><span>TIB-SP-TCF-002B</span><span style="flex-grow: 1; text-align: center;">Technical Inspection Bureau (TIB) - PO BOX 25868, Abu Dhabi, UAE TEL+9712 6261737 www.tibuae.com tib@eim.ae</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;
    
//     await page.setContent(mainContent, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       displayHeaderFooter: true,
//       headerTemplate: headerHtml,
//       footerTemplate: footerHtml,
//       // Using your exact, preferred PDF margins
//       margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
//     });

//     console.log("PDF generated successfully.");
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename="${templateData.title.replace(/[^a-z0-9]/gi, "_") || "document"}.pdf"`);
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error("Error during PDF generation:", error);
//     res.status(500).json({ success: false, message: "PDF generation error", error: error.message });
//   } finally {
//     if (browser) await browser.close();
//   }
// };

// module.exports = { pdf_generator };


const puppeteer = require("puppeteer");
const ActiveJobModel = require("../model/activeJobModel"); // Correctly import the ActiveJob model
const { generateComponentHtml } = require("../utilities/pdfBuilderUtility");

const pdf_generator = async (req, res) => {
  let browser;
  try {
    // Get jobId from the request parameters (e.g., from a route like /pdf/job/:jobId)
    const { jobId } = req.params;
    if (!jobId) {
        return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    // Fetch the specific ActiveJob using the jobId
    const activeJob = await ActiveJobModel.findOne({ jobId });
    if (!activeJob) {
      return res.status(404).json({ success: false, message: "Active job not found" });
    }
    
    // The templateData now comes from the activeJob document, which contains all user edits
    const templateData = activeJob.templateData;
    if (!templateData || !templateData.pages) {
        return res.status(500).json({ success: false, message: "Invalid or corrupt template data in the active job." });
    }

    // --- PDF generation logic (no changes needed from here down) ---

    const globalStyles = templateData.globalStyles || {};
    const margins = globalStyles.margins || { top: 20, right: 15, bottom: 15, left: 15 };
    
    let allPagesHtml = "";
    templateData.pages.forEach((pageData) => {
      let pageComponentsHtml = "";
      pageData.components.forEach((component) => {
        // The `generateComponentHtml` function will use the data already inside the `component` object
        pageComponentsHtml += generateComponentHtml(component);
      });
      // The page-container creates the visual margin inside the page
      const pageContainerStyle = `position: relative; width: 210mm; height: 297mm; box-sizing: border-box; padding: ${margins.top}px ${margins.right}px ${margins.bottom}px ${margins.left}px; page-break-after: always;`;
      allPagesHtml += `<div class="page-container" style="${pageContainerStyle.trim()}">${pageComponentsHtml}</div>`;
    });

    // The main HTML content to be rendered by Puppeteer
    const mainContent = `
        <style>
            body { 
                margin: 0; 
                padding: 0; 
                font-family: ${globalStyles.fontFamily || "Arial, sans-serif"}; 
                font-size: 7.5pt; /* Base font size for consistent rendering */
            } 
            .page-container:last-child { page-break-after: avoid; } 
            td p { margin: 0; } /* Reset paragraph margin inside table cells */
        </style>
        ${allPagesHtml}
    `;

    browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    
    // Define the header and footer templates
    const headerHtml = `<div style="width: 100%; font-size: 10px; padding: 15px 40px 0 40px; color: #757575; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box;"><img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" /><img src="https://fileinfo.com/img/icons/files/256/tib-2240.png" style="height: 30px;" /></div>`;
    const footerHtml = `<div style="font-size: 6pt; color: #718096; font-family: Arial, sans-serif; width: 100%; text-align: center; border-top: 0.5pt solid #a0aec0; padding: 5px 40px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center;"><span>TIB-SP-TCF-002B</span><span style="flex-grow: 1; text-align: center;">Technical Inspection Bureau (TIB) - PO BOX 25868, Abu Dhabi, UAE TEL+9712 6261737 www.tibuae.com tib@eim.ae</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;
    
    await page.setContent(mainContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
    });

    console.log(`PDF for job ${jobId} generated successfully.`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${templateData.title.replace(/[^a-z0-9]/gi, "_") || "document"}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error during PDF generation:", error);
    res.status(500).json({ success: false, message: "PDF generation error", error: error.message });
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { pdf_generator };