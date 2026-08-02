// throat.mjs — §27+ · 喉 · THE THROAT. The Seal gains transmission: the ladder wired into the organism.
//
// HONEST SCOPE: the §27 Seal (be / act / verify / remember / reproduce) is the seed's LANGUAGE. The throat
// attaches to the parts that are real code — a Seal's content-address (fold-signature) and its chord (the
// bloom spectrum) — and gives them a voice via the ladder. A "Seal" here = a concrete transmissible bundle:
//   a DECK (content) → a fold-SIGNATURE (content-address) → a CHORD (7-amplitude spectrum).
// The throat is not a bigger Seal; it is the Seal connected to the ladder. Same organism, now with a voice.
//
// Four powers, all on the ONE encode (shared with one-ladder + the room's κ-gate):
//   announce  — signature → chord → sound/radio/light  (sovereign heartbeat: "I am here, this is my κ")
//   recognize — two Seals compare chords BY EAR         (kin / complementary / clash — no lookup)
//   transmit  — the deck rides the ladder, re-folds far-side, verified  (reproduction at a distance)
//   diagnose  — a Seal HEARS its own coherence          (resolves = held · a dead axis = the shadow → therapy)
import { encode, decode, RUNGS, sig as ladderSig } from './ladder.mjs';

export const KAPPA = (Math.sqrt(5) - 1) / 2;

// ── the chord vocabulary: 7 functions on the prime spine (shared with the room's bloom) ──
export const FUNCTIONS = ['wound', 'signal', 'gate', 'heart', 'plan', 'self', 'witness'];
const KEYS = {
  wound:   ['problem', 'pain', 'broken', 'gap', 'fix', 'fail', 'risk', 'leak', 'stop', 'wall', 'shadow'],
  signal:  ['transmit', 'send', 'message', 'broadcast', 'api', 'mcp', 'sdk', 'stream', 'publish', 'route', 'mesh', 'voice', 'speak'],
  gate:    ['access', 'auth', 'permission', 'gate', 'open', 'lock', 'key', 'allow', 'admit', 'toll', 'redress'],
  heart:   ['core', 'engine', 'memory', 'hold', 'state', 'store', 'kernel', 'vault', 'remember', 'deck'],
  plan:    ['build', 'spec', 'plan', 'design', 'scaffold', 'structure', 'roadmap', 'wire', 'fold'],
  self:    ['identity', 'sign', 'signature', 'sovereign', 'own', 'fork', 'private', 'seed', 'seal', 'mint'],
  witness: ['verify', 'test', 'proof', 'prove', 'gate', 'check', 'adversary', 'witness', 'assert', 'konomify', 'audit', 'reproducible'],
};

// ── a wide content-address: two independent 32-bit streams → a 64-bit-ish fold-signature. ──
// (Pure + sync so it runs in Node AND the browser. Production injects SHA-256; the proven properties —
//  exact re-fold + tamper-detect — hold for any hash, so the demo hash is honest for what it proves.)
export function foldHash(deckText) {
  const s = String(deckText ?? '');
  let a = 0x811c9dc5 >>> 0, b = 0x9e3779b9 >>> 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    a = Math.imul(a ^ c, 0x01000193) >>> 0;
    b = Math.imul((b ^ c) >>> 0, 0x85ebca6b) >>> 0; b = ((b << 13) | (b >>> 19)) >>> 0;
  }
  return { lo: a >>> 0, hi: b >>> 0, hex: ((b >>> 0).toString(16).padStart(8, '0') + (a >>> 0).toString(16).padStart(8, '0')) };
}

// text → 7 normalized amplitudes (the chord). Deterministic.
export function chord(deckText) {
  const t = String(deckText ?? '').toLowerCase();
  const raw = FUNCTIONS.map(fn => KEYS[fn].reduce((n, k) => n + (t.includes(k) ? 1 : 0), 0));
  const max = Math.max(1, ...raw);
  return raw.map(v => +(v / max).toFixed(3));
}
export function chordLabel(c) { return FUNCTIONS.map((f, i) => f[0] + c[i].toFixed(1)).join(' '); }

// ── a SEAL: deck (array of "cards" or a string) → { deck, sig, chord } ──
export function seal(deck) {
  const cards = Array.isArray(deck) ? deck : [String(deck ?? '')];
  const text = cards.join('\n');
  const h = foldHash(text);
  return { deck: cards, text, sig: h, chord: chord(text), chordLabel: chordLabel(chord(text)) };
}

// ══ POWER 1 · ANNOUNCE — the Seal speaks its signature as a chord on a rung (the sovereign heartbeat) ══
export function announce(theSeal, rung = 'sound') {
  const pattern = encode(theSeal.sig.lo);            // the 32-bit content-address rides the ladder frame
  const carried = RUNGS[rung].voice(pattern);        // voiced on the chosen rung (sound/radio/light)
  return { rung, pattern, carried, chord: theSeal.chord, hex: theSeal.sig.hex };
}
// a machine hears an announcement and recovers the announcer's signature (for exact recognition).
export function hearAnnounce(carried, rung = 'sound') { return decode(RUNGS[rung].hear(carried)); }

