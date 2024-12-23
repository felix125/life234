const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');

// 設定輸出路徑
const OUTPUT_DIR = 'assets/img/favicon';

// 確保目標資料夾存在
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function createSvgTemplate(size) {
  return `
    <svg width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="#E67E22"/>
      <text
        x="${size/2}"
        y="${size/2 + size*0.2}"
        font-size="${size * 0.6}"
        font-family="Dancing Script"
        font-weight="bold"
        fill="white"
        text-anchor="middle"
        dominant-baseline="middle">L</text>
    </svg>
  `;
}

async function generateIco() {
  try {
    const buffer = await pngToIco([path.join(OUTPUT_DIR, 'favicon-16x16.png')]);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'favicon.ico'), buffer);
    console.log('favicon.ico 已生成');
  } catch (error) {
    console.error('生成 ico 時發生錯誤:', error);
  }
}

async function generateFavicons() {
  try {
    // 確保輸出目錄存在
    ensureDirectoryExists(OUTPUT_DIR);

    // 生成各種尺寸的 PNG
    const sizes = [16, 32, 180, 192, 512];

    for (const size of sizes) {
      const svg = createSvgTemplate(size);
      const fileName =
        size === 16 ? 'favicon-16x16.png' :
        size === 32 ? 'favicon-32x32.png' :
        size === 180 ? 'apple-touch-icon.png' :
        size === 192 ? 'android-chrome-192x192.png' :
        'android-chrome-512x512.png';

      const filePath = path.join(OUTPUT_DIR, fileName);

      await sharp(Buffer.from(svg))
        .png()
        .toFile(filePath);

      console.log(`已生成 ${fileName}`);
    }

    // 生成 ICO
    await generateIco();

    // 生成 webmanifest
    const manifest = {
      "name": "Life234",
      "short_name": "L",
      "icons": [
        {
          "src": "/android-chrome-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/android-chrome-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ],
      "theme_color": "#E74C3C",
      "background_color": "#E74C3C",
      "display": "standalone"
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'site.webmanifest'),
      JSON.stringify(manifest, null, 2)
    );
    console.log('site.webmanifest 已生成');

  } catch (error) {
    console.error('生成過程中發生錯誤:', error);
  }
}

generateFavicons().catch(console.error);
