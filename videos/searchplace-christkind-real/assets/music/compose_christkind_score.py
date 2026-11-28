"""Original score + sound design for "Das Christkind sucht eine Wohnung" (32 s).

Everything is synthesised here (no samples), so the track is original and free to use.
Music follows the story:
  0.0– 3.5  the problem    : A minor, music box + soft pad (Am  Fmaj7)
  3.5–19.45 the idea/search: C major, celesta arps, pizzicato bass, sleigh bells (C Am F G …)
 19.45–24.5 the dream home : fuller, harp-like arps (F G Em Am)
 24.5–32.0 the end card    : F G -> resolves on C when the logo lands (28.6), bell + tail
Sound effects sit on the visible actions (typing keys, phone buzz, pops, whooshes, wind, heart).

Usage: python3 compose_christkind_score.py OUT.wav
"""
import sys
import wave

import numpy as np

SR = 48000
DUR = 32.0
N = int(SR * DUR)
rng = np.random.default_rng(20261202)  # fixed seed: same file every run
BEAT = 0.6  # 100 BPM

L = np.zeros(N)
R = np.zeros(N)
LD = np.zeros(N)  # dry (no reverb) bus
RD = np.zeros(N)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(sig, start, pan=0.0, gain=1.0, wet=True):
    i0 = int(round(start * SR))
    if i0 >= N or i0 < 0:
        return
    sig = sig[: N - i0]
    gl = np.cos((pan + 1) * np.pi / 4) * gain
    gr = np.sin((pan + 1) * np.pi / 4) * gain
    if wet:
        L[i0 : i0 + len(sig)] += sig * gl
        R[i0 : i0 + len(sig)] += sig * gr
    else:
        LD[i0 : i0 + len(sig)] += sig * gl
        RD[i0 : i0 + len(sig)] += sig * gr


def env_ar(n, a, r):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na) ** 1.5
    e[-nr:] *= np.linspace(1, 0, nr) ** 1.5
    return e


def onepole_lp(x, cut):
    """One-pole low-pass with a per-sample cutoff array (or scalar)."""
    cut = np.broadcast_to(np.asarray(cut, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cut / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


# ------------------------------------------------------------------ instruments
def celesta(freq, vel=1.0, dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.65)
    s += 0.42 * np.sin(2 * np.pi * freq * 2.0 * t) * np.exp(-t / 0.32)
    s += 0.18 * np.sin(2 * np.pi * freq * 3.01 * t) * np.exp(-t / 0.18)
    s += 0.06 * np.sin(2 * np.pi * freq * 4.2 * t) * np.exp(-t / 0.08)
    s[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
    return s * vel


def musicbox(freq, vel=1.0):
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.9)
    s += 0.3 * np.sin(2 * np.pi * freq * 3.0 * t) * np.exp(-t / 0.25)
    s += 0.12 * np.sin(2 * np.pi * freq * 5.2 * t) * np.exp(-t / 0.1)
    s[: int(0.0015 * SR)] *= np.linspace(0, 1, int(0.0015 * SR))
    return s * vel


def bell(freq, dur=3.0, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for ratio, amp, tau in ((1, 1.0, 1.5), (2.0, 0.4, 0.9), (2.76, 0.25, 0.6), (5.4, 0.1, 0.3), (8.9, 0.04, 0.15)):
        s += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t / tau)
    s[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
    return s * vel


def pizz(freq, vel=1.0):
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t / 0.08)
    return s * np.exp(-t / 0.22) * vel


def pad_voice(freq, n, det):
    f = freq * 2 ** (det / 1200)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k in range(1, 7):
        out += np.sin(2 * np.pi * f * k * t + k * 0.7) * (k ** -1.9)
    return out * (0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * t + freq * 0.01))


def jingle(vel=1.0):
    """Sleigh-bell hit: a fresh cluster of short metallic partials each time + a little noise."""
    n = int(0.13 * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for _ in range(8):
        f = rng.uniform(4200, 11500)
        s += rng.uniform(0.4, 1.0) * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * np.exp(-t / rng.uniform(0.012, 0.045))
    nz = rng.standard_normal(n)
    s += 0.35 * np.diff(np.concatenate([[0], nz])) * np.exp(-t / 0.015)
    return s * vel * 0.13


# ------------------------------------------------------------------ sound effects
def pop(f0=420, f1=980, dur=0.09, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur) ** 0.6
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / (dur * 0.45)) * vel


def keyclick(vel=1.0):
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    hp = np.diff(np.concatenate([[0], nz]))
    body = np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.004)
    return (hp * 0.5 + body * 0.6) * np.exp(-t / 0.007) * vel


