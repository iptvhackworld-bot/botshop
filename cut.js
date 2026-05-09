const sharp = require("sharp");
const fs = require("fs");

const input = "./assets/roulette-sheet.png";
const outputDir = "./assets/roulette";

const cols = 5;
const rows = 4;

async function cutFrames() {

    const metadata = await sharp(input).metadata();

    const imgWidth = metadata.width;
    const imgHeight = metadata.height;

    console.log("Largeur :", imgWidth);
    console.log("Hauteur :", imgHeight);

    const frameWidth = Math.floor(imgWidth / cols);
    const frameHeight = Math.floor(imgHeight / rows);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    let index = 1;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {

            const left = x * frameWidth;
            const top = y * frameHeight;

            await sharp(input)
                .extract({
                    left,
                    top,
                    width: frameWidth,
                    height: frameHeight
                })
                .toFile(`${outputDir}/frame_${index}.png`);

            console.log(`✅ frame_${index}.png créé`);

            index++;
        }
    }

    console.log("🎉 Toutes les frames sont générées !");
}

cutFrames();