// ══ POWER 2 · RECOGNIZE — two Seals compare chords BY EAR (no lookup) ══
function cosine(a, b) { let d = 0, na = 0, nb = 0; for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; } return (na && nb) ? d / Math.sqrt(na * nb) : 0; }
// Three ways two Seals sound together, from two honest measures:
//   kinship    = cosine of the spectra (how SIMILAR they are)
//   complement = fraction of axes where one is LOUD (≥0.6) and the other QUIET (≤0.2) — a clean fill
//   overlapLoud= axes where BOTH are loud — they compete for the same note (the source of a clash)
// kin (similar) → complementary (fill each other's quiet notes) → clash (collide on a shared note, don't fill) → distant.
export function recognize(A, B) {
  const a = A.chord, b = B.chord;
  const kinship = +cosine(a, b).toFixed(3);
  let fills = 0, overlapLoud = 0;
  for (let i = 0; i < a.length; i++) {
    if ((a[i] >= 0.6 && b[i] <= 0.2) || (b[i] >= 0.6 && a[i] <= 0.2)) fills++;
    if (a[i] >= 0.6 && b[i] >= 0.6) overlapLoud++;
  }
  const complement = +(fills / a.length).toFixed(3);
  let verdict;
  if (kinship >= 0.8) verdict = 'kin';                        // broadly the same spectrum
  else if (complement >= 0.4) verdict = 'complementary';      // loud where the other is quiet → a fuller chord together
  else if (overlapLoud >= 1) verdict = 'clash';              // compete for a shared loud note without blending
  else verdict = 'distant';                                   // neither similar, filling, nor colliding
  return { verdict, kinship, complement, overlapLoud };
}

// ══ POWER 3 · TRANSMIT — the deck rides the ladder, re-folds far-side, verified (reproduction at distance) ══
// deck text → UTF-8 bytes → 32-bit words → ladder frames. receive() reverses + re-folds + verifies the sig.
export function transmit(theSeal) {
  const bytes = Array.from(new TextEncoder().encode(theSeal.text));
  const words = [bytes.length >>> 0];                                    // header word = byte length
  for (let i = 0; i < bytes.length; i += 4) {
    words.push(((bytes[i] << 24) | ((bytes[i + 1] || 0) << 16) | ((bytes[i + 2] || 0) << 8) | (bytes[i + 3] || 0)) >>> 0);
  }
  return { frames: words.map(encode), sig: theSeal.sig };               // each word a checksummed ladder frame
}
export function receive(frames) {
  const words = frames.map(decode);
  if (words.some(w => !w.ok)) return { ok: false, why: 'a frame failed its checksum' };
  const len = words[0].n >>> 0, bytes = [];
  for (let i = 1; i < words.length; i++) { const w = words[i].n >>> 0; bytes.push((w >>> 24) & 255, (w >>> 16) & 255, (w >>> 8) & 255, w & 255); }
  const text = new TextDecoder().decode(new Uint8Array(bytes.slice(0, len)));
  const refolded = seal(text.split('\n'));
  return { ok: true, seal: refolded };
}
// the whole reproduction: A transmits, the far side re-folds, and the signatures must MATCH exactly.
export function reproduce(theSeal) {
  const far = receive(transmit(theSeal).frames);
  return { ok: far.ok && far.seal.sig.hex === theSeal.sig.hex, far: far.seal, sig: theSeal.sig.hex };
}

// ══ POWER 4 · DIAGNOSE — a Seal HEARS its own coherence (the shadow = weakest axis → therapy) ══
export function diagnose(theSeal) {
  const c = theSeal.chord;
  const shadowAmp = Math.min(...c), shadow = FUNCTIONS[c.indexOf(shadowAmp)];
  const sum = c.reduce((s, v) => s + v, 0) || 1, top = +(Math.max(...c) / sum).toFixed(3);
  const flags = [];
  FUNCTIONS.forEach((f, i) => { if (c[i] < 0.12) flags.push(`dead ${f} axis — a missing harmonic; the Seal sounds wrong here (therapy: ${f})`); });
  if (top > 0.5) flags.push('one axis dominates — a single-note Seal, not a whole chord');
  const resolves = shadowAmp >= 0.12 && top <= 0.5;                     // every axis present + balanced = held
  return { resolves, shadow, shadowAmp, top, flags };
}

export default { KAPPA, FUNCTIONS, foldHash, chord, chordLabel, seal, announce, hearAnnounce, recognize, transmit, receive, reproduce, diagnose };
