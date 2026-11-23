"""Original music bed for the SearchPlace LinkedIn explainer (32.5 s).

Calm, premium corporate ambient in D major, 90 BPM, laid out on the video's scene cuts:
  0.00– 9.35  problem   : minor-coloured pads only (Bm G Em F#sus-F#)
  9.35–20.40  approach  : lift to D, arpeggio + soft pulse (D A Bm G)
 20.40–26.45  beyond    : fuller, dominant build (G A)
 26.45–32.50  close     : resolve on Dadd9, bell on the logo, gentle tail
Transitions get a soft noise whoosh. Everything is synthesised here (no samples),
so the track is original and free to use.

Usage: python3 compose_linkedin_bed.py OUT.wav
"""
import sys
import wave

import numpy as np

SR = 48000
DUR = 32.5
N = int(SR * DUR)
t_all = np.arange(N) / SR
rng = np.random.default_rng(20261123)  # fixed seed: same file every run

CUT1, CUT2, CUT3 = 9.35, 20.40, 26.45
BEAT = 60 / 90


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env_adsr(n, a, r, sr=SR):
    e = np.ones(n)
    na, nr = int(a * sr), int(r * sr)
    if na > 0:
        e[:na] = np.linspace(0, 1, na) ** 1.5
    if nr > 0:
        e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e


L = np.zeros(N)
R = np.zeros(N)
L_dry = np.zeros(N)
R_dry = np.zeros(N)


def add(sig, start, pan=0.0, gain=1.0, wet=True):
    """Mix a mono signal at time `start` with equal-power pan (-1..1)."""
    i0 = int(start * SR)
    if i0 >= N:
        return
    sig = sig[: N - i0]
    gl = np.cos((pan + 1) * np.pi / 4) * gain
    gr = np.sin((pan + 1) * np.pi / 4) * gain
    if wet:
        L[i0 : i0 + len(sig)] += sig * gl
        R[i0 : i0 + len(sig)] += sig * gr
    else:
        L_dry[i0 : i0 + len(sig)] += sig * gl
        R_dry[i0 : i0 + len(sig)] += sig * gr


# ----- chord plan -----
CHORDS = [
    # start, end, bass midi, pad notes, section level
    (0.00, 2.67, 47, [54, 59, 62, 66], 0.75),  # Bm
    (2.67, 5.33, 43, [55, 59, 62, 67], 0.75),  # G
    (5.33, 8.00, 40, [55, 59, 64, 67], 0.78),  # Em
    (8.00, 8.70, 42, [54, 59, 61, 66], 0.82),  # F#sus4
    (8.70, CUT1, 42, [54, 58, 61, 66], 0.85),  # F#
    (CUT1, 12.02, 38, [54, 57, 62, 66], 1.0),  # D
    (12.02, 14.68, 45, [52, 57, 61, 64], 1.0),  # A
    (14.68, 17.35, 47, [54, 59, 62, 66], 1.0),  # Bm
    (17.35, CUT2, 43, [55, 59, 62, 67], 1.0),  # G
    (CUT2, 23.10, 43, [55, 59, 62, 67, 71], 1.08),  # G (fuller)
    (23.10, CUT3, 45, [52, 57, 61, 64, 69], 1.12),  # A (build)
    (CUT3, DUR, 38, [54, 57, 62, 64, 66], 1.0),  # Dadd9 (resolve)
]


def pad_voice(freq, n, detune_cents):
    f = freq * 2 ** (detune_cents / 1200)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k in range(1, 9):  # band-limited soft saw, warm roll-off
        out += np.sin(2 * np.pi * f * k * t + k * 0.7) * (k ** -1.7)
    # slow movement so the pad breathes a little
    out *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.18 * t + freq * 0.01)
    return out


for start, end, bass, notes, lvl in CHORDS:
    dur = end - start + 0.9  # overlap into the next chord
    n = int(dur * SR)
    e = env_adsr(n, 0.55, 0.9)
    for j, m in enumerate(notes):
        f = mtof(m)
        add(pad_voice(f, n, -5) * e, start, pan=-0.55, gain=0.030 * lvl)
        add(pad_voice(f, n, +5) * e, start, pan=+0.55, gain=0.030 * lvl)
    # bass: sine + a touch of 2nd harmonic
    tb = np.arange(n) / SR
    fb = mtof(bass)
    b = np.sin(2 * np.pi * fb * tb) + 0.22 * np.sin(2 * np.pi * 2 * fb * tb)
    bass_gain = 0.10 if start < CUT1 else 0.14
    add(b * env_adsr(n, 0.12, 0.7), start, pan=0.0, gain=bass_gain * lvl, wet=False)


