import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import HTMLtoDOCX from 'html-to-docx';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'docx');
mkdirSync(outDir, { recursive: true });

const docs = [
  { file: 'README.md', title: 'README' },
  { file: 'docs/test-strategy.md', title: 'Mobile Test Strategy' },
  { file: 'docs/exploratory-testing-report.md', title: 'Exploratory Testing Report' },
  { file: 'docs/product-discovery.md', title: 'Product Discovery Questions' },
  { file: 'docs/automation-approach.md', title: 'How I Would Automate This Mobile App' },
  { file: 'docs/issues-tracker.md', title: 'Issues & Improvements Tracker' },
];

const mime = (ext) =>
  ({ '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' }[ext] ?? 'image/png');

// Read intrinsic PNG dimensions so Word images get a sensible, editable size.
function pngSize(buf) {
  if (buf.length > 24 && buf.toString('ascii', 12, 16) === 'IHDR') {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  return null;
}

const MAX_W = 360; // px

function inlineImages(html, mdDir) {
  return html.replace(/<img([^>]*?)src="([^"]+)"([^>]*)>/g, (m, pre, src, post) => {
    if (src.startsWith('data:') || src.startsWith('http')) return m;
    try {
      const abs = path.resolve(mdDir, src);
      const buf = readFileSync(abs);
      const b64 = buf.toString('base64');
      const dim = pngSize(buf);
      let sizeAttr = '';
      if (dim) {
        const scale = Math.min(1, MAX_W / dim.w);
        sizeAttr = ` width="${Math.round(dim.w * scale)}" height="${Math.round(dim.h * scale)}"`;
      }
      return `<img${pre}src="data:${mime(path.extname(abs).toLowerCase())};base64,${b64}"${sizeAttr}${post}>`;
    } catch {
      return m;
    }
  });
}

async function toDocx(name, innerHtml) {
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>${innerHtml}</body></html>`;
  const buffer = await HTMLtoDOCX(html, null, {
    table: { row: { cantSplit: true } },
    footer: false,
    pageNumber: false,
  });
  const out = path.join(outDir, `${name}.docx`);
  writeFileSync(out, buffer);
  console.log(`  ✓ ${path.relative(root, out)}`);
}

const rendered = docs.map(({ file, title }) => {
  const mdPath = path.join(root, file);
  const html = inlineImages(marked.parse(readFileSync(mdPath, 'utf8')), path.dirname(mdPath));
  return { title, html };
});

console.log('Generating individual .docx files:');
for (let i = 0; i < rendered.length; i++) {
  await toDocx(path.basename(docs[i].file, '.md'), rendered[i].html);
}

console.log('Generating combined submission .docx:');
const combined = rendered
  .map((d) => d.html)
  .join('<br/><hr/><br/>');
await toDocx('Sokin-QA-Submission', combined);

console.log('\nDone. Word documents are in ./docx/');
