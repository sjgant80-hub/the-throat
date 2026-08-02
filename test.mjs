// test.mjs — PROOF-OF-PLAY for §27+ THE THROAT. Zero tokens. Proves the four powers the throat adds
// to the Seal: ANNOUNCE (heartbeat round-trips), RECOGNIZE (kin/complementary/clash by ear), TRANSMIT
// (reproduction at a distance, exact + tamper-caught), DIAGNOSE (hears its own shadow). All on the ONE encode.
import { seal, announce, hearAnnounce, recognize, transmit, receive, reproduce, diagnose, chordLabel } from './throat.mjs';

let pass = 0, fail = 0;
const ok = (c, m) => { c ? pass++ : fail++; console.log((c ? '  ✓ ' : '  ✗ FAIL ') + m); };

// example Seals from PUBLIC content (no private data) — a "deck" is an array of cards (strings).
// Seals whose CHORDS make the classifier's job honest (spectra printed below so it's not opaque):
// witnessSeal = loud on {witness, gate, wound}                    → chord: verification-heavy
// witnessKin  = same axes as witnessSeal, different words         → kin (cosine ≈ 1)
// broadcast   = loud on {signal, plan, heart, self}               → COMPLEMENTARY to witnessSeal (fills its quiet notes)
// planClashA  = loud on {plan, self, witness}                     → shares witness with witnessSeal
// planClashB  = loud on {plan, self, witness}                     → same → clash (competing on the shared 'witness' loud axis)
const witnessSeal = seal(['verify the proof', 'witness the gate, check the key', 'test · audit · konomify · adversary', 'assert it is reproducible, close the gap, stop the leak']);
const witnessKin  = seal(['proof and verify · audit the witness', 'check the gate, test, konomify', 'assert the wall, stop the fail']);
const broadcast   = seal(['transmit and broadcast the message', 'send the api and mcp sdk over the stream and the mesh',
  'the core engine kernel and vault remember the state', 'build the spec, design the scaffold, wire the plan',
  'own the seed, sign the sovereign identity, mint the fork']);
// A real clash: both LOUD on 'plan' + one other axis, but the OTHER axes differ enough that they aren't
// broadly kin — they collide on 'plan' without blending. (Contrived by design — chosen to break the
// classifier's kin-branch: not similar, not filling each other, but competing for a shared loud note.)
const planClashA  = seal(['build build build build the spec and design the scaffold, wire the plan roadmap',
  'signal signal signal · transmit and broadcast the message over the mesh api mcp sdk',
  'signal signal signal · route the stream, publish, send']);
const planClashB  = seal(['build build build the spec, design the scaffold, wire the plan structure',
  'gate the access, key the lock, allow, admit — the toll opens', 'gate gate gate · redress at the toll · key the lock again']);

console.log('=== POWER 1 · ANNOUNCE — the Seal speaks its signature as a chord, recovered by ear on every rung ===');
for (const rung of ['sound', 'radio', 'light']) {
  const a = announce(witnessSeal, rung);
  const heard = hearAnnounce(a.carried, rung);
  ok(heard.ok && heard.n === witnessSeal.sig.lo, `announce on ${rung.padEnd(5)} → recovered signature 0x${(heard.n>>>0).toString(16).padStart(8,'0')} ${heard.n === witnessSeal.sig.lo ? '✓' : '✗'}`);
}
console.log(`    witness-Seal chord: ${chordLabel(witnessSeal.chord)}  ·  sig ${witnessSeal.sig.hex}`);

