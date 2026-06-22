export interface StyleObject {
  fontFamily: string;
  fontSize: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textAlign: "left" | "center" | "right";
  color: string;
}

export interface HeroHeaderData {
  text: string;
  link?: string;
  style?: StyleObject;
}

export interface TextSectionData {
  id: string;
  title?: { text: string; style?: StyleObject };
  body?: { text: string; style?: StyleObject };
  link?: string;
}

interface GeneratorProps {
  heroHeader: HeroHeaderData;
  sections: TextSectionData[];
  backgroundImage: string | null;
}

export function generateHtml({ heroHeader, sections, backgroundImage }: GeneratorProps): string {
  // 1. Resolve header styling and elements
  const headerStyle = heroHeader.style || {
    fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
    fontSize: "36px",
    fontWeight: "bold",
    fontStyle: "normal",
    textAlign: "center",
    color: "",
  };

  const headerAlign = headerStyle.textAlign || "center";
  const headerColor = headerStyle.color || (backgroundImage ? "#ffffff" : "#09090b");
  const headerShadow = backgroundImage && !headerStyle.color ? "text-shadow: 0 2px 8px rgba(0,0,0,0.8);" : "";
  const headerLinkColor = headerStyle.color || (backgroundImage ? "#ffffff" : "#09090b");

  const headerInlineStyles = `font-family: ${headerStyle.fontFamily}; font-size: ${headerStyle.fontSize}; font-weight: ${headerStyle.fontWeight}; font-style: ${headerStyle.fontStyle}; text-align: ${headerAlign}; color: ${headerColor}; text-transform: uppercase; letter-spacing: 2px; line-height: 1.25; text-decoration: none; display: inline-block; ${headerShadow}`;

  let headerHtml = "";
  if (heroHeader.text) {
    if (heroHeader.link) {
      headerHtml = `<a href="${heroHeader.link}" target="_blank" style="${headerInlineStyles} color: ${headerLinkColor};">${heroHeader.text}</a>`;
    } else {
      headerHtml = `<span style="${headerInlineStyles}">${heroHeader.text}</span>`;
    }
  } else {
    headerHtml = `<span style="${headerInlineStyles}; color: #888888; font-style: italic;">[UNTITLED COVER]</span>`;
  }

  // 2. Resolve sidebar sections styling and elements
  let sectionsHtml = "";
  sections.forEach((section) => {
    const titleText = section.title?.text;
    const bodyText = section.body?.text;
    
    // Skip completely empty sections
    if (!titleText && !bodyText) return;

    const titleStyle = section.title?.style || {
      fontFamily: "Didot, 'Didot LT STD', Bodoni, Georgia, serif",
      fontSize: "16px",
      fontWeight: "bold",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
    };

    const bodyStyle = section.body?.style || {
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      fontWeight: "normal",
      fontStyle: "normal",
      textAlign: "left",
      color: "",
    };

    const tAlign = titleStyle.textAlign || "left";
    const tColor = titleStyle.color || (backgroundImage ? "#ffffff" : "#18181b");
    const tShadow = backgroundImage && !titleStyle.color ? "text-shadow: 0 1.5px 4px rgba(0,0,0,0.8);" : "";
    const titleInlineStyles = `font-family: ${titleStyle.fontFamily}; font-size: ${titleStyle.fontSize}; font-weight: ${titleStyle.fontWeight}; font-style: ${titleStyle.fontStyle}; text-align: ${tAlign}; color: ${tColor}; text-transform: uppercase; line-height: 1.25; ${tShadow}`;

    const bAlign = bodyStyle.textAlign || "left";
    const bColor = bodyStyle.color || (backgroundImage ? "#e4e4e7" : "#4b5563");
    const bShadow = backgroundImage && !bodyStyle.color ? "text-shadow: 0 1px 3px rgba(0,0,0,0.7);" : "";
    const bodyInlineStyles = `font-family: ${bodyStyle.fontFamily}; font-size: ${bodyStyle.fontSize}; font-weight: ${bodyStyle.fontWeight}; font-style: ${bodyStyle.fontStyle}; text-align: ${bAlign}; color: ${bColor}; line-height: 1.45; ${bShadow}`;

    const sectionAlignment = titleStyle.textAlign || bodyStyle.textAlign || "left";

    sectionsHtml += `
      <tr>
        <td style="padding: 12px 0; text-align: ${sectionAlignment};" align="${sectionAlignment}">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
    `;

    if (titleText) {
      sectionsHtml += `
            <tr>
              <td style="${titleInlineStyles}; padding-bottom: 4px;" align="${tAlign}">
                ${titleText}
              </td>
            </tr>
      `;
    }

    if (bodyText) {
      sectionsHtml += `
            <tr>
              <td style="${bodyInlineStyles}; padding-bottom: 6px;" align="${bAlign}">
                ${bodyText}
              </td>
            </tr>
      `;
    }

    if (section.link) {
      const linkColor = backgroundImage ? "#ffffff" : "#4f46e5";
      const linkTextShadow = backgroundImage ? "text-shadow: 0 1px 2px rgba(0,0,0,0.7);" : "";
      sectionsHtml += `
            <tr>
              <td align="${sectionAlignment}">
                <a href="${section.link}" target="_blank" style="font-family: sans-serif; font-size: 10px; font-weight: bold; color: ${linkColor}; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; ${linkTextShadow}">
                  More Info &rarr;
                </a>
              </td>
            </tr>
      `;
    }

    sectionsHtml += `
          </table>
        </td>
      </tr>
      <tr>
        <td height="12" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
      </tr>
    `;
  });

  if (!sectionsHtml) {
    sectionsHtml = `
      <tr>
        <td style="font-family: sans-serif; font-size: 11px; color: ${backgroundImage ? "#cccccc" : "#888888"}; font-style: italic; text-align: left;" align="left">
          [No content sections added]
        </td>
      </tr>
    `;
  }

  // 3. Resolve background styling
  // Standard email background fallback color & structure
  const bgStyles = backgroundImage
    ? `background-image: url('${backgroundImage}'); background-size: cover; background-position: center; background-repeat: no-repeat; background-color: #ffffff;`
    : `background-color: #f9fafb; background: linear-gradient(135deg, #f9fafb, #f3f4f6);`;

  const inlineBackgroundAttr = backgroundImage ? `background="${backgroundImage}"` : "";

  // 4. Return complete HTML document
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>${heroHeader.text || "Magazine Cover"}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <style type="text/css">
      /* CSS Resets */
      body {
        width: 100% !important;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        margin: 0;
        padding: 0;
      }
      img {
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      a img {
        border: none;
      }
      table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      th, td {
        border-collapse: collapse;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
    <!-- Outer Wrapper Table for Centering -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f3f4f6; width: 100%;">
      <tr>
        <td align="center" style="padding: 40px 10px;">
          
          <!-- Main Canvas Table (600px, 8.5x11 landscape aspect fallback helper) -->
          <table border="0" cellpadding="0" cellspacing="0" width="600" ${inlineBackgroundAttr} style="width: 600px; max-width: 600px; min-height: 776px; border-collapse: collapse; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.12); border: 1px solid #e2e8f0; ${bgStyles}" role="img" aria-label="Magazine Cover Artwork">
            <tr>
              <td valign="top" style="padding: 36px 28px;">
                
                <!-- Hero Header Table -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                  <tr>
                    <td height="12" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="${headerAlign}" valign="middle" style="text-align: ${headerAlign}; min-height: 90px; padding: 10px 0;">
                      ${headerHtml}
                    </td>
                  </tr>
                  <tr>
                    <td height="36" style="font-size: 1px; line-height: 1px;">&nbsp;</td>
                  </tr>
                </table>

                <!-- Main Layout Table (Sidebar & Spacing Column) -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                  <tr>
                    <!-- Left Sidebar Column (width 260px) -->
                    <td width="260" valign="top" style="width: 260px; text-align: left;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                        ${sectionsHtml}
                      </table>
                    </td>
                    
                    <!-- Right empty space (width 284px) to retain image visibility -->
                    <td width="284" style="width: 284px;">
                      &nbsp;
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;
}
