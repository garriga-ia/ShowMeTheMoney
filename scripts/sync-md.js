#!/usr/bin/env node
/**
 * scripts/sync-md.js
 * 
 * Sincronitzador automàtic de fitxers Markdown (md/) a partir de la font única
 * de contingut en JavaScript (js/data/).
 * 
 * Regla de desenvolupament:
 * - FONT ÚNICA: Edita SEMPRE únicament 'js/data/capitolX.js' o 'js/data/capitols-index.js'.
 * - MAI s'editen dues versions manualment.
 * - Executa aquest script per regenerar les còpies de 'md/' automàticament.
 * 
 * Ús:
 *   node scripts/sync-md.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'js', 'data');
const TARGET_DIR = path.join(ROOT_DIR, 'md');

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// 1. Llegir fitxers .js vàlids a js/data/
const sourceFiles = fs.readdirSync(SOURCE_DIR)
  .filter(file => file.endsWith('.js') && (file.startsWith('capitol') || file === 'capitols-index.js'))
  .sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

console.log(`🔄 Sincronitzant ${sourceFiles.length} fitxers des de js/data/ cap a md/...`);

const validMdTargets = new Set();

sourceFiles.forEach(file => {
  const baseName = path.basename(file, '.js');
  const targetFile = `${baseName}.md`;
  validMdTargets.add(targetFile);

  const sourcePath = path.join(SOURCE_DIR, file);
  const targetPath = path.join(TARGET_DIR, targetFile);

  const content = fs.readFileSync(sourcePath, 'utf8');

  const banner = `<!--\n  ⚠️ ATENCIÓ: FITXER GENERAT AUTOMÀTICAMENT A PARTIR DE js/data/${file}\n  NO EDITIS MANUALMENT AQUEST FITXER. FONT ÚNICA DE CONTINGUT: js/data/${file}\n  Per regenerar, executa: node scripts/sync-md.js\n-->\n\n`;

  fs.writeFileSync(targetPath, banner + content, 'utf8');
  console.log(`  ✓ ${file} ➔ md/${targetFile}`);
});

// 2. Netejar fitxers orfes a md/ (com ara versions antigues capitol4_1.md)
const existingMdFiles = fs.readdirSync(TARGET_DIR).filter(file => file.endsWith('.md'));
existingMdFiles.forEach(mdFile => {
  if (!validMdTargets.has(mdFile)) {
    const orphanPath = path.join(TARGET_DIR, mdFile);
    fs.unlinkSync(orphanPath);
    console.log(`  🗑️ Eliminat fitxer orfe obsolet: md/${mdFile}`);
  }
});

// 3. Eliminar qualsevol fitxer .md residual dins de js/data/
const residualDataMd = fs.readdirSync(SOURCE_DIR).filter(file => file.endsWith('.md'));
residualDataMd.forEach(residualFile => {
  const residualPath = path.join(SOURCE_DIR, residualFile);
  fs.unlinkSync(residualPath);
  console.log(`  🧹 Netejat fitxer residual redundant: js/data/${residualFile}`);
});

console.log('✨ Sincronització completada amb èxit! La font única és a js/data/*.js.');
