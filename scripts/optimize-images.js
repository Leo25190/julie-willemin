import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = './public/images/gallery';
const outputDir = './public/images/optimized/gallery';

// Configuration optimale
const TARGET_WIDTH = 800;
const QUALITY = 75;

// Créer le dossier de sortie
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertToAvif(inputPath, filename) {
  const name = path.parse(filename).name;
  const outputPath = path.join(outputDir, `${name}.avif`);

  try {
    console.log(`🔄 Conversion de ${filename}...`);

    const { size: originalSize } = fs.statSync(inputPath);

    await sharp(inputPath)
      .resize(TARGET_WIDTH, null, {
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      })
      .avif({
        quality: QUALITY,
        effort: 6, // Maximum de compression
      })
      .toFile(outputPath);

    const { size: newSize } = fs.statSync(outputPath);
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

    console.log(
      `✅ ${name}.avif créé (${Math.round(originalSize / 1024)}KB → ${Math.round(newSize / 1024)}KB, -${reduction}%)`
    );
  } catch (error) {
    console.error(`❌ Erreur avec ${filename}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Conversion en AVIF...\n');

  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Le dossier ${inputDir} n'existe pas`);
    return;
  }

  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );

  if (imageFiles.length === 0) {
    console.log('📂 Aucune image trouvée');
    return;
  }

  console.log(`📂 ${imageFiles.length} images à convertir\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    await convertToAvif(inputPath, file);
  }

  console.log('\n✨ Conversion terminée !');
  console.log(`📁 Images AVIF disponibles dans: ${outputDir}`);
}

main().catch(console.error);