def thud(vel=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 60 + 90 * np.exp(-t / 0.03)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.1)
    nz = onepole_lp(rng.standard_normal(n), 900.0) * np.exp(-t / 0.03)
    return (s + 0.8 * nz) * vel


def whoosh(length=0.8, tail=0.3, top=6000.0, vel=1.0):
    n = int((length + tail) * SR)
    tt = np.arange(n) / SR
    cut = np.where(tt < length, 250 + top * (np.minimum(tt, length) / length) ** 2, top * np.exp(-(tt - length) / 0.1))
    s = onepole_lp(rng.standard_normal(n), cut)
    env = np.where(tt < length, (tt / length) ** 2.2, np.exp(-(tt - length) / 0.1))
    return s * env * vel


def swish(dur=0.35, vel=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    cut = 1200 + 5000 * np.sin(np.pi * tt / dur)
    s = onepole_lp(rng.standard_normal(n), cut)
    return s * np.sin(np.pi * tt / dur) ** 2 * vel


def buzz(dur=0.36, vel=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * 165 * t)) * 0.6 + np.sin(2 * np.pi * 330 * t) * 0.4
    s = onepole_lp(s, 1400.0)
    am = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * 11 * t))
    return s * am * env_ar(n, 0.01, 0.05) * vel


def paper(dur=0.5, vel=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    s = rng.standard_normal(n)
    s = np.diff(np.concatenate([[0], s]))
    s = onepole_lp(s, 5000.0)
    am = 0.4 + 0.6 * np.abs(np.sin(2 * np.pi * 9 * tt))
    return s * am * np.sin(np.pi * tt / dur) * vel


def wind(dur=1.6, vel=1.0):
    n = int(dur * SR)
    tt = np.arange(n) / SR
    cut = 500 + 900 * (0.5 + 0.5 * np.sin(2 * np.pi * 1.3 * tt))
    s = onepole_lp(rng.standard_normal(n), cut)
    s += 0.25 * np.sin(2 * np.pi * (700 + 220 * np.sin(2 * np.pi * 0.9 * tt)) * tt) * 0.3
    return s * env_ar(n, 0.35, 0.5) * vel


def sparkle_run(base=84, notes=6, step=0.045, vel=1.0):
    out = np.zeros(int((notes * step + 1.4) * SR))
    scale = [0, 4, 7, 12, 16, 19, 24, 28]
    for k in range(notes):
        s = bell(mtof(base + scale[k % len(scale)]), dur=1.2, vel=vel * (0.9 - k * 0.06))
        i0 = int(k * step * SR)
        out[i0 : i0 + len(s)] += s[: len(out) - i0]
    return out


# ------------------------------------------------------------------ music: chords
SECTIONS = []  # (start, end, root midi, chord tones)
def ch(start, end, bass, tones):
    SECTIONS.append((start, end, bass, tones))


Am, F, C, G, Em, Dm = (45, [57, 60, 64, 69]), (41, [57, 60, 65, 69]), (48, [55, 60, 64, 67]), (43, [55, 59, 62, 67]), (40, [55, 59, 64, 67]), (38, [57, 62, 65, 69])
ch(0.0, 1.8, *Am)
ch(1.8, 3.5, *F)
ch(3.5, 4.7, *C)
ch(4.7, 5.9, *G)
t = 5.9
prog = [C, Am, F, G]
k = 0
while t < 19.45 - 0.01:
    end = min(t + 4 * BEAT, 19.45)
    ch(t, end, *prog[k % 4])
    t = end
    k += 1
for (a, b), chd in zip(((19.45, 20.65), (20.65, 21.85), (21.85, 23.05), (23.05, 24.5)), (F, G, Em, Am)):
    ch(a, b, *chd)
ch(24.5, 26.0, *F)
ch(26.0, 28.6, *G)
ch(28.6, DUR, *C)

# pads (soft, under everything)
for start, end, bass, tones in SECTIONS:
    n = int((end - start + 0.8) * SR)
    e = env_ar(n, 0.4, 0.8)
    lvl = 0.75 if start < 3.5 else (1.0 if start < 19.45 else 1.15)
    for m in tones:
        add(pad_voice(mtof(m), n, -6) * e, start, pan=-0.5, gain=0.012 * lvl)
        add(pad_voice(mtof(m), n, +6) * e, start, pan=0.5, gain=0.012 * lvl)

# bass: long notes in the intro, pizzicato pulse later
for start, end, bass, tones in SECTIONS:
    if start < 3.5:
        n = int((end - start + 0.5) * SR)
        tb = np.arange(n) / SR
        b = np.sin(2 * np.pi * mtof(bass) * tb) * env_ar(n, 0.2, 0.5)
        add(b, start, gain=0.07, wet=False)
    else:
        tt = start
        j = 0
        while tt < end - 0.01:
            m = bass if j % 2 == 0 else bass + 7
            add(pizz(mtof(m), 1.0 if j % 4 == 0 else 0.75), tt, pan=-0.1, gain=0.12 if start < 24.5 else 0.09, wet=False)
            tt += BEAT
            j += 1

# intro: a sad music-box line (A minor), slow
for tt, m in ((0.15, 76), (0.75, 72), (1.35, 69), (1.95, 77), (2.55, 76), (3.15, 72)):
    add(musicbox(mtof(m), 0.8), tt, pan=0.15, gain=0.07)

# idea + search: celesta arpeggios on eighths
PAT = [0, 2, 1, 3, 2, 1, 3, 2]
for start, end, bass, tones in SECTIONS:
    if start < 3.5 or start >= 24.5:
        continue
    tt = start
    j = 0
    up = 12 if start >= 19.45 else 12
    while tt < end - 0.01:
        m = tones[PAT[j % 8] % 4] + up
        vel = 0.85 if j % 2 == 0 else 0.6
        if start >= 19.45:
            vel *= 1.1
        add(celesta(mtof(m), vel), tt, pan=-0.3 if j % 2 else 0.3, gain=0.05)
        tt += BEAT / 2
        j += 1

# dream home: harp-like up-sweeps at each chord change
for start, end, bass, tones in SECTIONS:
    if 19.45 <= start < 24.5:
        for k, m in enumerate(tones + [x + 12 for x in tones]):
            add(celesta(mtof(m + 12), 0.55), start + k * 0.05, pan=-0.6 + k * 0.15, gain=0.04)

# end card: sparse bells
for tt, m in ((24.85, 81), (25.45, 79), (26.0, 84), (26.9, 83), (27.5, 79)):
    add(bell(mtof(m), 2.0, 0.7), tt, pan=0.2, gain=0.035)

# sleigh bells: from the idea (3.5) to the end card, eighths with accents
tt = 3.5
j = 0
while tt < 28.4:
    lvl = 1.0 if j % 4 == 0 else 0.55
    if 24.5 <= tt < 28.4:
        lvl *= 0.55
    add(jingle(lvl), tt, pan=0.35 if j % 2 else 0.15, gain=0.45)
    tt += BEAT / 2
    j += 1

# ------------------------------------------------------------------ sound design on the picture
SFX = []
def sfx(sig, t, pan=0.0, gain=1.0, wet=True):
    add(sig, t, pan=pan, gain=gain, wet=wet)

# 1 · attic
sfx(pop(300, 700, 0.12), 0.16, gain=0.05)                       # title card lands
sfx(pop(220, 160, 0.16), 1.02, gain=0.06)                       # "viel zu klein" bonk
sfx(thud(0.5), 1.17, gain=0.10, wet=False)                      # squeeze
for k, t0 in enumerate((0.35, 0.9, 1.45, 2.0)):
    sfx(paper(0.6), t0 + 0.4, pan=-0.4 + k * 0.25, gain=0.035)  # letters flutter down
sfx(swish(0.4), 1.8, pan=0.4, gain=0.05)                        # present tips over
sfx(thud(1.0), 2.3, pan=0.25, gain=0.16, wet=False)             # … and lands
sfx(thud(0.5), 2.56, pan=0.25, gain=0.07, wet=False)
sfx(bell(mtof(88), 0.8, 0.5), 1.95, pan=0.3, gain=0.02)         # tear
sfx(bell(mtof(84), 1.6, 1.0), 3.08, pan=0.2, gain=0.06)         # notification ding
sfx(bell(mtof(91), 1.4, 0.8), 3.16, pan=0.2, gain=0.035)
sfx(buzz(0.36), 3.42, pan=0.2, gain=0.05, wet=False)            # bzzz
sfx(sparkle_run(79, 7, 0.05, 0.8), 3.5, pan=-0.2, gain=0.04)    # the idea
sfx(pop(500, 1200, 0.1), 3.78, gain=0.05)                       # speech bubble
sfx(whoosh(0.9, 0.3, 7000.0), 5.0, gain=0.12)                   # dive into the phone

# 2 · phone
for k, t0 in enumerate((5.9, 6.05, 6.12, 6.22, 6.36)):
    sfx(pop(700, 1300, 0.05, 0.6), t0, pan=0.1 * k, gain=0.035)
tt = 6.62
TXT = "eine große Wohnung mit Kamin, hohen Decken für meine Flügel und viel Platz für Geschenke"
for i, c in enumerate(TXT):
    sfx(keyclick(0.7 + 0.3 * ((i * 5) % 3) / 2), tt, pan=0.1, gain=0.05, wet=False)
    tt += 0.015 + (0.015 if c == " " else 0) + (0.08 if c == "," else 0) + ((i * 7) % 5) * 0.003
sfx(swish(0.5), 6.8, pan=0.5, gain=0.04)                        # corner angel flies in
sfx(pop(500, 1200, 0.1), 7.22, pan=0.3, gain=0.05)               # bubble
sfx(keyclick(1.4), 9.45, gain=0.09, wet=False)                  # LOS tap
sfx(pop(600, 300, 0.14), 9.5, gain=0.05)                         # ripple
sfx(swish(0.35), 9.75, gain=0.04)                                # collapse

# 3 · scanning
n = int(1.4 * SR)
tt_ = np.arange(n) / SR
scan = 0.5 * np.sin(2 * np.pi * (500 + 900 * tt_ / 1.4) * tt_) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * tt_))
sfx(scan * env_ar(n, 0.15, 0.25), 10.0, gain=0.012)
for k in range(14):
    sfx(keyclick(0.5), 10.05 + k * 0.075, pan=-0.2, gain=0.03, wet=False)  # odometer ticks
