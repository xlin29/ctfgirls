// Generates the spoken Teaching Script as a DOCX.
// Stage directions, cheat sheets, and meta-content are stripped.
// Only what the instructor reads aloud, in natural conversational tone.

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageBreak,
} = require('docx');

// ---- helpers ----
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, font: 'Calibri', color: '8B1A2B' })],
  });
}

function h2(text, time) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    children: [
      new TextRun({ text, bold: true, size: 30, font: 'Calibri', color: '333333' }),
      ...(time ? [new TextRun({ text: '   ' + time, size: 22, font: 'Calibri', color: '888888', italics: true })] : []),
    ],
  });
}

function say(text) {
  return new Paragraph({
    spacing: { after: 180, line: 340 },
    children: [new TextRun({ text, size: 28, font: 'Calibri' })],
  });
}

function note(text) {
  return new Paragraph({
    spacing: { before: 60, after: 140 },
    children: [new TextRun({ text, italics: true, size: 22, font: 'Calibri', color: '8B1A2B' })],
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ---- content ----
const sections = [];

// Cover-ish header
sections.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text: 'CySER Summer Workshop 2026', bold: true, size: 44, font: 'Calibri', color: '8B1A2B' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [new TextRun({ text: 'Teaching Script', size: 32, font: 'Calibri', color: '555555' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [new TextRun({ text: 'Skyway Airlines engagement  ·  ~60 minutes', size: 22, font: 'Calibri', italics: true, color: '888888' })],
  }),
);

// OPENING
sections.push(h1('Opening'));
sections.push(note('5 minutes. Wait for the room to settle. Speak slowly.'));
sections.push(say(
  "Welcome. For the next hour you're not students, you're junior pentesters at CySER, and we just got hired by Skyway Airlines to audit their web stack."
));
sections.push(say(
  "Skyway's a small carrier. Small engineering team, tight deadlines, and the code shows it. Your job is to find the bugs before someone with worse intentions does."
));
sections.push(say(
  "Open your laptop and go to the URL on the board. You'll see eight findings. Each one is a real web vulnerability class, info disclosure, SQL injection, XSS, SSRF, even prompt injection, wrapped in a story. Exploit the bug, find a flag, submit it, and you get a debrief page about how the vuln works in the real world."
));
sections.push(say(
  "You don't have to do them in order. Skip what's sticky and come back. They're mostly independent."
));
sections.push(say(
  "A few ground rules. These bugs live in this app only. Don't try them on real websites, unauthorized testing is illegal in most countries and we're not posting bail. It's fine to talk to the person next to you, and it's fine to read the in-page hints, they're there on purpose. I'll be walking around, wave me down if you're stuck for more than a couple minutes."
));
sections.push(say("Any questions before we start the clock?"));
sections.push(say("Alright. Open Day 1. Go."));

// DAY 1
sections.push(pageBreak());
sections.push(h1('Day 1 — First Impressions'));
sections.push(note('Information Disclosure in HTML. After most solve, deliver the debrief.'));
sections.push(say(
  "This isn't a toy lesson. Companies ship API keys in JavaScript bundles every day. Bug bounty hunters grep minified bundles for 'Bearer' and 'data-api' and get paid for it weekly. View source is recon step one, every time."
));

// DAY 2
sections.push(h1('Day 2 — Bronze to Platinum'));
sections.push(note('Client-side trust. Cookie tampering.'));
sections.push(say(
  "Travel sites have priced premium economy as economy. E-commerce sites have applied zero-dollar totals at checkout. All because the price or tier lived in a client-side cookie. If the user can see it, the user can edit it. Anything you gate authorization on belongs on the server."
));

// DAY 3
sections.push(h1('Day 3 — The VIP Manifest'));
sections.push(note('IDOR. Broken Object-Level Authorization.'));
sections.push(say(
  "This is the number one API vulnerability class right now. OWASP calls it BOLA, Broken Object-Level Authorization. Facebook, T-Mobile, USPS, Parler, all leaked customer data this exact way. One HTTP request from 'your account' to 'someone else's account.' The endpoint asked 'are you logged in' but never asked 'should you see this specific object.'"
));

// DAY 4
sections.push(pageBreak());
sections.push(h1('Day 4 — The Crew Login'));
sections.push(note('SQL Injection. Auth bypass.'));
sections.push(say(
  "SQL injection. The grandparent of web vulnerabilities. Forty years old, still everywhere."
));
sections.push(say(
  "TalkTalk paid seventy-seven million pounds for a SQLi breach. Heartland Payment Systems lost a hundred and thirty million credit cards to SQLi. Sony Pictures, 7-Eleven, same bug. The fix is one line, parameterized queries. Twenty years and people still concatenate."
));

// DAY 5
sections.push(h1('Day 5 — Polluted Search'));
sections.push(note('Reflected XSS. Cookie exfiltration.'));
sections.push(say(
  "British Airways got fined twenty million pounds when an XSS-powered skimmer pulled three hundred eighty thousand customers' card details off their payment page. XSS isn't a popup-alert prank, it's the front door for session theft, malware delivery, supply-chain attacks."
));
sections.push(say(
  "The fix is output encoding, plus HttpOnly cookies, plus a Content Security Policy. Defense in depth, any one of those breaks the chain."
));

// DAY 6
sections.push(pageBreak());
sections.push(h1('Day 6 — The Image Proxy'));
sections.push(note('SSRF. The big one. Tell this story like you mean it.'));
sections.push(say(
  "Capital One. 2019. SSRF in a misconfigured firewall reached AWS metadata at one-sixty-nine-dot-two-fifty-four-dot-one-sixty-nine-dot-two-fifty-four. The metadata service returned IAM credentials. The attacker walked off with a hundred million customer records. A hundred and ninety million dollar settlement."
));
sections.push(say(
  "SSRF is the highest-impact bug class in cloud environments today. Your server is a confused deputy. It has network reach you don't, and it'll act on your behalf if you let it."
));

// DAY 7
sections.push(h1('Day 7 — The Chatbot Says Too Much'));
sections.push(note('Prompt Injection. System-prompt leak.'));
sections.push(say(
  "This is exactly how Bing's internal codename 'Sydney' leaked. It's how every batch of leaked custom-GPT instructions has come out."
));
sections.push(say(
  "The model has no architectural distinction between 'instructions to me' and 'instructions to share.' It's all just tokens in a context window. Asking it to dump the context, dumps the context."
));
sections.push(say(
  "Prompt injection is SQL injection wearing a hat. Same root cause, user input becomes interpreted instructions. Different layer, same lesson. Don't put secrets where the model can see them, because eventually a user will ask in the right phrasing."
));

// DAY 8
sections.push(pageBreak());
sections.push(h1('Day 8 — The Final Boss'));
sections.push(note('JWT alg:none. Algorithm confusion.'));
sections.push(say(
  "Auth0 shipped this bug. Atlassian shipped this bug. Almost every early JWT library had it."
));
sections.push(say(
  "The fix is one line, pin the algorithm. Pass an explicit allow-list of algorithms when you verify. Never let the token tell the verifier how it gets verified. The token's header is data, not a directive."
));

// CLOSING
sections.push(pageBreak());
sections.push(h1('Closing'));
sections.push(note('5 minutes. Bring everyone back together. Stand back. Slightly dramatic.'));
sections.push(say("That's eight findings. Look at what we actually did."));
sections.push(say("Day 1, we trusted what the client could see."));
sections.push(say("Day 2, we trusted what the client could send back."));
sections.push(say("Day 3, we trusted that nobody would guess the next ID."));
sections.push(say("Day 4, we trusted user input as SQL syntax."));
sections.push(say("Day 5, we trusted user input as HTML."));
sections.push(say("Day 6, we trusted that user-supplied URLs would point outward."));
sections.push(say("Day 7, we trusted that the model would honor 'don't say this.'"));
sections.push(say("Day 8, we trusted what the token said about itself."));
sections.push(say(
  "Eight different vulnerabilities. One pattern. Someone, somewhere, trusted user-controlled input to mean what it claimed to mean. Every web vulnerability you'll ever see is some version of this."
));
sections.push(say(
  "The fix at every layer is the same shape. Don't trust the boundary, verify it. Parameterize your queries. Escape your outputs. Allow-list your URLs. Pin your algorithms. Never put secrets where the user can reach them. It sounds obvious. It's also the entire job."
));
sections.push(say(
  "If you want to keep going, PortSwigger Web Security Academy is free and the best structured intro to web security I know. Hack The Box and TryHackMe have guided rooms."
));
sections.push(say(
  "Thanks for coming. Find me afterwards if you want to talk about a career in this, we always need more people. Questions?"
));

// ---- build ----
async function main() {
  const doc = new Document({
    styles: { default: { document: { run: { font: 'Calibri', size: 24 } } } },
    sections: [{
      properties: { page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1440, bottom: 1080, left: 1440 },
      } },
      headers: {
        default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: 'Teaching Script  ·  CySER Workshop 2026', size: 18, font: 'Calibri', color: '999999', italics: true })],
        })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: 'Page ', size: 18, font: 'Calibri', color: '999999' }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, font: 'Calibri', color: '999999' }),
          ],
        })] }),
      },
      children: sections,
    }],
  });
  const buf = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(__dirname, 'CTF_Teaching_Script.docx'), buf);
  console.log('CTF_Teaching_Script.docx created!');
}
main().catch(console.error);
