/* SearchPlace · Christkind (realistic) — the character rig.
   Two variants share one head: a bust (400 × 440, for the attic and the reaction shots)
   and a full figure (400 × 600, flying). All coordinates are absolute in the variant's
   viewBox so every animated group can be pivoted with svgOrigin in that same space.
   Deterministic: seeded PRNG only. */
(function () {
  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f = (n) => (Math.round(n * 10) / 10).toString();
  // map every "x y" pair of an absolute-command path through (cx, cy, s)
  const tp = (d, cx, cy, s) =>
    d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (m, x, y) => f(cx + +x * s) + " " + f(cy + +y * s));

  function defs(p) {
    return `
  <defs>
    <radialGradient id="${p}-skin" cx="46%" cy="40%" r="62%">
      <stop offset="0" stop-color="#fde6d6"/><stop offset=".55" stop-color="#f6cfb6"/><stop offset="1" stop-color="#e3a98b"/>
    </radialGradient>
    <linearGradient id="${p}-neck" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9997b"/><stop offset=".45" stop-color="#efc2a6"/><stop offset="1" stop-color="#f5cfb7"/>
    </linearGradient>
    <radialGradient id="${p}-hair" cx="50%" cy="35%" r="70%">
      <stop offset="0" stop-color="#f6d58a"/><stop offset=".5" stop-color="#e1ac4f"/><stop offset="1" stop-color="#a86f26"/>
    </radialGradient>
    <linearGradient id="${p}-lock" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#a86d22"/><stop offset=".3" stop-color="#e2ad4f"/><stop offset=".52" stop-color="#fde6a6"/><stop offset=".75" stop-color="#e6b357"/><stop offset="1" stop-color="#9c6420"/>
    </linearGradient>
    <linearGradient id="${p}-lockD" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7d4c17"/><stop offset=".45" stop-color="#c78d39"/><stop offset=".6" stop-color="#e0ad55"/><stop offset="1" stop-color="#77461a"/>
    </linearGradient>
    <linearGradient id="${p}-curl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff0bf"/><stop offset=".35" stop-color="#f0c766"/><stop offset=".75" stop-color="#c98b33"/><stop offset="1" stop-color="#8f5a1c"/>
    </linearGradient>
    <radialGradient id="${p}-iris" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="#a9d4f2"/><stop offset=".45" stop-color="#4f89c4"/><stop offset=".85" stop-color="#26507f"/><stop offset="1" stop-color="#16304f"/>
    </radialGradient>
    <linearGradient id="${p}-sclera" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#dcd6d4"/><stop offset=".4" stop-color="#f8f5f3"/><stop offset="1" stop-color="#f1ecea"/>
    </linearGradient>
    <linearGradient id="${p}-lip" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e58f91"/><stop offset="1" stop-color="#c8636b"/>
    </linearGradient>
    <linearGradient id="${p}-dress" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#e3e6ee"/><stop offset=".3" stop-color="#fbfbfd"/><stop offset=".62" stop-color="#ffffff"/><stop offset="1" stop-color="#d4d9e4"/>
    </linearGradient>
    <linearGradient id="${p}-dressV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe4ee"/>
    </linearGradient>
    <linearGradient id="${p}-gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff1b8"/><stop offset=".4" stop-color="#e8b84a"/><stop offset=".7" stop-color="#b9842a"/><stop offset="1" stop-color="#f4d77d"/>
    </linearGradient>
    <linearGradient id="${p}-feather" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#c6d1de"/><stop offset=".5" stop-color="#f1f5fa"/><stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <linearGradient id="${p}-featherB" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="#a7b5c8"/><stop offset=".55" stop-color="#dfe6f0"/><stop offset="1" stop-color="#fbfcfe"/>
    </linearGradient>
    <radialGradient id="${p}-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff4c4" stop-opacity=".95"/><stop offset=".4" stop-color="#ffd877" stop-opacity=".45"/><stop offset="1" stop-color="#ffcc55" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${p}-blush" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#f08f95" stop-opacity=".55"/><stop offset="1" stop-color="#f08f95" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${p}-tear" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset="1" stop-color="#9fd8ff" stop-opacity=".85"/>
    </linearGradient>
    <filter id="${p}-b1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.2"/></filter>
    <filter id="${p}-b3" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
    <filter id="${p}-b6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>`;
  }

  /* ---------------------------------------------------------------- the head (local units, face centre 0 0) */
  // a tapered, wavy lock of hair as a filled ribbon (absolute coordinates)
  function lockPath(x0, y0, x1, y1, w0, w1, amp, waves, phase) {
    const n = 26, Lp = [], Rp = [], C = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const env = Math.pow(t, 0.7);
      C.push([x0 + (x1 - x0) * t + amp * env * Math.sin(t * waves * Math.PI * 2 + phase), y0 + (y1 - y0) * t]);
    }
    for (let i = 0; i <= n; i++) {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(n, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1];
      const l = Math.hypot(tx, ty) || 1;
      tx /= l; ty /= l;
      const t = i / n;
      const w = (w0 + (w1 - w0) * t) * (i === n ? 0.15 : 1) * (t < 0.12 ? 0.4 + 5 * t : 1) / 2;
      Lp.push([C[i][0] - ty * w, C[i][1] + tx * w]);
      Rp.push([C[i][0] + ty * w, C[i][1] - tx * w]);
    }
    const pts = Lp.concat(Rp.reverse());
    let d = "M" + f(pts[0][0]) + " " + f(pts[0][1]);
    for (let i = 1; i < pts.length; i++) d += " L" + f(pts[i][0]) + " " + f(pts[i][1]);
    let hl = "M" + f(C[2][0]) + " " + f(C[2][1]);
    for (let i = 3; i < n - 3; i++) hl += " L" + f(C[i][0] + 0.18 * (w0 / 2)) + " " + f(C[i][1]);
    return { d: d + " Z", hl };
  }

  function head(p, cx, cy, s, seed) {
    const R = rng(seed || 5);
    const T = (d) => tp(d, cx, cy, s);
    const X = (x) => f(cx + x * s);
    const Y = (y) => f(cy + y * s);
    const S = (v) => f(v * s);
    const lock = (x0, y0, x1, y1, w0, w1, amp, waves, ph, fill, hlOp) => {
      const L = lockPath(cx + x0 * s, cy + y0 * s, cx + x1 * s, cy + y1 * s, w0 * s, w1 * s, amp * s, waves, ph);
      return `<path d="${L.d}" fill="url(#${p}-${fill})"/>` + (hlOp ? `<path d="${L.hl}" stroke="#fff4cc" stroke-width="${S(1.3)}" fill="none" opacity="${hlOp}" stroke-linecap="round"/>` : "");
    };
    // back of the hair: a soft mass behind the face, then long wavy locks to the chest
    let back = `<path d="${T("M-70 -30 C-76 -78 -40 -98 0 -98 C42 -98 78 -78 70 -30 C78 10 84 60 88 124 C62 134 32 116 0 108 C-32 116 -62 134 -88 124 C-84 60 -78 10 -70 -30 Z")}" fill="url(#${p}-lockD)"/>`;
    const backLocks = [
      [-60, -40, -92, 190, 34, 10, 10, 1.6, 0.4], [-48, -20, -70, 210, 30, 8, 9, 1.8, 1.4], [-66, 0, -100, 170, 28, 8, 11, 1.5, 2.2],
      [60, -40, 92, 190, 34, 10, 10, 1.6, 3.4], [48, -20, 70, 210, 30, 8, 9, 1.8, 0.2], [66, 0, 100, 170, 28, 8, 11, 1.5, 1.1],
      [-36, 40, -46, 200, 26, 8, 8, 1.7, 2.8], [36, 40, 46, 200, 26, 8, 8, 1.7, 1.9],
    ];
    backLocks.forEach((l) => (back += lock(...l, "lockD", 0.25)));
    const face = `M0 -66 C38 -66 55 -34 53 4 C51 42 29 74 0 76 C-29 74 -51 42 -53 4 C-55 -34 -38 -66 0 -66 Z`;
    let out = "";
    out += `<path d="${T(face)}" fill="url(#${p}-skin)"/>`;
    // soft modelling
    out += `<path d="${T("M44 -10 C52 20 40 56 8 74 C34 60 50 30 48 -6 Z")}" fill="#d69276" opacity=".45" filter="url(#${p}-b3)"/>`;
    out += `<path d="${T("M-44 -10 C-52 20 -40 56 -8 74 C-34 60 -50 30 -48 -6 Z")}" fill="#d69276" opacity=".3" filter="url(#${p}-b3)"/>`;
    out += `<ellipse cx="${X(0)}" cy="${Y(-44)}" rx="${S(46)}" ry="${S(10)}" fill="#c98466" opacity=".35" filter="url(#${p}-b3)"/>`;
    out += `<ellipse cx="${X(-30)}" cy="${Y(26)}" rx="${S(15)}" ry="${S(9)}" fill="url(#${p}-blush)"/>`;
    out += `<ellipse cx="${X(30)}" cy="${Y(26)}" rx="${S(15)}" ry="${S(9)}" fill="url(#${p}-blush)"/>`;
    out += `<ellipse cx="${X(-6)}" cy="${Y(-14)}" rx="${S(20)}" ry="${S(9)}" fill="#ffffff" opacity=".22" filter="url(#${p}-b3)"/>`;
    out += `<ellipse cx="${X(0)}" cy="${Y(64)}" rx="${S(12)}" ry="${S(5)}" fill="#ffffff" opacity=".18" filter="url(#${p}-b1)"/>`;
    // nose
    out += `<path d="${T("M-3 8 C-6 18 -9 26 -6 31")}" stroke="#c98366" stroke-width="${S(2.2)}" fill="none" opacity=".55" filter="url(#${p}-b1)"/>`;
    out += `<path d="${T("M-7 33 Q0 37 7 33")}" stroke="#b87159" stroke-width="${S(1.6)}" fill="none" opacity=".6" stroke-linecap="round"/>`;
    out += `<ellipse cx="${X(1)}" cy="${Y(27)}" rx="${S(3.2)}" ry="${S(2.4)}" fill="#ffffff" opacity=".45" filter="url(#${p}-b1)"/>`;
    // eyes
    const eye = (ex, side) => {
      const ey = 4;
      const shape = `M${ex - 14} ${ey} C${ex - 8} ${ey - 8.5} ${ex + 8} ${ey - 9.5} ${ex + 14} ${ey - 1} C${ex + 8} ${ey + 6} ${ex - 8} ${ey + 6.5} ${ex - 14} ${ey} Z`;
      const cid = `${p}-eye${side}`;
      let e = `<clipPath id="${cid}"><path d="${T(shape)}"/></clipPath>`;
      e += `<path d="${T(shape)}" fill="url(#${p}-sclera)"/>`;
      e += `<g clip-path="url(#${cid})">`;
      e += `<circle cx="${X(ex + side * 0.6)}" cy="${Y(ey - 0.6)}" r="${S(7.4)}" fill="url(#${p}-iris)"/>`;
      e += `<circle cx="${X(ex + side * 0.6)}" cy="${Y(ey - 0.6)}" r="${S(3.3)}" fill="#0e1218"/>`;
      e += `<path d="${T(`M${ex - 14} ${ey - 10} H${ex + 14} V${ey - 3} C${ex + 4} ${ey - 8} ${ex - 6} ${ey - 7} ${ex - 14} ${ey - 1} Z`)}" fill="#8a6a60" opacity=".35"/>`;
      e += `</g>`;
      e += `<circle cx="${X(ex + side * 0.6 + 2.6)}" cy="${Y(ey - 3.4)}" r="${S(1.9)}" fill="#ffffff"/>`;
      e += `<circle cx="${X(ex + side * 0.6 - 2.4)}" cy="${Y(ey + 1.8)}" r="${S(0.9)}" fill="#ffffff" opacity=".8"/>`;
      e += `<path d="${T(`M${ex - 15} ${ey + 0.6} C${ex - 8} ${ey - 9.8} ${ex + 8} ${ey - 10.8} ${ex + 15.5} ${ey - 1.6}`)}" stroke="#3b2318" stroke-width="${S(2.6)}" fill="none" stroke-linecap="round"/>`;
      const o = side > 0 ? 1 : -1;
      const lx = ex + o * 13, ly = ey - 3;
      e += `<path d="${T(`M${lx} ${ly} L${lx + o * 4} ${ly - 4} M${lx - o * 3} ${ly - 3} L${lx} ${ly - 7.5} M${lx - o * 7} ${ly - 5} L${lx - o * 5} ${ly - 9.5}`)}" stroke="#3b2318" stroke-width="${S(1.4)}" stroke-linecap="round"/>`;
      e += `<path d="${T(`M${ex - 11} ${ey - 8.5} C${ex - 4} ${ey - 13.5} ${ex + 6} ${ey - 13.5} ${ex + 12} ${ey - 7.5}`)}" stroke="#c48a6e" stroke-width="${S(1.2)}" fill="none" opacity=".55"/>`;
      e += `<path d="${T(`M${ex - 12} ${ey + 2.5} C${ex - 5} ${ey + 7} ${ex + 6} ${ey + 7} ${ex + 12} ${ey + 1.5}`)}" stroke="#c9927a" stroke-width="${S(1)}" fill="none" opacity=".5"/>`;
      return e;
    };
    const happyEye = (ex, side) => {
      const ey = 4;
      const o = side > 0 ? 1 : -1;
      let e = `<path d="${T(`M${ex - 13} ${ey + 1} C${ex - 6} ${ey - 6} ${ex + 6} ${ey - 6.5} ${ex + 13} ${ey + 0.5}`)}" stroke="#3b2318" stroke-width="${S(2.6)}" fill="none" stroke-linecap="round"/>`;
      e += `<path d="${T(`M${ex + o * 12} ${ey} L${ex + o * 16} ${ey - 3} M${ex + o * 9} ${ey - 3} L${ex + o * 12} ${ey - 7}`)}" stroke="#3b2318" stroke-width="${S(1.4)}" stroke-linecap="round"/>`;
      e += `<path d="${T(`M${ex - 11} ${ey + 5} C${ex - 4} ${ey + 2} ${ex + 4} ${ey + 2} ${ex + 11} ${ey + 5}`)}" stroke="#d79a80" stroke-width="${S(1.2)}" fill="none" opacity=".6"/>`;
      return e;
    };
    out += `<g id="${p}-eyes">${eye(-22, -1)}${eye(22, 1)}</g>`;
    out += `<g id="${p}-eyesHappy" opacity="0">${happyEye(-22, -1)}${happyEye(22, 1)}</g>`;
    out += `<g id="${p}-browsN"><path d="${T("M-36 -14 C-28 -20 -18 -21 -9 -18 M36 -14 C28 -20 18 -21 9 -18")}" stroke="#b6873f" stroke-width="${S(3.2)}" fill="none" stroke-linecap="round" opacity=".85"/></g>`;
    out += `<g id="${p}-brows" opacity="0"><path d="${T("M-36 -13 C-28 -15 -18 -19 -9 -25 M36 -13 C28 -15 18 -19 9 -25")}" stroke="#b6873f" stroke-width="${S(3.2)}" fill="none" stroke-linecap="round" opacity=".9"/></g>`;
    // mouths (centre 0 47)
    const lipLow = (y0, dy) => `M-10 ${y0} C-5 ${y0 + dy} 5 ${y0 + dy} 10 ${y0} C5 ${y0 + dy * 0.45} -5 ${y0 + dy * 0.45} -10 ${y0} Z`;
    out += `<g id="${p}-mSmile"><path d="${T(lipLow(48, 7))}" fill="url(#${p}-lip)" opacity=".9"/><path d="${T("M-13 45 C-6 51 6 51 13 45")}" stroke="#9b4249" stroke-width="${S(2.3)}" fill="none" stroke-linecap="round"/><path d="${T("M-9 45.5 C-4 43 4 43 9 45.5")}" stroke="#d47c82" stroke-width="${S(2)}" fill="none" opacity=".7"/></g>`;
    out += `<g id="${p}-mSad" opacity="0"><path d="${T(lipLow(50, 6))}" fill="url(#${p}-lip)" opacity=".9"/><path d="${T("M-12 51 C-6 46 6 46 12 51")}" stroke="#9b4249" stroke-width="${S(2.3)}" fill="none" stroke-linecap="round"/></g>`;
    out += `<g id="${p}-mFlat" opacity="0"><path d="${T(lipLow(48.5, 6))}" fill="url(#${p}-lip)" opacity=".9"/><path d="${T("M-11 47 C-4 48.5 4 48.5 11 47")}" stroke="#9b4249" stroke-width="${S(2.2)}" fill="none" stroke-linecap="round"/></g>`;
    out += `<g id="${p}-mOpen" opacity="0"><path d="${T("M-15 43 C-7 49 7 49 15 43 C13 62 -13 62 -15 43 Z")}" fill="#6e2530"/><path d="${T("M-12 45.5 C-6 49 6 49 12 45.5 L11 49 C5 51.5 -5 51.5 -11 49 Z")}" fill="#ffffff"/><ellipse cx="${X(0)}" cy="${Y(56)}" rx="${S(8)}" ry="${S(3.6)}" fill="#e5828c"/><path d="${T("M-15 43 C-7 49 7 49 15 43 C13 62 -13 62 -15 43 Z")}" fill="none" stroke="#c9666e" stroke-width="${S(2)}"/></g>`;
    out += `<g id="${p}-mOoh" opacity="0"><ellipse cx="${X(0)}" cy="${Y(49)}" rx="${S(5.8)}" ry="${S(7.2)}" fill="#6e2530"/><ellipse cx="${X(0)}" cy="${Y(49)}" rx="${S(6.6)}" ry="${S(8)}" fill="none" stroke="url(#${p}-lip)" stroke-width="${S(3)}"/></g>`;
    out += `<g id="${p}-tear" opacity="0"><path d="${T("M27 14 C23 22 22 27 27 30 C32 27 31 22 27 14 Z")}" fill="url(#${p}-tear)" stroke="#a9d3ee" stroke-width="${S(0.6)}"/><circle cx="${X(25.6)}" cy="${Y(25)}" r="${S(1.4)}" fill="#ffffff"/></g>`;
    // crown of the head with a side part, soft fringe and front locks over the shoulders
    let front = `<path d="${T("M-60 -26 C-64 -76 -30 -100 6 -98 C44 -96 68 -70 60 -24 C54 -44 40 -56 24 -60 C10 -54 -6 -50 -22 -52 C-40 -50 -54 -42 -60 -26 Z")}" fill="url(#${p}-hair)"/>`;
    for (let k = 0; k < 14; k++) {
      const a0 = -10 + k * 0.3, side = k < 6 ? -1 : 1;
      const ex = side < 0 ? -58 + k * 4 : 20 + (k - 6) * 5;
      front += `<path d="${T(`M-8 -96 C${-8 + side * 18} -92 ${ex - side * 6} -78 ${ex} -${44 + (k % 3) * 6}`)}" stroke="${k % 2 ? "#fff0c0" : "#b77d2c"}" stroke-width="${S(k % 2 ? 1.3 : 1)}" fill="none" opacity="${k % 2 ? 0.7 : 0.45}" stroke-linecap="round"/>`;
    }
    front += lock(-8, -94, -50, -18, 26, 12, 4, 0.6, 0.5, "lock", 0.5);
    front += lock(-6, -94, 44, -30, 24, 10, 4, 0.5, 2.0, "lock", 0.5);
    front += lock(-54, -40, -66, 150, 26, 8, 10, 1.7, 0.9, "lock", 0.55);
    front += lock(-46, -28, -50, 120, 20, 7, 9, 1.9, 2.6, "lock", 0.5);
    front += lock(54, -40, 66, 150, 26, 8, 10, 1.7, 2.1, "lock", 0.55);
    front += lock(46, -28, 50, 120, 20, 7, 9, 1.9, 0.3, "lock", 0.5);
    out += front;
    return { back, front: out };
  }

  /* ---------------------------------------------------------------- feathered wings */
  function wing(p, id, rx, ry, side, scale, lift) {
    const s = scale || 1;
    const R = rng(side > 0 ? 41 : 43);
    const o = side; // -1 left, +1 right
    // arm bone: shoulder -> elbow -> wrist, raised up and outwards
    const B = (t) => {
      const p0 = [0, 0], p1 = [70, -96 - (lift || 0)], p2 = [150, -118 - (lift || 0)];
      const x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0];
      const y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
      return [rx + o * x * s, ry + y * s];
    };
    const feather = (x, y, ang, L, W, grad, edge) => {
      const d = `M0 0 C${f(W * 0.7)} ${f(L * 0.15)} ${f(W * 0.62)} ${f(L * 0.78)} ${f(W * 0.08)} ${f(L)} C${f(-W * 0.45)} ${f(L * 0.86)} ${f(-W * 0.62)} ${f(L * 0.2)} 0 0 Z`;
      return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})"><path d="${d}" fill="url(#${p}-${grad})" stroke="${edge}" stroke-width="${f(1 * s)}"/><path d="M0 2 L${f(W * 0.05)} ${f(L * 0.92)}" stroke="#cfd8e4" stroke-width="${f(0.8 * s)}"/></g>`;
    };
    let g = "";
    // primaries + secondaries: long feathers hanging from the bone, fanning outwards at the tip
    const N = 15;
    for (let i = N - 1; i >= 0; i--) {
      const t = 0.18 + (i / (N - 1)) * 0.82;
      const [x, y] = B(t);
      const L = (90 + 120 * Math.pow(t, 1.4) + R() * 10) * s;
      const ang = o * (10 + 52 * Math.pow(t, 1.6)) + (o < 0 ? 0 : 0);
      g += feather(x, y, ang, L, 28 * s, i % 2 ? "featherB" : "feather", "#9fb0c5");
    }
    // coverts: two shorter rows over the bone
    [[0.08, 1, 11, 60, 24], [0.12, 0.95, 10, 38, 20]].forEach(([t0, t1, n, len, w]) => {
      for (let i = n - 1; i >= 0; i--) {
        const t = t0 + ((t1 - t0) * i) / (n - 1);
        const [x, y] = B(t);
        g += feather(x, y + 4 * s, o * (6 + 30 * t), (len + R() * 6) * s, w * s, "feather", "#b3c1d2");
      }
    });
    // leading edge
    let lead = "";
    for (let i = 0; i <= 12; i++) {
      const [x, y] = B(i / 12);
      lead += (i ? " L" : "M") + f(x) + " " + f(y);
    }
    g += `<path d="${lead}" stroke="#ffffff" stroke-width="${f(18 * s)}" stroke-linecap="round" fill="none"/>`;
    g += `<path d="${lead}" stroke="#dfe6ef" stroke-width="${f(3 * s)}" stroke-linecap="round" fill="none" transform="translate(0 ${f(6 * s)})" opacity=".8"/>`;
    return `<g id="${p}-${id}">${g}</g>`;
  }

  function halo(p, cx, cy, s) {
    return `<g id="${p}-halo">
      <ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(92 * s)}" ry="${f(34 * s)}" fill="url(#${p}-glow)" opacity=".75"/>
      <ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(56 * s)}" ry="${f(12 * s)}" fill="none" stroke="#ffd25e" stroke-width="${f(9 * s)}" opacity=".55" filter="url(#${p}-b3)"/>
      <ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(56 * s)}" ry="${f(12 * s)}" fill="none" stroke="url(#${p}-gold)" stroke-width="${f(3.6 * s)}"/>
      <ellipse cx="${f(cx)}" cy="${f(cy - 1.2 * s)}" rx="${f(52 * s)}" ry="${f(10 * s)}" fill="none" stroke="#fff6d6" stroke-width="${f(1.2 * s)}" opacity=".8"/>
    </g>`;
  }

  function star(cx, cy, R, r) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r : R;
      d += (i ? "L" : "M") + f(cx + rr * Math.cos(a)) + " " + f(cy + rr * Math.sin(a)) + " ";
    }
    return d + "Z";
  }

  /* ---------------------------------------------------------------- bust: 400 × 440 */
  function bust(p) {
    const HX = 200, HY = 156, HS = 1;
    const H = head(p, HX, HY, HS, 5);
    const body = `
      <g id="${p}-body">
        <path d="M176 222 C176 246 172 262 164 282 C176 300 224 300 236 282 C228 262 224 246 224 222 Z" fill="url(#${p}-neck)"/>
        <path d="M82 440 C84 360 96 312 128 296 C146 288 160 284 170 280 C184 292 216 292 230 280 C240 284 254 288 272 296 C304 312 316 360 318 440 Z" fill="url(#${p}-dress)"/>
        <path d="M130 300 C112 330 110 380 116 440 L96 440 C94 380 104 326 130 300 Z" fill="#cfd5e2" opacity=".7"/>
        <path d="M270 300 C288 330 290 380 284 440 L304 440 C306 380 296 326 270 300 Z" fill="#c9d0de" opacity=".75"/>
        <path d="M168 280 C182 300 218 300 232 280 L238 286 C220 310 180 310 162 286 Z" fill="url(#${p}-gold)"/>
        <path d="M170 284 C184 302 216 302 230 284" stroke="#fff3c4" stroke-width="1.4" fill="none" opacity=".8"/>
        <path d="M150 330 C160 360 156 400 160 440 M250 330 C240 362 246 400 240 440 M200 318 C204 360 198 400 202 440" stroke="#d3d9e5" stroke-width="7" fill="none" opacity=".55" filter="url(#${p}-b3)"/>
        <path d="${star(200, 334, 15, 6.5)}" fill="url(#${p}-gold)" stroke="#a87a22" stroke-width="1"/>
        <path d="M96 440 C98 380 110 336 136 316 C144 350 146 400 150 440 Z" fill="url(#${p}-dressV)"/>
        <path d="M304 440 C302 380 290 336 264 316 C256 350 254 400 250 440 Z" fill="url(#${p}-dressV)"/>
      </g>`;
    const phone = `
      <g id="${p}-phone" opacity="0">
        <rect x="236" y="250" width="44" height="86" rx="9" fill="#1b2430" stroke="#55606e" stroke-width="2"/>
        <rect x="239.5" y="256" width="37" height="74" rx="6" fill="#2f8fc6"/>
        <rect x="239.5" y="256" width="37" height="74" rx="6" fill="#bfe8ff" opacity=".25"/>
        <circle cx="258" cy="276" r="6.5" fill="#f7d248"/>
        <path d="M247 294 H269 M247 304 H265" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <path d="M236 318 C238 300 248 296 258 300 C270 304 284 308 286 322 C288 338 276 346 262 346 C248 346 236 334 236 318 Z" fill="#f6cdb4"/>
        <path d="M246 306 C254 304 262 306 268 310 M244 318 C252 316 262 318 270 322" stroke="#d8a083" stroke-width="1.4" fill="none" opacity=".75"/>
      </g>`;
    return `
<svg viewBox="0 0 400 440" width="100%" height="100%" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  ${defs(p)}
  ${wing(p, "wingL", 156, 300, -1, 1.15, 0)}
  ${wing(p, "wingR", 244, 300, 1, 1.15, 0)}
  <g id="${p}-hairBack">${H.back}</g>
  ${body}
  <g id="${p}-head">${H.front}</g>
  ${phone}
  ${halo(p, 200, 52, 1)}
</svg>`;
  }

  /* ---------------------------------------------------------------- full figure: 400 × 600, flying */
  function full(p) {
    const HX = 200, HY = 108, HS = 0.66;
    const H = head(p, HX, HY, HS, 7);
    const body = `
      <g id="${p}-body">
        <path d="M188 150 C188 160 186 168 181 178 C188 190 212 190 219 178 C214 168 212 160 212 150 Z" fill="url(#${p}-neck)"/>
        <path id="${p}-gown" d="M150 186 C164 178 178 176 184 174 C194 182 206 182 216 174 C222 176 236 178 250 186 C268 220 272 300 290 380 C304 440 330 500 340 560 C300 576 250 566 200 578 C150 566 100 576 60 560 C70 500 96 440 110 380 C128 300 132 220 150 186 Z" fill="url(#${p}-dress)"/>
        <path d="M60 560 C100 576 150 566 200 578 C250 566 300 576 340 560 L344 572 C302 588 252 578 200 590 C148 578 98 588 56 572 Z" fill="url(#${p}-gold)"/>
        <path d="M150 260 C140 340 120 440 100 556 M250 260 C262 340 282 440 302 556 M200 230 C204 330 196 450 204 574" stroke="#d1d7e3" stroke-width="9" fill="none" opacity=".6" filter="url(#${p}-b3)"/>
        <path d="M182 176 C190 188 210 188 218 176 L222 181 C210 197 190 197 178 181 Z" fill="url(#${p}-gold)"/>
        <path d="${star(200, 222, 11, 4.8)}" fill="url(#${p}-gold)"/>
        <path d="M146 250 C170 258 230 258 254 250 L256 266 C230 274 170 274 144 266 Z" fill="url(#${p}-gold)"/>
        <path d="M96 290 C92 282 98 274 106 276 C112 278 114 286 110 292 C106 298 98 298 96 290 Z" fill="#f6cdb4"/>
        <path d="M304 290 C308 282 302 274 294 276 C288 278 286 286 290 292 C294 298 302 298 304 290 Z" fill="#f6cdb4"/>
        <path d="M152 188 C128 200 106 234 90 278 C104 296 128 300 140 290 C140 262 148 236 164 220 Z" fill="url(#${p}-dressV)"/>
        <path d="M90 278 C104 296 128 300 140 290 L142 296 C128 308 102 304 86 286 Z" fill="url(#${p}-gold)"/>
        <path d="M248 188 C272 200 294 234 310 278 C296 296 272 300 260 290 C260 262 252 236 236 220 Z" fill="url(#${p}-dressV)"/>
        <path d="M310 278 C296 296 272 300 260 290 L258 296 C272 308 298 304 314 286 Z" fill="url(#${p}-gold)"/>
      </g>`;
    return `
<svg viewBox="0 0 400 600" width="100%" height="100%" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  ${defs(p)}
  ${wing(p, "wingL", 172, 196, -1, 1.25, -8)}
  ${wing(p, "wingR", 228, 196, 1, 1.25, -8)}
  <g id="${p}-hairBack">${H.back}</g>
  ${body}
  <g id="${p}-head">${H.front}</g>
  ${halo(p, 200, 46, 0.7)}
</svg>`;
  }

  // pivots for each variant (same coordinate space as the variant's viewBox)
  const RIG = {
    bust: { eyes: "200 160", neck: "200 250", wingL: "156 300", wingR: "244 300", phone: "258 300", tear: "227 178", halo: "200 52", base: "200 440" },
    full: { eyes: "200 111", neck: "200 168", wingL: "172 196", wingR: "228 196", halo: "200 46", base: "200 580" },
  };

  window.SPKind = { bust, full, RIG, rng };
})();