for k, t0 in enumerate((10.5, 10.8, 11.05)):
    sfx(bell(mtof(88 + 3 * k), 0.9, 0.8), t0, pan=-0.3 + 0.3 * k, gain=0.03)

# 4 · results
for k in range(3):
    sfx(swish(0.3), 11.62 + k * 0.13, pan=-0.2 + 0.2 * k, gain=0.035)
    sfx(pop(650, 1250, 0.06, 0.7), 12.0 + k * 0.1, gain=0.03)
sfx(pop(400, 900, 0.12), 12.17, pan=0.3, gain=0.05)              # "Ooh …"
sfx(swish(0.6), 13.5, gain=0.045)                                # scroll
sfx(pop(700, 500, 0.12), 14.37, pan=0.3, gain=0.05)              # "Schön, aber …"
sfx(swish(0.6), 15.5, gain=0.045)                                # scroll
sfx(wind(1.6), 15.9, pan=-0.3, gain=0.08)                        # wind on the penthouse
sfx(pop(600, 380, 0.14), 16.27, pan=0.3, gain=0.05)              # "Zu windig …"
sfx(swish(0.7), 17.4, gain=0.05)                                 # scroll back
sfx(pop(500, 1300, 0.12), 18.07, pan=0.3, gain=0.06)             # "DIE ist es!"
sfx(pop(300, 900, 0.1), 18.56, pan=0.2, gain=0.07)               # heart
sfx(sparkle_run(84, 6, 0.04, 0.9), 18.58, pan=0.2, gain=0.04)

