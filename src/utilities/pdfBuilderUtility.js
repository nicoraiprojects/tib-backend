const buildComponentStyle = (config) => {
  if (!config) return "";
  const style = {
    position: "absolute",
    left: `${config.x || 0}px`,
    top: `${config.y || 0}px`,
    width: `${config.width || "auto"}px`,
    height: `${config.height || "auto"}px`,
    "z-index": config.zIndex || 1,
    "box-sizing": "border-box",
  };
  return Object.entries(style).map(([k, v]) => `${k}:${v}`).join(";");
};

const buildTextBlockStyle = (config) => {
  const style = {
    color: config.color || "#000000",
    "font-family": config.fontFamily || "Arial, sans-serif",
    "font-size": `${config.fontSize || 12}px`,
    "font-weight": config.fontWeight || "normal",
    "line-height": config.lineHeight || 1.2,
    "text-align": config.alignment || "left",
    "text-decoration": config.isUnderlined ? "underline" : "none",
    "font-style": config.isItalic ? "italic" : "normal",
    "box-sizing": "border-box",
    height: "100%",
    width: "100%",
    "white-space": "pre-wrap",
  };
  return Object.entries(style).map(([k, v]) => `${k}:${v}`).join(";");
};

const getBorderStyle = (borderInfo, tableConfig) => {
  const width = tableConfig.borderWidth || 1;
  const style = borderInfo?.style || tableConfig.borderStyle || "solid";
  const color = tableConfig.borderColor || "#000000";
  // If the border is not visible, render it as transparent to maintain layout
  if (!borderInfo || !borderInfo.visible) {
    return `${width}px ${style} transparent`;
  }
  return `${width}px ${style} ${color}`;
};

const generateTableHtml = (tableConfig) => {
  if (!tableConfig || !tableConfig.data) return "";

  let html = `<table style="width: 100%; height: 100%; border-collapse: collapse; font-family: ${
    tableConfig.fontFamily || "inherit"
  }; font-size: ${tableConfig.bodyFontSize || 9}px;">`;

  if (tableConfig.columnWidths?.length > 0) {
    html += "<colgroup>";
    tableConfig.columnWidths.forEach((width) => {
      html += `<col style="width: ${width}%;">`;
    });
    html += "</colgroup>";
  }

  html += "<tbody>";
  tableConfig.data.forEach((row, rowIndex) => {
    html += "<tr>";
    row.forEach((cell) => {
      if (cell.hidden) return; // Skip rendering of hidden cells from a merge
      
      const attributes = [
        cell.colspan > 1 ? `colspan="${cell.colspan}"` : "",
        cell.rowspan > 1 ? `rowspan="${cell.rowspan}"` : "",
      ].join(" ");

      const cellPadding = cell.nestedTable ? 0 : tableConfig.cellPadding || 0;
      let alignment = tableConfig.bodyAlignment || "left";
      if (tableConfig.hasHeader && rowIndex === 0) {
        alignment = tableConfig.headerAlignment || "center";
      }

      const cellStyle = `
        padding: ${cellPadding}px; 
        vertical-align: top; 
        text-align: ${alignment}; 
        border-top: ${getBorderStyle(cell.borders.top, tableConfig)}; 
        border-right: ${getBorderStyle(cell.borders.right, tableConfig)}; 
        border-bottom: ${getBorderStyle(cell.borders.bottom, tableConfig)}; 
        border-left: ${getBorderStyle(cell.borders.left, tableConfig)};
      `;

      let cellContent = cell.content || "";
      if (cell.nestedTable) {
        cellContent += generateTableHtml(cell.nestedTable);
      }
      
      html += `<td ${attributes} style="${cellStyle.trim()}">${cellContent}</td>`;
    });
    html += "</tr>";
  });
  html += "</tbody></table>";
  return html;
};

const generateComponentHtml = (component) => {
  const containerStyle = buildComponentStyle(component.config);
  let innerHtml = "";

  switch (component.type) {
    case "TextBlock":
      // The content is already updated in component.config.content from the active job data
      innerHtml = `<div style="${buildTextBlockStyle(component.config)}">${component.config.content || ""}</div>`;
      break;
    case "Table":
      // The table data is already updated in component.config.data
      innerHtml = generateTableHtml(component.config);
      break;
    case "Image":
      // Example of how to handle an Image component
      const imgConf = component.config;
      const imgStyle = `width: 100%; height: 100%; object-fit: ${imgConf.objectFit || 'contain'}; opacity: ${imgConf.opacity || 1};`;
      innerHtml = `<img src="${imgConf.src}" style="${imgStyle}" />`;
      break;
    case "Divider":
      // Example of how to handle a Divider component
      const divConf = component.config;
      const divStyle = `width: 100%; height: ${divConf.strokeWidth || 1}px; background-color: ${divConf.color || '#000000'}; border: 0; margin: 0;`;
      innerHtml = `<hr style="${divStyle}" />`;
      break;
    default:
      console.warn(`PDF generation: Unknown component type '${component.type}'`);
      return "";
  }

  return `<div style="${containerStyle}">${innerHtml}</div>`;
};

