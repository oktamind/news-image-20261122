// News-image entry for Sunday 22 November 2026 (Node 22, standard library only).
//
// The entry image lives beside this file as entry.png: one front page summing
// up the world's news of 22 November 2026 (35 stories across 6 regions, with
// three illustrated hero leads — the COP31 package going to a Sunday vote in
// Antalya, Iran's missile-and-drone strikes on US positions in Bahrain, and
// the 6.7-magnitude quake in central Peru — plus a world map with numbered
// pins). This program copies those exact bytes to the grader's output
// directory, so both runs write identical bytes.
//
// Local run (Node 22):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// The copy is byte-for-byte: no re-encoding, no timestamps, no randomness,
// so the grader's two runs produce identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const bytes = readFileSync(join(here, "entry.png"));
// Guard: refuse to emit anything that is not a PNG (first 8 bytes are the
// PNG signature). The entry image is a PNG, so this never fires in practice.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error("entry.png is not a PNG file");
}
// Guard: the bounty caps the image at 1024x1024 and 1 MiB. Read the PNG
// IHDR (bytes 16-23: width, height, big-endian uint32) and refuse a file
// that breaks either cap, so a bad image can never be emitted silently.
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}
if (bytes.length > 1024 * 1024) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB cap`);
}
// The output file is always named entry.png and nothing else is written:
// the grader reads exactly that file, so the program writes one file only.
writeFileSync(join(outDir, "entry.png"), bytes);
