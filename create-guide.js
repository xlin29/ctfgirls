const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, Header, Footer, AlignmentType, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageBreak, PageNumber, LevelFormat
} = require('docx');

const logoData = fs.readFileSync(path.join(__dirname, 'public/images/logo.png'));

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const headerBorder = { style: BorderStyle.SINGLE, size: 1, color: '8B1A2B' };
const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 200 },
    children: [new TextRun({ text, bold: true, size: 36, font: 'Arial', color: '8B1A2B' })],
  });
}

function subheading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 30, font: 'Arial', color: '333333' })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, size: 24, font: 'Arial', ...opts })],
  });
}

function boldPara(label, text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [
      new TextRun({ text: label, size: 24, font: 'Arial', bold: true }),
      new TextRun({ text, size: 24, font: 'Arial' }),
    ],
  });
}

function flagPara(flag) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({
      text: flag,
      size: 28,
      font: 'Courier New',
      bold: true,
      color: '8B1A2B',
    })],
  });
}

function makeChallengeSection(num, title, flag, steps, explanation) {
  const children = [
    heading(`Challenge ${num}: ${title}`),
    flagPara(flag),
    subheading('Step-by-Step Solution'),
  ];

  steps.forEach((step, i) => {
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: `${i + 1}. `, size: 24, font: 'Arial', bold: true, color: '8B1A2B' }),
        new TextRun({ text: step, size: 24, font: 'Arial' }),
      ],
    }));
  });

  children.push(subheading('What This Teaches'));
  children.push(para(explanation));

  return children;
}

