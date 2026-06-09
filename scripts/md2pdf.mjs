import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmpDir = path.join(root, '.tmp');
const outDir = path.join(root, 'pdf');
mkdirSync(tmpDir, { recursive: true });
mkdirSync(outDir, { recursive: true });

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Order matters for the combined submission PDF.
const docs = [
  { file: 'README.md', title: 'README' },
  { file: 'docs/test-strategy.md', title: 'Mobile Test Strategy' },
  { file: 'docs/exploratory-testing-report.md', title: 'Exploratory Testing Report' },
  { file: 'docs/product-discovery.md', title: 'Product Discovery Questions' },
  { file: 'docs/automation-approach.md', title: 'How I Would Automate This Mobile App' },
  { file: 'docs/issues-tracker.md', title: 'Issues & Improvements Tracker' },
];

const css = `
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
         font-size: 11pt; line-height: 1.5; color: #1f2328; }
  h1 { font-size: 22pt; border-bottom: 2px solid #e1e4e8; padding-bottom: 6px; margin-top: 0; }
  h2 { font-size: 15pt; border-bottom: 1px solid #eaecef; padding-bottom: 4px; margin-top: 22px; }
  h3 { font-size: 12.5pt; margin-top: 16px; }
  p, li { font-size: 11pt; }
  a { color: #0969da; text-decoration: none; }
  code { background: #f6f8fa; padding: 1px 5px; border-radius: 4px; font-size: 9.5pt;
         font-family: SFMono-Regular, Consolas, Menlo, monospace; }
  pre { background: #f6f8fa; padding: 12px; border-radius: 6px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 9.5pt; }
  th, td { border: 1px solid #d0d7de; padding: 6px 9px; text-align: left; vertical-align: top; }
  th { background: #f6f8fa; }
  img { max-width: 320px; max-height: 460px; height: auto; border: 1px solid #d0d7de;
        border-radius: 6px; margin: 8px 0; display: block; }
  blockquote { border-left: 4px solid #d0d7de; margin: 10px 0; padding: 2px 14px; color: #57606a; }
  hr { border: none; border-top: 1px solid #e1e4e8; margin: 18px 0; }
  .doc { page-break-after: always; }
  .doc:last-child { page-break-after: auto; }
`;

const mime = (ext) =>
  ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' }[ext] ?? 'image/png');

function inlineImages(html, mdDir) {
  return html.replace(/<img([^>]*?)src="([^"]+)"([^>]*)>/g, (m, pre, src, post) => {
    if (src.startsWith('data:') || src.startsWith('http')) return m;
    try {
      const abs = path.resolve(mdDir, src);
      const b64 = readFileSync(abs).toString('base64');
      return `<img${pre}src="data:${mime(path.extname(abs).toLowerCase())};base64,${b64}"${post}>`;
    } catch {
      return m; // leave broken refs visible rather than failing the build
    }
  });
}

function renderDoc({ file, title }) {
  const mdPath = path.join(root, file);
  const md = readFileSync(mdPath, 'utf8');
  const html = inlineImages(marked.parse(md), path.dirname(mdPath));
  return { title, html };
}

function toPdf(name, innerHtml) {
  const page = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${innerHtml}</body></html>`;
  const htmlPath = path.join(tmpDir, `${name}.html`);
  const pdfPath = path.join(outDir, `${name}.pdf`);
  writeFileSync(htmlPath, page, 'utf8');
  execFileSync(CHROME, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ], { stdio: 'ignore' });
  console.log(`  ✓ ${path.relative(root, pdfPath)}`);
}

const rendered = docs.map(renderDoc);

console.log('Generating individual PDFs:');
rendered.forEach((d, i) => {
  const name = path.basename(docs[i].file, '.md');
  toPdf(name, `<div class="doc">${d.html}</div>`);
});

console.log('Generating combined submission PDF:');
const combined = rendered.map((d) => `<div class="doc">${d.html}</div>`).join('\n');
toPdf('Sokin-QA-Submission', combined);

console.log('\nDone. PDFs are in ./pdf/');