# ----- arpeggio (approach → close) -----
def pluck(freq, vel):
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.32 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t / 0.18)
    s += 0.12 * np.sin(2 * np.pi * 3 * freq * t) * np.exp(-t / 0.09)
    e = np.exp(-t / 0.42)
    e[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    return s * e * vel


def chord_at(t):
    for start, end, bass, notes, lvl in CHORDS:
        if start <= t < end:
            return notes
    return CHORDS[-1][3]


PATTERN = [0, 1, 2, 3, 2, 1, 2, 3]
step = BEAT / 2
k = 0
t = CUT1
while t < DUR - 2.4:
    notes = chord_at(t + 0.01)
    idx = PATTERN[k % len(PATTERN)] % len(notes)
    m = notes[idx] + 12
    if t >= CUT3:  # close: sparser, quarter notes only
        if k % 2 == 1:
            t += step
            k += 1
            continue
        vel = 0.55
    elif t >= CUT2:
        vel = 0.85
    else:
        vel = 0.55 + 0.3 * min(1.0, (t - CUT1) / 2.7)  # fade the arp in over a bar
    vel *= 0.9 + 0.1 * ((k * 7) % 5) / 4  # tiny humanised variation
    pan = -0.35 if k % 2 == 0 else 0.35
    add(pluck(mtof(m), vel), t, pan=pan, gain=0.050)
    t += step
    k += 1


# ----- soft pulse + shaker (approach & beyond only) -----
def soft_kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 45 + 75 * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.12)


def shaker():
    n = int(0.06 * SR)
    noise = rng.standard_normal(n)
    hp = np.diff(np.concatenate([[0], noise]))  # crude high-pass
    t = np.arange(n) / SR
    return hp * np.exp(-t / 0.018)


kick = soft_kick()
b = 0
t = CUT1
while t < CUT3 - 0.05:
    lvl = 0.5 if t < CUT1 + 2.67 else 1.0
    if t >= CUT2:
        lvl = 1.15
    if b % 2 == 0:
        add(kick, t, pan=0.0, gain=0.11 * lvl, wet=False)
    add(shaker(), t + BEAT / 2, pan=0.25, gain=0.016 * lvl, wet=True)
    t += BEAT
    b += 1


# ----- whooshes into each cut -----
def whoosh(length=0.75, tail=0.35):
    n = int((length + tail) * SR)
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    y = 0.0
    for i in range(n):  # one-pole low-pass sweeping open, then closing
        tt = i / SR
        cutoff = 300 + 5200 * (min(tt, length) / length) ** 2 if tt < length else 5500 * np.exp(-(tt - length) / 0.12)
        a = np.exp(-2 * np.pi * cutoff / SR)
        y = (1 - a) * noise[i] + a * y
        out[i] = y
    env = np.concatenate([np.linspace(0, 1, int(length * SR)) ** 2.2, np.exp(-np.arange(n - int(length * SR)) / SR / 0.1)])
    return out * env[:n]


for cut in (CUT1, CUT2, CUT3):
    w = whoosh()
    add(w, cut - 0.75, pan=-0.3, gain=0.10)
    add(whoosh(), cut - 0.75, pan=0.3, gain=0.10)


# ----- bell when the logo lands -----
def bell(freq, dur=3.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for ratio, amp, tau in ((1, 1.0, 1.4), (2.0, 0.35, 0.9), (2.76, 0.22, 0.6), (5.4, 0.08, 0.3)):
        s += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t / tau)
    s[: int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    return s


add(bell(mtof(74)), CUT3 + 0.12, pan=-0.15, gain=0.055)  # D5
add(bell(mtof(81)), CUT3 + 0.20, pan=0.2, gain=0.035)  # A5


# ----- reverb: convolution with a synthetic stereo hall -----
def fftconv(x, h):
    n = len(x) + len(h) - 1
    nfft = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(h, nfft), nfft)[:n]
    return y[: len(x)]


ir_len = int(2.6 * SR)
ti = np.arange(ir_len) / SR
decay = np.exp(-ti / 0.55)
pre = int(0.022 * SR)
irL = np.concatenate([np.zeros(pre), rng.standard_normal(ir_len) * decay])[:ir_len]
irR = np.concatenate([np.zeros(pre), rng.standard_normal(ir_len) * decay])[:ir_len]
irL /= np.sqrt(np.sum(irL**2))
irR /= np.sqrt(np.sum(irR**2))
wetL = fftconv(L, irL)
wetR = fftconv(R, irR)

mixL = L * 0.82 + wetL * 0.42 + L_dry
mixR = R * 0.82 + wetR * 0.42 + R_dry

# ----- master: fades, gentle saturation -----
fade = np.ones(N)
fi = int(0.35 * SR)
fade[:fi] = np.linspace(0, 1, fi) ** 2
fo_start = int(30.2 * SR)
fade[fo_start:] = np.linspace(1, 0, N - fo_start) ** 1.6
mixL *= fade
mixR *= fade
peak = max(np.max(np.abs(mixL)), np.max(np.abs(mixR)))
mixL = np.tanh(mixL / peak * 1.2) / np.tanh(1.2) * 0.89
mixR = np.tanh(mixR / peak * 1.2) / np.tanh(1.2) * 0.89

out = np.stack([mixL, mixR], axis=1)
pcm = np.clip(out * 32767, -32768, 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1], f"{DUR}s")