console.log('\n=== POWER 2 · RECOGNIZE — two Seals know kin / complementary / clash BY EAR (no lookup) ===');
{
  console.log(`    witness chord:  ${witnessSeal.chordLabel}`);
  console.log(`    kin chord:      ${witnessKin.chordLabel}`);
  console.log(`    broadcast chord:${broadcast.chordLabel}`);
  console.log(`    clashA chord:   ${planClashA.chordLabel}`);
  console.log(`    clashB chord:   ${planClashB.chordLabel}`);
  const kin = recognize(witnessSeal, witnessKin);
  ok(kin.verdict === 'kin', `two witness-Seals hear KIN (cosine ${kin.kinship})`);
  const comp = recognize(witnessSeal, broadcast);
  ok(comp.verdict === 'complementary', `witness-Seal + broadcast-Seal hear COMPLEMENTARY (fill ${comp.complement}, cosine ${comp.kinship}) — "that one completes me"`);
  const clash = recognize(planClashA, planClashB);
  ok(clash.verdict === 'clash', `two Seals sharing loud axes hear CLASH (overlap-loud ${clash.overlapLoud}, fill ${clash.complement})`);
  // recognition is symmetric (hearing is mutual)
  const ab = recognize(witnessSeal, broadcast), ba = recognize(broadcast, witnessSeal);
  ok(ab.verdict === ba.verdict && ab.kinship === ba.kinship && ab.complement === ba.complement, 'recognition is symmetric (B hears A the same way A hears B)');
}

console.log('\n=== POWER 3 · TRANSMIT — the deck rides the ladder, re-folds far-side, verified (reproduction at a distance) ===');
{
  for (const s of [witnessSeal, broadcast, seal(['a']), seal(['the-toll is a proof-of-work edge wall', 'it forces execution not storage'])]) {
    const r = reproduce(s);
    ok(r.ok, `Seal (${s.text.length} bytes) transmitted → re-folded far-side, signature MATCHES exact (${r.sig.slice(0,8)}…)`);
  }
  // TEETH: tamper one frame → the far-side re-fold must NOT match (content-address caught it)
  const t = transmit(witnessSeal);
  t.frames[2] = t.frames[2].slice(); t.frames[2][4] = (t.frames[2][4] + 1) & 0xf;   // corrupt a data nibble
  const tampered = receive(t.frames);
  ok(!tampered.ok || tampered.seal.sig.hex !== witnessSeal.sig.hex, 'a TAMPERED frame fails to re-fold the original (checksum + content-address have teeth)');

  // FUZZ: many random decks round-trip exact and never throw
  let n = 3000, good = 0, threw = false, seed = 0x2545f491 >>> 0;
  const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return seed >>> 0; };
  try {
    for (let i = 0; i < n; i++) {
      const len = rnd() % 40;
      const deck = Array.from({ length: 1 + (rnd() % 3) }, () => String.fromCharCode(...Array.from({ length: len }, () => 32 + (rnd() % 94))));
      if (reproduce(seal(deck)).ok) good++;
    }
  } catch (e) { threw = true; console.log('    threw:', e.message); }
  ok(good === n && !threw, `${good}/${n} random Seals reproduce exact at a distance, zero throws (pure)`);
}

console.log('\n=== POWER 4 · DIAGNOSE — a Seal HEARS its own coherence (the shadow = weakest axis → therapy) ===');
{
  const whole = seal([
    'build the spec and wire it', 'verify the proof, test, konomify, audit', 'transmit it over the mesh',
    'the memory core holds the deck', 'open the gate with the key', 'sign it sovereign, own the seed', 'fix the broken risk',
  ]);
  const dWhole = diagnose(whole);
  ok(dWhole.resolves, `a whole Seal RESOLVES — every axis present (shadow "${dWhole.shadow}" @ ${dWhole.shadowAmp}, top ${dWhole.top})`);

  const sick = seal(['build build build the spec', 'scaffold and wire the structure', 'plan the design roadmap']);   // all plan, no witness
  const dSick = diagnose(sick);
  ok(!dSick.resolves, 'a sick Seal does NOT resolve (it sounds wrong)');
  ok(dSick.flags.some(f => /witness/.test(f)), `it hears its own shadow and names the therapy: "${dSick.flags.find(f=>/witness/.test(f)) || dSick.flags[0]}"`);
}

console.log('\n=== DETERMINISM — same deck, same Seal, forever ===');
ok(seal(['the-toll']).sig.hex === seal(['the-toll']).sig.hex && JSON.stringify(seal(['x']).chord) === JSON.stringify(seal(['x']).chord), 'seal(deck) is stable (content-addressed)');

console.log('\n' + (fail === 0
  ? `=== ✅ THE THROAT HOLDS — the Seal announces, recognizes, reproduces at a distance, hears itself · ${pass}/${pass} · zero tokens ===`
  : `=== ✗ ${fail} FAILED (${pass} passed) ===`));
process.exit(fail === 0 ? 0 : 1);
