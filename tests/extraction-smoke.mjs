import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createWorker} from 'tesseract.js';
import mammoth from 'mammoth';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
const loading=getDocument({data:new Uint8Array(await fs.readFile('tests/fixtures/text.pdf')),standardFontDataUrl:path.resolve('node_modules/pdfjs-dist/standard_fonts')+path.sep});const pdf=await loading.promise;const text=(await(await pdf.getPage(1)).getTextContent()).items.map(i=>i.str||'').join(' ');assert(text.includes('AIMNEX PDF EVIDENCE 2026'));await loading.destroy();
const doc=await mammoth.extractRawText({path:'tests/fixtures/text.docx'});assert(doc.value.includes('AIMNEX DOCX EVIDENCE 2026'));
const worker=await createWorker('eng',1,{langPath:path.resolve('node_modules/@tesseract.js-data/eng/4.0.0_best_int'),cacheMethod:'none'});try{const result=await worker.recognize('tests/fixtures/ocr.png');assert(result.data.text.includes('AIMNEX EVIDENCE 2026'),result.data.text);}finally{await worker.terminate();}
console.log('PASS: actual PDF text extraction, DOCX text extraction and English OCR on synthetic fixtures.');
