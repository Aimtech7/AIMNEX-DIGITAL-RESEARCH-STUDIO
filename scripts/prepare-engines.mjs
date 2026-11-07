import fs from 'node:fs/promises';
import path from 'node:path';
const out='public/engines';await fs.mkdir(out,{recursive:true});
for(const name of ['pdf.worker.min.mjs','pdf.renderer.min.mjs'])await fs.copyFile(path.join('node_modules/pdfjs-dist/build',name),path.join(out,name));
await fs.copyFile('node_modules/tesseract.js/dist/worker.min.js',path.join(out,'tesseract.worker.min.js'));
await fs.mkdir(path.join(out,'ocr-core'),{recursive:true});
for(const f of await fs.readdir('node_modules/tesseract.js-core'))if(f.startsWith('tesseract-core')&&(f.endsWith('.js')||f.endsWith('.wasm')))await fs.copyFile(path.join('node_modules/tesseract.js-core',f),path.join(out,'ocr-core',f));
await fs.mkdir(path.join(out,'language'),{recursive:true});await fs.copyFile('node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz',path.join(out,'language','eng.traineddata.gz'));
console.log('Prepared same-origin PDF/OCR engines and English language data.');

for(const [src,dest] of [['standard_fonts','standard_fonts'],['cmaps','cmaps'],['wasm','pdf-wasm']])await fs.cp(path.join('node_modules/pdfjs-dist',src),path.join(out,dest),{recursive:true});
await fs.mkdir(path.join(out,'licenses'),{recursive:true});for(const pkg of ['pdfjs-dist','tesseract.js','tesseract.js-core']){try{await fs.copyFile(path.join('node_modules',pkg,'LICENSE'),path.join(out,'licenses',pkg+'.txt'));}catch{}}
