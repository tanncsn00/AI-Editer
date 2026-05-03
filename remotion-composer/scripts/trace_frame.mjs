/**
 * trace_frame.mjs v2 — much simpler: use multi-level thresholds to get
 * 3 tonal layers (shadow/midtone/highlight), trace each, dump JSON.
 * Plus an "edge" layer via gradient magnitude for expressive line work.
 */

import fs from "fs";
import sharp from "sharp";
import potrace from "potrace";

const potraceTrace = (buf, opts) =>
  new Promise((resolve, reject) => {
    potrace.trace(buf, opts, (err, svg) => {
      if (err) return reject(err);
      const paths = [];
      const re = /<path[^>]*\sd="([^"]+)"/g;
      let m;
      while ((m = re.exec(svg)) !== null) paths.push(m[1]);
      resolve(paths);
    });
  });

async function main() {
  const [, , inputPath, outPath] = process.argv;
  if (!inputPath || !outPath) {
    console.error("usage: node trace_frame.mjs <input.png> <out.json>");
    process.exit(1);
  }

  const targetW = 1080;
  const meta = await sharp(inputPath).metadata();
  const scale = targetW / meta.width;
  const targetH = Math.round(meta.height * scale);

  const gray = await sharp(inputPath)
    .resize(targetW, targetH)
    .grayscale()
    .normalise()
    .blur(0.8)
    .toBuffer();

  // Tonal layers: mask = black where luminance falls in a range
  const tones = [
    { name: "shadow",   lo: 0,   hi: 70,  fill: "#D8C8A8" }, // darkest → base "shadow" shape
    { name: "midtone",  lo: 70,  hi: 140, fill: "#EDE0C0" },
    { name: "highlight", lo: 140, hi: 205, fill: "#F8F1D8" },
  ];

  const layers = [];
  for (const t of tones) {
    // Build mask where gray in [lo, hi]
    const rawGray = await sharp(inputPath)
      .resize(targetW, targetH)
      .grayscale()
      .normalise()
      .blur(0.8)
      .raw()
      .toBuffer();
    const mask = Buffer.alloc(rawGray.length);
    for (let i = 0; i < rawGray.length; i++) {
      mask[i] = rawGray[i] >= t.lo && rawGray[i] < t.hi ? 0 : 255;
    }
    const maskPng = await sharp(mask, { raw: { width: targetW, height: targetH, channels: 1 } })
      .median(3)
      .threshold(128)
      .png()
      .toBuffer();
    const paths = await potraceTrace(maskPng, {
      turdSize: 150,
      alphaMax: 1.0,
      optCurve: true,
      optTolerance: 0.5,
      threshold: 128,
      blackOnWhite: true,
    });
    if (paths.length) layers.push({ name: t.name, fill: t.fill, paths });
    console.log(`  tone ${t.name} [${t.lo}..${t.hi}]: ${paths.length} paths`);
  }

  // Edge outline via Sobel-like: blur difference
  const blurred = await sharp(inputPath)
    .resize(targetW, targetH)
    .grayscale()
    .blur(3)
    .raw()
    .toBuffer();
  const sharp1 = await sharp(inputPath)
    .resize(targetW, targetH)
    .grayscale()
    .raw()
    .toBuffer();
  const edgeBuf = Buffer.alloc(sharp1.length);
  for (let i = 0; i < sharp1.length; i++) {
    const d = Math.abs(sharp1[i] - blurred[i]);
    edgeBuf[i] = d > 12 ? 0 : 255;
  }
  const edgePng = await sharp(edgeBuf, { raw: { width: targetW, height: targetH, channels: 1 } })
    .median(3)
    .threshold(128)
    .png()
    .toBuffer();
  const edgePaths = await potraceTrace(edgePng, {
    turdSize: 50,
    alphaMax: 1.0,
    optCurve: true,
    optTolerance: 0.3,
    threshold: 128,
    blackOnWhite: true,
  });
  console.log(`  edges: ${edgePaths.length} paths`);

  const out = {
    width: targetW,
    height: targetH,
    layers,
    outline: edgePaths,
  };
  fs.writeFileSync(outPath, JSON.stringify(out));
  console.log(`wrote ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