# 5 · dream home
sfx(whoosh(0.8, 0.4, 5000.0), 19.2, gain=0.08)                   # card opens up
sfx(sparkle_run(72, 8, 0.06, 0.7), 19.5, pan=-0.2, gain=0.035)
sfx(swish(0.8), 20.25, pan=0.0, gain=0.05)                       # Christkind flies in
for k in range(4):
    sfx(pop(400 + 120 * k, 900 + 200 * k, 0.08), 21.05 + 0.12 * k, pan=0.4, gain=0.04)
    sfx(bell(mtof(84 + [0, 4, 7, 12][k]), 0.9, 0.7), 21.07 + 0.12 * k, pan=0.4, gain=0.022)
sfx(pop(300, 650, 0.12), 21.5, gain=0.04)                        # caption
sfx(whoosh(0.9, 0.3, 6000.0), 24.0, gain=0.1)                    # through the window

# 6 · end card
sfx(bell(mtof(88), 1.6, 0.8), 26.0, pan=0.0, gain=0.035)         # "… warum nicht auch du?"
sfx(swish(0.4), 25.4, pan=-0.5, gain=0.035)                       # small Christkind
for k in range(8):
    sfx(keyclick(0.6), 27.0 + k * 0.08, gain=0.035, wet=False)
sfx(pop(300, 200, 0.12), 27.58, gain=0.05)                        # mic tap
sfx(swish(0.5), 28.1, gain=0.05)                                  # morph
sfx(bell(mtof(72), 3.6, 1.0), 28.6, pan=-0.15, gain=0.07)        # logo lands
sfx(bell(mtof(79), 3.2, 0.8), 28.66, pan=0.2, gain=0.045)
sfx(bell(mtof(84), 3.0, 0.7), 28.72, pan=0.0, gain=0.035)
sfx(pop(500, 1200, 0.1), 29.32, gain=0.05)                        # url pill
sfx(sparkle_run(91, 5, 0.04, 0.6), 29.8, gain=0.025)