async function main() {
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 24 } },
      },
      paragraphStyles: [
        {
          id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 36, bold: true, font: 'Arial', color: '8B1A2B' },
          paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 },
        },
        {
          id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 30, bold: true, font: 'Arial', color: '444444' },
          paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 },
        },
      ],
    },
    sections: [
      // ===== COVER PAGE =====
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: [
          new Paragraph({ spacing: { before: 2400 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new ImageRun({
              type: 'png',
              data: logoData,
              transformation: { width: 480, height: 213 },
              altText: { title: 'Logo', description: 'EECS Girls Who Tech Camp Logo', name: 'logo' },
            })],
          }),
          new Paragraph({ spacing: { before: 600 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({
              text: 'CTF Challenge',
              size: 56,
              font: 'Arial',
              bold: true,
              color: '8B1A2B',
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [new TextRun({
              text: 'Answer Key & Solution Guide',
              size: 40,
              font: 'Arial',
              color: '555555',
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 100 },
            children: [new TextRun({
              text: 'FOR INSTRUCTORS ONLY',
              size: 28,
              font: 'Arial',
              bold: true,
              color: 'CC0000',
            })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800 },
            children: [new TextRun({
              text: 'Web Security & Digital Forensics',
              size: 26,
              font: 'Arial',
              color: '888888',
            })],
          }),
        ],
      },

      // ===== QUICK REFERENCE TABLE =====
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: 'EECS Girls Who Tech Camp \u2014 CTF Answer Key', size: 18, font: 'Arial', color: '999999', italics: true })],
            })],
          }),
        },
        footers: {
          default: new Footer({
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: 'Page ', size: 18, font: 'Arial', color: '999999' }), new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Arial', color: '999999' })],
            })],
          }),
        },
        children: [
          heading('Quick Reference: All Flags'),
          new Paragraph({ spacing: { after: 200 } }),
          new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: [600, 2800, 3560, 2400],
            rows: [
              new TableRow({
                children: ['#', 'Challenge', 'Flag', 'Category'].map((text, i) =>
                  new TableCell({
                    borders: headerBorders,
                    width: { size: [600, 2800, 3560, 2400][i], type: WidthType.DXA },
                    shading: { fill: '8B1A2B', type: ShadingType.CLEAR },
                    margins: cellMargins,
                    children: [new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [new TextRun({ text, size: 22, font: 'Arial', bold: true, color: 'FFFFFF' })],
                    })],
                  })
                ),
              }),
              ...([
                ['1', 'The Hidden Secret', 'flag{you_can_see_my_secrets!}', 'Web'],
                ['2', 'Cookie Monster', 'flag{nom_nom_cookies_are_yummy}', 'Web'],
                ['3', 'The Robot\u2019s Secret', 'flag{robots_cant_keep_secrets}', 'Web'],
                ['4', 'Secrets in a Photo', 'flag{photos_never_forget}', 'Forensics'],
                ['5', 'Log Detective', 'flag{sherlock_of_the_server}', 'Forensics'],
                ['6', 'The Mystery File', 'flag{not_everything_is_what_it_seems}', 'Forensics'],
              ].map((row, rowIdx) =>
                new TableRow({
                  children: row.map((text, i) =>
                    new TableCell({
                      borders,
                      width: { size: [600, 2800, 3560, 2400][i], type: WidthType.DXA },
                      shading: rowIdx % 2 === 0 ? { fill: 'F9F4F5', type: ShadingType.CLEAR } : undefined,
                      margins: cellMargins,
                      children: [new Paragraph({
                        alignment: i === 0 ? AlignmentType.CENTER : AlignmentType.LEFT,
                        children: [new TextRun({
                          text,
                          size: i === 2 ? 20 : 22,
                          font: i === 2 ? 'Courier New' : 'Arial',
                          bold: i === 2,
                          color: i === 2 ? '8B1A2B' : '333333',
                        })],
                      })],
                    })
                  ),
                })
              )),
            ],
          }),

          new Paragraph({ spacing: { before: 400 } }),
          heading('How to Run the CTF Platform'),
          para('1. Make sure Node.js is installed on the computer.'),
          para('2. Open a terminal and navigate to the ctf-girls folder.'),
          para('3. Run: npm install  (first time only)'),
          para('4. Run: node app.js'),
          para('5. Open a browser and go to http://localhost:3000'),
          para('Students should each have their own browser. The challenges track progress using cookies, so each browser session is independent.'),

          // ===== CHALLENGE SOLUTIONS =====
          new Paragraph({ children: [new PageBreak()] }),

          ...makeChallengeSection(
            1, 'The Hidden Secret \u2014 View Page Source',
            'flag{you_can_see_my_secrets!}',
            [
              'Go to http://localhost:3000/challenge/1',
              'Right-click anywhere on the fake website and select "View Page Source" (or press Ctrl+U)',
              'Use Ctrl+F to search for "flag{" in the source code',
              'Find the HTML comment: <!-- flag{you_can_see_my_secrets!} -->',
              'Copy and paste the flag into the submission box',
            ],
            'This challenge teaches that HTML source code is always visible to users. Developers should never hide sensitive information in comments, hidden elements, or client-side code. It introduces the concept of "View Source" and browser Developer Tools \u2014 fundamental skills for web security.'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          ...makeChallengeSection(
            2, 'Cookie Monster \u2014 Browser Cookies',
            'flag{nom_nom_cookies_are_yummy}',
            [
              'Go to http://localhost:3000/challenge/2',
              'Press F12 to open Developer Tools',
              'Go to the Application tab (Chrome) or Storage tab (Firefox)',
              'Click "Cookies" in the left sidebar, then click the localhost entry',
              'Find the cookie named "secret_flag" \u2014 its value is the flag',
              'Alternatively, type document.cookie in the Console tab',
            ],
            'This teaches students how browser cookies work and how to inspect them. Cookies are widely used for session management, tracking, and storing preferences. Understanding that cookies are readable by the user is essential for web security \u2014 sensitive data should never be stored in client-accessible cookies without proper protections.'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          ...makeChallengeSection(
            3, 'The Robot\u2019s Secret \u2014 robots.txt',
            'flag{robots_cant_keep_secrets}',
            [
              'Go to http://localhost:3000/challenge/3',
              'In the browser address bar, navigate to http://localhost:3000/robots.txt',
              'Read the file \u2014 notice "Disallow: /super-secret-diary/"',
              'Navigate to http://localhost:3000/super-secret-diary',
              'The secret diary page reveals the flag',
            ],
            'This teaches about the robots.txt standard and the concept of "security through obscurity." robots.txt tells search engines what not to index, but it is publicly readable and provides zero actual security. Students learn that real security requires authentication and access controls, not just hiding things.'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          ...makeChallengeSection(
            4, 'Secrets in a Photo \u2014 EXIF Metadata',
            'flag{photos_never_forget}',
            [
              'Go to http://localhost:3000/challenge/4 and download evidence.jpg',
              'Open an online EXIF viewer (search "EXIF viewer online" \u2014 e.g., jimpl.com)',
              'Upload the evidence.jpg file',
              'Look for the "Comment" field in the metadata',
              'The comment contains: flag{photos_never_forget}',
              'Alternative: Open a terminal and run "strings evidence.jpg | grep flag"',
            ],
            'This introduces digital forensics through image metadata analysis. Every digital photo contains EXIF data (camera info, timestamps, GPS location, comments). Forensic analysts use this information in investigations. Students also learn the privacy implications \u2014 photos can reveal where you were and when.'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          ...makeChallengeSection(
            5, 'Log Detective \u2014 Server Log Analysis + Base64',
            'flag{sherlock_of_the_server}',
            [
              'Go to http://localhost:3000/challenge/5 and read the server access logs',
              'Look for unusual requests \u2014 notice IP 10.0.0.55 making suspicious requests',
              'Find the line with /search?q=ZmxhZ3tzaGVybG9ja19vZl90aGVfc2VydmVyfQ==',
              'The query parameter looks like Base64 encoding (letters, numbers, ends with ==)',
              'Use an online Base64 decoder (search "Base64 decode online")',
              'Decode ZmxhZ3tzaGVybG9ja19vZl90aGVfc2VydmVyfQ== to get flag{sherlock_of_the_server}',
            ],
            'This teaches two important skills: log analysis and Base64 encoding/decoding. Log analysis is fundamental to incident response \u2014 when a breach occurs, logs are the first place investigators look. Base64 is encoding (not encryption!) and is commonly used in web technologies. Students also learn to recognize suspicious patterns like probing for /admin, /.env, and /backup.sql.'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          ...makeChallengeSection(
            6, 'The Mystery File \u2014 File Magic Numbers',
            'flag{not_everything_is_what_it_seems}',
            [
              'Go to http://localhost:3000/challenge/6 and download mystery_file.dat',
              'Open the file in a text editor (like Notepad) or hex editor',
              'Notice the file begins with %PDF \u2014 this is the magic number for PDF files',
              'Rename the file from mystery_file.dat to mystery_file.pdf',
              'Open the renamed file with a PDF reader',
              'The PDF displays the flag: flag{not_everything_is_what_it_seems}',
            ],
            'This teaches file signature analysis (magic numbers) \u2014 a core digital forensics skill. File extensions can be changed to anything, but the first bytes of a file reveal its true type. Forensic investigators use this technique to identify disguised or renamed files. Students learn not to trust file extensions and how to verify a file\u2019s true format.'
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(__dirname, 'CTF_Answer_Key.docx'), buffer);
  console.log('CTF_Answer_Key.docx created!');
}

main().catch(console.error);