module.exports = {
  buildComponentStyle,
  buildTextBlockStyle,
  getBorderStyle,
  generateTableHtml,
  generateComponentHtml,
};



//



// const buildComponentStyle = (config) => {
//   if (!config) return "";
//   const style = {
//     position: "absolute",
//     left: `${config.x || 0}px`,
//     top: `${config.y || 0}px`,
//     width: `${config.width || "auto"}px`,
//     height: `${config.height || "auto"}px`,
//     "z-index": config.zIndex || 1,
//     "box-sizing": "border-box",
//   };
//   return Object.entries(style).map(([k, v]) => `${k}:${v}`).join(";");
// };

// const buildTextBlockStyle = (config) => {
//   const style = {
//     color: config.color || "#000000",
//     "font-family": config.fontFamily || "Arial, sans-serif",
//     "font-size": `${config.fontSize || 12}px`,
//     "font-weight": config.fontWeight || "normal",
//     "line-height": config.lineHeight || 1.2,
//     "text-align": config.alignment || "left",
//     "text-decoration": config.isUnderlined ? "underline" : "none",
//     "font-style": config.isItalic ? "italic" : "normal",
//     "box-sizing": "border-box",
//     height: "100%",
//     width: "100%",
//     "white-space": "pre-wrap",
//   };
//   return Object.entries(style).map(([k, v]) => `${k}:${v}`).join(";");
// };

// const getBorderStyle = (borderInfo, tableConfig) => {
//   const width = tableConfig.borderWidth || 1;
//   const style = borderInfo?.style || tableConfig.borderStyle || "solid";
//   const color = tableConfig.borderColor || "#000000";
//   if (!borderInfo || !borderInfo.visible) {
//     return `${width}px ${style} transparent`;
//   }
//   return `${width}px ${style} ${color}`;
// };

// const generateTableHtml = (tableConfig) => {
//   let html = `<table style="width: 100%; height: 100%; border-collapse: collapse; font-family: ${
//     tableConfig.fontFamily || "inherit"
//   }; font-size: ${tableConfig.bodyFontSize || 9}px;">`;

//   if (tableConfig.columnWidths?.length > 0) {
//     html += "<colgroup>";
//     tableConfig.columnWidths.forEach((width) => {
//       html += `<col style="width: ${width}%;">`;
//     });
//     html += "</colgroup>";
//   }

//   html += "<tbody>";
//   tableConfig.data.forEach((row, rowIndex) => {
//     html += "<tr>";
//     row.forEach((cell) => {
//       if (cell.hidden) return;
//       const attributes = [
//         cell.colspan > 1 ? `colspan="${cell.colspan}"` : "",
//         cell.rowspan > 1 ? `rowspan="${cell.rowspan}"` : "",
//       ].join(" ");
//       const cellPadding = cell.nestedTable ? 0 : tableConfig.cellPadding || 0;
//       let alignment = tableConfig.bodyAlignment || "left";
//       if (tableConfig.hasHeader && rowIndex === 0) {
//         alignment = tableConfig.headerAlignment || "center";
//       }
//       const cellStyle = `padding: ${cellPadding}px; vertical-align: top; text-align: ${alignment}; border-top: ${getBorderStyle(cell.borders.top, tableConfig)}; border-right: ${getBorderStyle(cell.borders.right, tableConfig)}; border-bottom: ${getBorderStyle(cell.borders.bottom, tableConfig)}; border-left: ${getBorderStyle(cell.borders.left, tableConfig)};`;
//       let cellContent = cell.content || "";
//       if (cell.nestedTable) {
//         cellContent += generateTableHtml(cell.nestedTable);
//       }
//       html += `<td ${attributes} style="${cellStyle.trim()}">${cellContent}</td>`;
//     });
//     html += "</tr>";
//   });
//   html += "</tbody></table>";
//   return html;
// };

// const generateComponentHtml = (component) => {
//   const containerStyle = buildComponentStyle(component.config);
//   let innerHtml = "";

//   switch (component.type) {
//     case "TextBlock":
//       innerHtml = `<div style="${buildTextBlockStyle(component.config)}">${component.config.content || ""}</div>`;
//       break;
//     case "Table":
//       innerHtml = generateTableHtml(component.config);
//       break;
//     default:
//       console.warn(`Unknown component type: ${component.type}`);
//       return "";
//   }

//   return `<div style="${containerStyle}">${innerHtml}</div>`;
// };

// module.exports = {
//   buildComponentStyle,
//   buildTextBlockStyle,
//   getBorderStyle,
//   generateTableHtml,
//   generateComponentHtml,
// };






//







// // ========= NEW HELPER FUNCTION FOR DATA INJECTION =========
// /**
//  * Injects dynamic data into a string by replacing {{key}} placeholders.
//  * @param {string | null} content The string containing placeholders.
//  * @param {object} data The data object with key-value pairs.
//  * @returns {string} The content with placeholders replaced by data.
//  */
// const injectData = (content, data) => {
//   console.log("Injecting data into content:", content, data);
  