# ------------------------------------------------------------------ reverb + master
def fftconv(x, h):
    n = len(x) + len(h) - 1
    nfft = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(h, nfft), nfft)[: len(x)]


ir_len = int(2.4 * SR)
ti = np.arange(ir_len) / SR
decay = np.exp(-ti / 0.5)
pre = int(0.02 * SR)
irL = np.concatenate([np.zeros(pre), rng.standard_normal(ir_len) * decay])[:ir_len]
irR = np.concatenate([np.zeros(pre), rng.standard_normal(ir_len) * decay])[:ir_len]
irL /= np.sqrt(np.sum(irL**2))
irR /= np.sqrt(np.sum(irR**2))
mixL = L * 0.85 + fftconv(L, irL) * 0.4 + LD
mixR = R * 0.85 + fftconv(R, irR) * 0.4 + RD

fade = np.ones(N)
fi = int(0.05 * SR)
fade[:fi] = np.linspace(0, 1, fi)
fo = int(30.6 * SR)
fade[fo:] = np.linspace(1, 0, N - fo) ** 1.4
mixL *= fade
mixR *= fade
peak = max(np.max(np.abs(mixL)), np.max(np.abs(mixR)))
mixL = np.tanh(mixL / peak * 1.3) / np.tanh(1.3) * 0.89
mixR = np.tanh(mixR / peak * 1.3) / np.tanh(1.3) * 0.89

pcm = np.clip(np.stack([mixL, mixR], axis=1) * 32767, -32768, 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", sys.argv[1], f"{DUR}s")
