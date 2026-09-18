import { spawn } from "node:child_process";
import { Buffer } from "node:buffer";
import { once } from "node:events";
import { constants } from "node:fs";
import { copyFile, mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import { chromium } from "@playwright/test";
import sharp from "sharp";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const avatarPath = join(projectRoot, "src/assets/avatar.png");
const ogTemplatePath = join(projectRoot, "scripts/og.astro");
const ogPagePath = join(projectRoot, "src/pages/og.astro");
const publicDirectory = join(projectRoot, "public");
const face = { left: 310, top: 40, width: 660, height: 660 };

async function buildOpenGraphPage(outputDirectory) {
  const child = spawn(
    "mise",
    [
      "exec",
      "--",
      "pnpm",
      "exec",
      "astro",
      "build",
      "--out-dir",
      outputDirectory,
    ],
    {
      cwd: projectRoot,
      stdio: "inherit",
    },
  );
  const [code] = await once(child, "exit");
  if (code !== 0) {
    throw new Error(`Astro build exited with code ${code}`);
  }
}

function startPreview(outputDirectory, port) {
  return spawn(
    "mise",
    [
      "exec",
      "--",
      "pnpm",
      "exec",
      "astro",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      `${port}`,
      "--out-dir",
      outputDirectory,
      "--ignore-lock",
    ],
    {
      cwd: projectRoot,
      env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: "1" },
      stdio: "inherit",
    },
  );
}

async function getAvailablePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Could not allocate a preview port");
  }
  const closed = once(server, "close");
  server.close();
  await closed;
  return address.port;
}

async function waitForPage(url, preview) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (preview.exitCode !== null) {
      throw new Error(`Astro preview exited with code ${preview.exitCode}`);
    }
    try {
      const response = await globalThis.fetch(url);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
  }
  throw new Error("Timed out waiting for the Open Graph preview");
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

async function generateOpenGraphImage(outputPath, outputDirectory) {
  let pageCreated = false;
  try {
    await copyFile(ogTemplatePath, ogPagePath, constants.COPYFILE_EXCL);
    pageCreated = true;
    await buildOpenGraphPage(outputDirectory);
  } finally {
    if (pageCreated) await rm(ogPagePath);
  }

  const port = await getAvailablePort();
  const url = `http://127.0.0.1:${port}/og`;
  const preview = startPreview(outputDirectory, port);
  let browser;
  try {
    await waitForPage(url, preview);
    browser = await chromium.launch();
    const page = await browser.newPage({
      colorScheme: "dark",
      deviceScaleFactor: 1,
      viewport: { width: 1200, height: 630 },
    });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => globalThis.document.fonts.ready);
    await page.screenshot({ path: outputPath });
  } finally {
    await browser?.close();
    if (preview.exitCode === null) {
      const exited = once(preview, "exit");
      preview.kill("SIGTERM");
      await exited;
    }
  }
}

const temporaryDirectory = await mkdtemp(join(tmpdir(), "portfolio-assets-"));
try {
  const faviconPath = join(temporaryDirectory, "favicon.png");
  const appleTouchIconPath = join(temporaryDirectory, "apple-touch-icon.png");
  const ogImagePath = join(temporaryDirectory, "og.png");
  const buildDirectory = join(temporaryDirectory, "dist");

  await Promise.all([
    generateDisc(64, faviconPath),
    generateDisc(180, appleTouchIconPath),
  ]);
  await generateOpenGraphImage(ogImagePath, buildDirectory);
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