//   if (!content || !data) return content || '';
//   // Regex to find all instances of {{key}}
//   return content.replace(/{{(.*?)}}/g, (match, key) => {
//     const trimmedKey = key.trim();
//     // Return the value from the data object, or an empty string if not found.
//     return data[trimmedKey] !== undefined ? data[trimmedKey] : '';
//   });
// };

// // --- YOUR EXISTING CODE (UNCHANGED) ---
// const buildComponentStyle = (config) => {
//   if (!config) return "";
//   const style = {
//     position: "absolute",
//     left: `${config.x || 0}px`,
//     top: `${config.y || 0}px`,
//     width: `${config.width || "auto"}px`,
//     height: `${config.height || "auto"}px`,
//     "z-index": config.zIndex || 1,
//     "box-sizing": "border-box",
//   };
//   return Object.entries(style).map(([k, v]) => `${k}:${v}`).join(";");
// };

// const buildTextBlockStyle = (config) => {
//   const style = {
//     color: config.color || "#000000",
//     "font-family": config.fontFamily || "Arial, sans-serif",
//     "font-size": `${config.fontSize || 12}px`,
//     "font-weight": config.fontWeight || "normal",
//     "line-height": config.lineHeight || 1.2,
//     "text-align": config.alignment || "left",
//     "text-decoration": config.isUnderlined ? "underline" : "none",
//     "font-style": config.isItalic ? "italic" : "normal",
//     "box-sizing": "border-box",
//     height: "100%",
//     width: "100%",
//     "white-space": "pre-wrap",
//   };
//   return Object.entries(style).map(([k, v]) => `${k}:${v}`).join(";");
// };

// const getBorderStyle = (borderInfo, tableConfig) => {
//   const width = tableConfig.borderWidth || 1;
//   const style = borderInfo?.style || tableConfig.borderStyle || "solid";
//   const color = tableConfig.borderColor || "#000000";
//   if (!borderInfo || !borderInfo.visible) {
//     return `${width}px ${style} transparent`;
//   }
//   return `${width}px ${style} ${color}`;
// };

// // MODIFIED: This function now accepts a 'data' object
// const generateTableHtml = (tableConfig, data) => {
//   let html = `<table style="width: 100%; height: 100%; border-collapse: collapse; font-family: ${
//     tableConfig.fontFamily || "inherit"
//   }; font-size: ${tableConfig.bodyFontSize || 9}px;">`;

//   if (tableConfig.columnWidths?.length > 0) {
//     html += "<colgroup>";
//     tableConfig.columnWidths.forEach((width) => {
//       html += `<col style="width: ${width}%;">`;
//     });
//     html += "</colgroup>";
//   }

//   html += "<tbody>";
//   tableConfig.data.forEach((row, rowIndex) => {
//     html += "<tr>";
//     row.forEach((cell) => {
//       if (cell.hidden) return;
//       const attributes = [
//         cell.colspan > 1 ? `colspan="${cell.colspan}"` : "",
//         cell.rowspan > 1 ? `rowspan="${cell.rowspan}"` : "",
//       ].join(" ");
//       const cellPadding = cell.nestedTable ? 0 : tableConfig.cellPadding || 0;
//       let alignment = tableConfig.bodyAlignment || "left";
//       if (tableConfig.hasHeader && rowIndex === 0) {
//         alignment = tableConfig.headerAlignment || "center";
//       }
//       const cellStyle = `padding: ${cellPadding}px; vertical-align: top; text-align: ${alignment}; border-top: ${getBorderStyle(cell.borders.top, tableConfig)}; border-right: ${getBorderStyle(cell.borders.right, tableConfig)}; border-bottom: ${getBorderStyle(cell.borders.bottom, tableConfig)}; border-left: ${getBorderStyle(cell.borders.left, tableConfig)};`;
      
//       // MODIFIED: Inject data into the cell content
//       let cellContent = injectData(cell.content, data);
      
//       if (cell.nestedTable) {
//         // Pass the data down to the nested table renderer
//         cellContent += generateTableHtml(cell.nestedTable, data);
//       }
//       html += `<td ${attributes} style="${cellStyle.trim()}">${cellContent}</td>`;
//     });
//     html += "</tr>";
//   });
//   html += "</tbody></table>";
//   return html;
// };

// // MODIFIED: This function now accepts a 'data' object
// const generateComponentHtml = (component, data) => {
//   const containerStyle = buildComponentStyle(component.config);
//   let innerHtml = "";

//   switch (component.type) {
//     case "TextBlock":
//       // MODIFIED: Inject data into the TextBlock content
//       const injectedContent = injectData(component.config.content, data);
//       innerHtml = `<div style="${buildTextBlockStyle(component.config)}">${injectedContent}</div>`;
//       break;
//     case "Table":
//       // MODIFIED: Pass the data object down to the table renderer
//       innerHtml = generateTableHtml(component.config, data);
//       break;
//     default:
//       console.warn(`Unknown component type: ${component.type}`);
//       return "";
//   }

//   return `<div style="${containerStyle}">${innerHtml}</div>`;
// };

// module.exports = {
//   generateComponentHtml,
// };