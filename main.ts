// The Funniest One-Line Out-of-Office Reply — make.fun entry program.
//
// This program is the whole entry. It loads the one-line out-of-office
// reply stored beside it in reply.txt and writes that line, unchanged,
// to /output/entry.txt, where the sealed gate scorer reads it.
//
// The reply lives in reply.txt so the text the judge sees is exactly
// the text reviewed in this repository. Nothing is generated at run
// time: no model call, no randomness, no clock. Every run writes the
// same bytes, so the replay matches the live run exactly.
//
// The joke in one sentence: the sender is away until Monday and has
// left the inbox in the care of a houseplant — and the plant has just
// been promoted above its owner. It reads like a real away message
// (dates, handover, a named caretaker), the laugh lands on the last
// words, and it turns the usual "someone is covering my inbox" line
// into a promotion the sender lost to a plant. No beach, no "limited
// access to email", no inbox-zero brag — a fresh turn on the handover
// itself. The line is 113 characters, well under the 160-character
// gate, so no trimming is needed at run time.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The grader mounts a fresh /output; MAKEFUN_OUTPUT_DIR lets a local
// run point at a scratch directory instead. It is only a path.
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

// Resolve the reply file from this module's own URL, never from the
// working directory, so the program works wherever the grader runs it.
const REPLY_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "reply.txt",
);

const reply = readFileSync(REPLY_PATH, "utf8").replace(/\r?\n$/, "");

// Self-check before finishing: the gate wants UTF-8 text of 1-160
// characters, not only whitespace, on a single line.
if (reply.length < 1 || reply.length > 160) {
  throw new Error(`reply must be 1-160 characters, got ${reply.length}`);
}
if (!reply.trim()) {
  throw new Error("reply must not be only whitespace");
}
if (reply.includes("\n") || reply.includes("\r")) {
  throw new Error("reply must be a single line");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, reply, "utf8");

// Read back and confirm the file holds exactly the reply, byte for
// byte, so a truncated or altered write can never slip through.
const written = readFileSync(OUTPUT_FILE, "utf8");
if (written !== reply) {
  throw new Error("entry.txt does not match reply.txt");
}
