// Generates an original upbeat track from code, so there are no licensing concerns.
import { writeFileSync } from "node:fs";

const SR = 44100;
const DURATION = 60;
const BPM = 116;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const N = Math.floor(SR * DURATION);
const L = new Float32Array(N);
const R = new Float32Array(N);

const midi = (m: number) => 440 * 2 ** ((m - 69) / 12);

function add(start: number, dur: number, pan: number, gain: number, fn: (t: number) => number) {
    const s = Math.floor(start * SR);
    const e = Math.min(N, s + Math.floor(dur * SR));
    const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
    const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
    for (let i = Math.max(0, s); i < e; i++) {
        const v = fn((i - s) / SR);
        L[i] += v * gl;
        R[i] += v * gr;
    }
}

const pluck = (f: number) => (t: number) =>
    Math.exp(-t * 7) *
    (Math.sin(2 * Math.PI * f * t) +
        0.35 * Math.sin(4 * Math.PI * f * t) * Math.exp(-t * 9) +
        0.12 * Math.sin(6 * Math.PI * f * t) * Math.exp(-t * 14));

const pad = (f: number, dur: number) => (t: number) => {
    const env = Math.min(1, t / 0.5) * Math.min(1, (dur - t) / 0.5);
    return env * (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.003 * t));
};

const bass = (f: number) => (t: number) =>
    Math.exp(-t * 2.2) * Math.min(1, t * 200) * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t));

const kick = (t: number) => Math.exp(-t * 16) * Math.sin(2 * Math.PI * (48 * t + (70 / 30) * (1 - Math.exp(-t * 30))));

let seed = 7;
const noise = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 2147483648 - 1;
};
let hp = 0;
const hat = (t: number) => {
    const n = noise();
    const v = n - hp;
    hp = n * 0.9;
    return Math.exp(-t * 55) * v;
};
const clap = (t: number) => Math.exp(-t * 22) * noise();

// C, G, Am, F, with an Em for a little lift in the second pass
const PROGRESSIONS = [
    [[48, 60, 64, 67], [43, 59, 62, 67], [45, 60, 64, 69], [41, 60, 65, 69]],
    [[48, 60, 64, 67], [40, 59, 64, 67], [45, 60, 64, 69], [43, 59, 62, 67]],
];
// Bright melody on the pentatonic scale: [beat in the two-bar phrase, MIDI note, beats held]
const HOOK: [number, number, number][] = [
    [0, 76, 1], [1, 79, 0.5], [1.5, 81, 0.5], [2.5, 79, 1], [4, 76, 0.5], [4.5, 74, 0.5], [5, 72, 1], [6.5, 74, 1],
];

const bars = Math.ceil(DURATION / BAR);
const END = 56.5; // Drums and melody stop here; the last chord rings out
for (let b = 0; b < bars; b++) {
    const start = b * BAR;
    if (start >= END) break;
    const prog = PROGRESSIONS[Math.floor(b / 8) % 2];
    const [root, ...notes] = prog[b % 4];
    const intro = start < 4;

    for (const n of notes) add(start, BAR + 0.3, 0, 0.055, pad(midi(n), BAR + 0.3));

    // Arpeggio in eighth notes
    const pattern = [0, 1, 2, 1, 0, 2, 1, 2];
    pattern.forEach((p, i) => {
        add(start + (i * BEAT) / 2, 0.8, i % 2 ? 0.35 : -0.35, 0.1, pluck(midi(notes[p] + 12)));
    });

    if (intro) continue;

    // Bass, kick, clap, hats
    [0, 1.5, 2, 3.5].forEach((beat, i) => {
        add(start + beat * BEAT, 0.5, 0, i % 2 ? 0.14 : 0.2, bass(midi(root)));
    });
    for (let k = 0; k < 4; k++) add(start + k * BEAT, 0.3, 0, 0.32, kick);
    add(start + BEAT, 0.2, 0.1, 0.05, clap);
    add(start + 3 * BEAT, 0.2, -0.1, 0.05, clap);
    for (let h = 0; h < 8; h++) add(start + (h + 0.5) * BEAT * 0.5 + 0, 0.08, h % 2 ? 0.25 : -0.25, h % 4 === 1 ? 0.045 : 0.03, hat);

    // Melody on alternating two-bar phrases, leaving room around the arpeggio
    if (b >= 4 && b % 2 === 0) {
        for (const [beat, note, len] of HOOK) {
            const shift = b % 8 === 6 ? 2 : 0;
            add(start + beat * BEAT, len * BEAT + 0.5, 0.1, 0.075, pluck(midi(note + shift)));
        }
    }
}
// Final chord
for (const n of [48, 60, 64, 67, 72]) add(END, 3.4, 0, 0.09, (t) => Math.exp(-t * 0.9) * Math.sin(2 * Math.PI * midi(n) * t));

// Rising sparkle into the wand's flick, then a bright shimmer as the drums enter
const FLICK = 124 / 30;
const bell = (f: number, decay: number) => (t: number) =>
    Math.exp(-t * decay) * Math.min(1, t * 400) * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 6));
[79, 81, 84, 86, 88, 91, 93, 96, 98, 100].forEach((note, i) => {
    const pan = -0.7 + (i / 9) * 1.2;
    add(FLICK - 0.62 + i * 0.062, 1.2, pan, 0.045 + i * 0.004, bell(midi(note), 5));
});
[84, 88, 91, 96, 100, 103].forEach((note, i) => {
    add(FLICK + i * 0.018, 2.2, i % 2 ? 0.45 : -0.45, 0.05, bell(midi(note), 2.4));
});

// Stereo echo for depth
const delay = Math.floor(BEAT * 0.75 * SR);
for (let i = delay; i < N; i++) {
    L[i] += R[i - delay] * 0.22;
    R[i] += L[i - delay] * 0.22;
}

// Soft limiter, then peak normalise and fade the ends
let peak = 0;
for (let i = 0; i < N; i++) {
    L[i] = Math.tanh(L[i] * 1.5);
    R[i] = Math.tanh(R[i] * 1.5);
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const gain = 0.84 / peak;
let sum = 0;
const pcm = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
    const fade = Math.min(1, i / (SR * 0.4)) * Math.min(1, (N - i) / (SR * 1.5));
    const l = L[i] * gain * fade;
    const r = R[i] * gain * fade;
    sum += l * l + r * r;
    pcm.writeInt16LE(Math.round(l * 32767), i * 4);
    pcm.writeInt16LE(Math.round(r * 32767), i * 4 + 2);
}

const header = Buffer.alloc(44);
header.write("RIFF", 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write("WAVEfmt ", 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(pcm.length, 40);
writeFileSync("public/music.wav", Buffer.concat([header, pcm]));
console.log("peak", (0.84).toFixed(2), "rms dBFS", (10 * Math.log10(sum / (2 * N))).toFixed(1));
