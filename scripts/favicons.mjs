// One-off: crops the avatar onto a navy disc for favicon and apple-touch-icon.
import sharp from "sharp";

const src = "src/assets/avatar.png";
// Face region of the 1254px avatar.
const face = { left: 310, top: 40, width: 660, height: 660 };

async function disc(size, out) {
  const portrait = await sharp(src)
    .extract(face)
    .resize(size, size)
    .png()
    .toBuffer();
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#090B1A"/></svg>`,
  );
  await sharp(bg)
    .composite([{ input: portrait }, { input: mask, blend: "dest-in" }])
    .png()
    .toFile(out);
}

await disc(64, "public/favicon.png");
await disc(180, "public/apple-touch-icon.png");
console.log("wrote favicon.png, apple-touch-icon.png");
