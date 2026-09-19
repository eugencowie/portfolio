import { Buffer } from "node:buffer";
import { once } from "node:events";
import { copyFile, mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import { chromium } from "@playwright/test";
import { dev } from "astro";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const avatarPath = join(projectRoot, "src/assets/avatar.png");
const publicDirectory = join(projectRoot, "public");
const face = { left: 310, top: 40, width: 660, height: 660 };

async function getAvailablePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not allocate a development server port");
  }
  const closed = once(server, "close");
  server.close();
  await closed;
  return address.port;
}

async function generateDisc(size, outputPath) {
  const portrait = await sharp(avatarPath)
    .extract(face)
    .resize(size, size)
    .png()
    .toBuffer();
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`,
  );
  const background = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#090B1A"/></svg>`,
  );
  await sharp(background)
    .composite([{ input: portrait }, { input: mask, blend: "dest-in" }])
    .png()
    .toFile(outputPath);
}

async function generateOpenGraphImage(outputPath) {
  const port = await getAvailablePort();
  const url = `http://127.0.0.1:${port}/og`;
  const developmentServer = await dev({
    devToolbar: { enabled: false },
    root: projectRoot,
    server: { host: "127.0.0.1", port },
  });
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({
      colorScheme: "dark",
      deviceScaleFactor: 1,
      viewport: { width: 1200, height: 630 },
    });
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (!response?.ok()) {
      throw new Error(`Could not load ${url}: HTTP ${response?.status()}`);
    }
    await page.evaluate(() => globalThis.document.fonts.ready);
    await page.screenshot({ path: outputPath });
  } finally {
    await browser?.close();
    await developmentServer.stop();
  }
}

const temporaryDirectory = await mkdtemp(join(tmpdir(), "portfolio-assets-"));
try {
  const faviconPath = join(temporaryDirectory, "favicon.png");
  const appleTouchIconPath = join(temporaryDirectory, "apple-touch-icon.png");
  const ogImagePath = join(temporaryDirectory, "og.png");

  await Promise.all([
    generateDisc(64, faviconPath),
    generateDisc(180, appleTouchIconPath),
  ]);
  await generateOpenGraphImage(ogImagePath);
  await Promise.all([
    copyFile(faviconPath, join(publicDirectory, "favicon.png")),
    copyFile(appleTouchIconPath, join(publicDirectory, "apple-touch-icon.png")),
    copyFile(ogImagePath, join(publicDirectory, "og.png")),
  ]);
} finally {
  await rm(temporaryDirectory, { force: true, recursive: true });
}

process.stdout.write(
  "Generated favicon.png, apple-touch-icon.png, and og.png\n",
);
