/* SearchPlace · Christkind (realistic) — environments.
   Static layers (walls, desk, room, skies) are drawn here and pre-rendered to PNG by
   tools/prerender.js; the live parts (gifts, fire, lights, beams) are inlined by index.html.
   All coordinates are in the 840 × 1494 scene space. Seeded PRNG only. */
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
  const W = 840, H = 1494;
  const svg = (inner, vb) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb || `0 0 ${W} ${H}`}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
  const grain = (id, op, freq) => `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${freq || 0.9}" numOctaves="2" seed="3" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${op} 0"/></filter>`;
  function star(cx, cy, R, r) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r : R;
      d += (i ? "L" : "M") + f(cx + rr * Math.cos(a)) + " " + f(cy + rr * Math.sin(a)) + " ";
    }
    return d + "Z";
  }
  const sparkle = (cx, cy, R) => {
    const k = R * 0.2;
    return `M${f(cx)} ${f(cy - R)} Q${f(cx + k)} ${f(cy - k)} ${f(cx + R)} ${f(cy)} Q${f(cx + k)} ${f(cy + k)} ${f(cx)} ${f(cy + R)} Q${f(cx - k)} ${f(cy + k)} ${f(cx - R)} ${f(cy)} Q${f(cx - k)} ${f(cy - k)} ${f(cx)} ${f(cy - R)} Z`;
  };

  /* ================================================================ wood */
  function planks(R, x0, x1, y0, y1, step, tones, grainOp) {
    let s = "";
    for (let x = x0; x < x1; x += step) {
      const c = tones[Math.floor(R() * tones.length)];
      s += `<rect x="${x}" y="${y0}" width="${step}" height="${y1 - y0}" fill="${c}"/>`;
      for (let g = 0; g < 5; g++) {
        const gx = x + 8 + R() * (step - 16), amp = 2 + R() * 5, ph = R() * 6;
        let d = `M${f(gx)} ${y0}`;
        for (let y = y0; y <= y1; y += 60) d += ` L${f(gx + Math.sin(y / 140 + ph) * amp)} ${y}`;
        s += `<path d="${d}" stroke="#1e120a" stroke-width="${f(1 + R() * 1.6)}" fill="none" opacity="${f(grainOp * (0.5 + R()))}"/>`;
      }
      if (R() < 0.45) {
        const ky = y0 + R() * (y1 - y0), kx = x + 14 + R() * (step - 28);
        s += `<ellipse cx="${f(kx)}" cy="${f(ky)}" rx="${f(5 + R() * 5)}" ry="${f(10 + R() * 10)}" fill="#24150c" opacity=".45"/>`;
      }
      s += `<rect x="${x + step - 3}" y="${y0}" width="3" height="${y1 - y0}" fill="#160c06" opacity=".85"/>`;
      s += `<rect x="${x}" y="${y0}" width="2" height="${y1 - y0}" fill="#ffffff" opacity=".05"/>`;
    }
    return s;
  }

  /* ================================================================ attic: back wall, roof, window */
  function atticBg() {
    const R = rng(101);
    let stars = "";
    for (let i = 0; i < 26; i++) stars += `<circle cx="${f(556 + R() * 92)}" cy="${f(702 + R() * 132)}" r="${f(0.8 + R() * 1.8)}" fill="#fff" opacity="${f(0.5 + R() * 0.5)}"/>`;
    return svg(`
  <defs>
    ${grain("g1", 0.08)}
    <clipPath id="roof"><path d="M0 0 H840 V551 L0 894 Z"/></clipPath>
    <clipPath id="glass"><rect x="556" y="700" width="92" height="138" rx="3"/></clipPath>
    <linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#081230"/><stop offset="1" stop-color="#1d3576"/></linearGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a5236"/><stop offset=".45" stop-color="#5b3a25"/><stop offset="1" stop-color="#2f1d11"/></linearGradient>
    <radialGradient id="lamp" cx="18%" cy="78%" r="55%"><stop offset="0" stop-color="#ffcf8a" stop-opacity=".55"/><stop offset=".45" stop-color="#ffb35c" stop-opacity=".18"/><stop offset="1" stop-color="#ff9d40" stop-opacity="0"/></radialGradient>
    <radialGradient id="moon" cx="72%" cy="52%" r="40%"><stop offset="0" stop-color="#bcd6ff" stop-opacity=".28"/><stop offset="1" stop-color="#8fb4ff" stop-opacity="0"/></radialGradient>
    <radialGradient id="vig" cx="50%" cy="55%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></radialGradient>
    <radialGradient id="frost" cx="50%" cy="50%" r="50%"><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#e8f4ff" stop-opacity=".55"/></radialGradient>
  </defs>
  ${planks(R, 0, 840, 0, 1494, 66, ["#5d3d28", "#553722", "#634330", "#4f321f", "#5a3a24"], 0.35)}
  <g clip-path="url(#roof)">
    <rect width="840" height="900" fill="#2b1b11" opacity=".55"/>
    ${(() => { let s = ""; for (let k = -20; k < 30; k++) { const o = k * 46; s += `<path d="M0 ${894 - o} L840 ${551 - o}" stroke="#140b06" stroke-width="3" opacity=".7"/><path d="M0 ${896 - o} L840 ${553 - o}" stroke="#ffffff" stroke-width="1" opacity=".04"/>`; } return s; })()}
  </g>
  <path d="M-10 870 L850 527 L850 585 L-10 928 Z" fill="url(#beam)"/>
  <path d="M-10 870 L850 527" stroke="#9b6c48" stroke-width="3" opacity=".7"/>
  <path d="M-10 928 L850 585" stroke="#0e0804" stroke-width="5" opacity=".7"/>
  <rect x="-10" y="350" width="860" height="52" fill="url(#beam)"/>
  <rect x="-10" y="350" width="860" height="3" fill="#a77650" opacity=".6"/>
  <rect x="-10" y="402" width="860" height="10" fill="#000" opacity=".35"/>
  <g>
    <rect x="528" y="676" width="148" height="190" rx="8" fill="#2a1a10"/>
    <rect x="540" y="686" width="124" height="166" rx="6" fill="#6b4a33"/>
    <rect x="556" y="700" width="92" height="138" rx="3" fill="url(#night)"/>
    <g clip-path="url(#glass)">
      ${stars}
      <circle cx="628" cy="728" r="20" fill="#f3f0dc"/><circle cx="636" cy="722" r="18" fill="url(#night)"/>
      <path d="M556 818 C580 806 610 812 648 800 V840 H556 Z" fill="#dfe9f4"/>
      <rect x="556" y="700" width="92" height="138" fill="url(#frost)"/>
    </g>
    <rect x="598" y="700" width="8" height="138" fill="#6b4a33"/>
    <rect x="556" y="766" width="92" height="8" fill="#6b4a33"/>
    <rect x="530" y="850" width="146" height="16" rx="4" fill="#7a5539"/>
    <rect x="530" y="864" width="146" height="6" fill="#000" opacity=".4"/>
  </g>
  <rect width="840" height="1494" fill="url(#moon)"/>
  <rect width="840" height="1494" fill="url(#lamp)"/>
  <rect width="840" height="1494" filter="url(#g1)"/>
  <rect width="840" height="1494" fill="url(#vig)"/>`);
  }

  /* ================================================================ attic: the desk (foreground) */
  function letter(x, y, rot, R, env) {
    let ink = "";
    for (let l = 0; l < 4; l++) {
      let d = `M-34 ${-14 + l * 9}`;
      for (let k = 1; k <= 10; k++) d += ` L${-34 + k * 6.6} ${f(-14 + l * 9 + Math.sin(k * 1.7 + l + x) * 1.6)}`;
      ink += `<path d="${d}" stroke="#2b3f6b" stroke-width="1.3" fill="none" opacity=".75"/>`;
    }
    const body = env
      ? `<rect x="-46" y="-30" width="92" height="60" rx="3" fill="#efe3cc"/><path d="M-46 -30 L0 6 L46 -30" stroke="#cdbb98" stroke-width="2" fill="none"/><circle cx="0" cy="6" r="8" fill="#a62a2a"/><circle cx="-2" cy="4" r="3" fill="#d24a4a" opacity=".7"/><rect x="26" y="-24" width="14" height="16" fill="#3f7fb4"/>`
      : `<rect x="-46" y="-30" width="92" height="60" rx="2" fill="#f7f1e4"/>${ink}`;
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><rect x="-44" y="-26" width="92" height="60" rx="3" fill="#000" opacity=".28" filter="url(#soft)"/>${body}</g>`;
  }
  function atticDesk() {
    const R = rng(202);
    let wood = "";
    for (let k = 0; k < 18; k++) {
      const y = 1212 + k * 5 + R() * 3;
      wood += `<path d="M0 ${f(y)} C200 ${f(y + R() * 4 - 2)} 500 ${f(y + R() * 4 - 2)} 840 ${f(y)}" stroke="#3b2214" stroke-width="${f(0.8 + R())}" opacity=".35" fill="none"/>`;
    }
    const L = [[210, 1262, -12, 0], [312, 1248, 9, 1], [420, 1262, -5, 0], [560, 1252, 14, 0], [680, 1270, -9, 1], [120, 1282, 6, 0], [760, 1250, 18, 0]];
    return svg(`
  <defs>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="glowF" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
    ${grain("g2", 0.1)}
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8b5a38"/><stop offset="1" stop-color="#6a4127"/></linearGradient>
    <linearGradient id="front" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2b19"/><stop offset="1" stop-color="#26150b"/></linearGradient>
    <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e4c1a"/><stop offset=".5" stop-color="#e9c46a"/><stop offset="1" stop-color="#7a5520"/></linearGradient>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e7a52"/><stop offset="1" stop-color="#14402a"/></linearGradient>
    <radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd59a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb060" stop-opacity="0"/></radialGradient>
  </defs>
  <path d="M0 1204 H840 V1304 H0 Z" fill="url(#top)"/>
  ${wood}
  <rect x="0" y="1204" width="840" height="3" fill="#b07a52" opacity=".8"/>
  <rect x="0" y="1300" width="840" height="14" fill="#9a6843"/>
  <rect x="0" y="1314" width="840" height="180" fill="url(#front)"/>
  <rect x="40" y="1340" width="350" height="120" rx="6" fill="none" stroke="#1b0e06" stroke-width="4" opacity=".7"/>
  <rect x="450" y="1340" width="350" height="120" rx="6" fill="none" stroke="#1b0e06" stroke-width="4" opacity=".7"/>
  <rect x="44" y="1344" width="342" height="3" fill="#ffffff" opacity=".06"/>
  <circle cx="215" cy="1400" r="9" fill="url(#brass)"/><circle cx="625" cy="1400" r="9" fill="url(#brass)"/>
  <ellipse cx="150" cy="1236" rx="210" ry="46" fill="url(#pool)"/>
  ${L.map(([x, y, r, e]) => letter(x, y, r, R, e)).join("")}
  <g>
    <ellipse cx="96" cy="1232" rx="44" ry="10" fill="#000" opacity=".35" filter="url(#soft)"/>
    <ellipse cx="96" cy="1226" rx="38" ry="9" fill="url(#brass)"/>
    <rect x="91" y="1100" width="10" height="126" fill="url(#brass)"/>
    <path d="M40 1112 C40 1088 64 1074 96 1074 C128 1074 152 1088 152 1112 Z" fill="url(#shade)"/>
    <path d="M40 1112 H152" stroke="#e9c46a" stroke-width="3"/>
    <ellipse cx="96" cy="1114" rx="54" ry="7" fill="#fff2c8"/>
    <ellipse cx="96" cy="1150" rx="120" ry="60" fill="#ffd38a" opacity=".22" filter="url(#glowF)"/>
  </g>
  <rect x="0" y="1204" width="840" height="290" filter="url(#g2)"/>`);
  }

  /* ================================================================ a gift box in 3/4 view */
  function gift3D(id, x, y, w, h, c, rib, bow, depth) {
    const d = depth || Math.min(30, w * 0.22);
    const shade = (hex, k) => {
      const n = parseInt(hex.slice(1), 16);
      const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
      return `rgb(${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)})`;
    };
    const top = `M${x} ${y} L${x + d} ${y - d * 0.6} L${x + w + d} ${y - d * 0.6} L${x + w} ${y} Z`;
    const side = `M${x + w} ${y} L${x + w + d} ${y - d * 0.6} L${x + w + d} ${y + h - d * 0.6} L${x + w} ${y + h} Z`;
    const rw = Math.max(12, w * 0.12);
    let s = `<g id="${id}">`;
    s += `<path d="${side}" fill="${shade(c, 0.62)}"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#giftShade)"/>`;
    s += `<path d="${top}" fill="${shade(c, 1.22)}"/>`;
    s += `<rect x="${x + w / 2 - rw / 2}" y="${y}" width="${rw}" height="${h}" fill="${rib}"/>`;
    s += `<rect x="${x + w / 2 - rw / 2}" y="${y}" width="${rw}" height="${h}" fill="url(#satin)"/>`;
    s += `<path d="M${x + w / 2 - rw / 2} ${y} L${x + w / 2 - rw / 2 + d} ${y - d * 0.6} L${x + w / 2 + rw / 2 + d} ${y - d * 0.6} L${x + w / 2 + rw / 2} ${y} Z" fill="${rib}"/>`;
    s += `<path d="M${x + w} ${y + h * 0.45} L${x + w + d} ${y + h * 0.45 - d * 0.6} L${x + w + d} ${y + h * 0.45 - d * 0.6 + rw} L${x + w} ${y + h * 0.45 + rw} Z" fill="${shade(rib.startsWith("#") ? rib : "#dddddd", 0.75)}"/>`;
    s += `<rect x="${x}" y="${y + h * 0.45}" width="${w}" height="${rw}" fill="${rib}"/>`;
    s += `<rect x="${x}" y="${y + h * 0.45}" width="${w}" height="${rw}" fill="url(#satinH)"/>`;
    if (bow) {
      const bx = x + w / 2 + d / 2, by = y - d * 0.3;
      s += `<path d="M${bx} ${by} C${bx - 26} ${by - 30} ${bx - 46} ${by - 6} ${bx - 30} ${by + 6} C${bx - 20} ${by + 12} ${bx - 8} ${by + 4} ${bx} ${by} Z" fill="${rib}"/>`;
      s += `<path d="M${bx} ${by} C${bx + 26} ${by - 30} ${bx + 46} ${by - 6} ${bx + 30} ${by + 6} C${bx + 20} ${by + 12} ${bx + 8} ${by + 4} ${bx} ${by} Z" fill="${rib}"/>`;
      s += `<path d="M${bx - 30} ${by - 10} C${bx - 22} ${by - 18} ${bx - 12} ${by - 12} ${bx - 6} ${by - 4} M${bx + 30} ${by - 10} C${bx + 22} ${by - 18} ${bx + 12} ${by - 12} ${bx + 6} ${by - 4}" stroke="#ffffff" stroke-width="2.4" opacity=".55" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M${bx - 4} ${by + 2} L${bx - 16} ${by + 26} L${bx - 8} ${by + 24} Z M${bx + 4} ${by + 2} L${bx + 14} ${by + 26} L${bx + 6} ${by + 24} Z" fill="${rib}"/>`;
      s += `<ellipse cx="${bx}" cy="${by}" rx="8" ry="6.5" fill="${rib}"/><ellipse cx="${bx - 2}" cy="${by - 2}" rx="3" ry="2.2" fill="#fff" opacity=".6"/>`;
    }
    return s + "</g>";
  }
  const giftDefs = `
    <linearGradient id="giftShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".14"/><stop offset=".55" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".28"/></linearGradient>
    <linearGradient id="satin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".4" stop-color="#fff" stop-opacity=".45"/><stop offset=".6" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <linearGradient id="satinH" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".2"/><stop offset=".4" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>`;

  /* ================================================================ the dream loft */
  function loftView() {
    // what you see through the window: Vienna at night (behind the room layer)
    const R = rng(303);
    let stars = "";
    for (let i = 0; i < 90; i++) {
      const x = 150 + R() * 540, y = 60 + R() * 420, r = 0.6 + Math.pow(R(), 3) * 2.6;
      stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#fff" opacity="${f(0.45 + R() * 0.55)}"/>`;
    }
    let city = "";
    let x = 130;
    while (x < 720) {
      const w = 34 + R() * 60, h = 90 + R() * 190;
      const tone = ["#0c1638", "#101c45", "#0a1330"][Math.floor(R() * 3)];
      city += `<rect x="${f(x)}" y="${f(760 - h)}" width="${f(w)}" height="${f(h)}" fill="${tone}"/>`;
      city += `<rect x="${f(x)}" y="${f(760 - h)}" width="${f(w)}" height="4" fill="#e6eef8" opacity=".8"/>`;
      for (let wy = 760 - h + 14; wy < 750; wy += 20) for (let wx = x + 6; wx < x + w - 10; wx += 14) if (R() < 0.38) city += `<rect x="${f(wx)}" y="${f(wy)}" width="7" height="10" fill="${R() < 0.7 ? "#ffd48a" : "#ffe9bf"}" opacity="${f(0.7 + R() * 0.3)}"/>`;
      x += w + 2;
    }
    // Stephansdom spire
    const dom = `<path d="M402 760 L402 520 L410 470 L414 360 L418 300 L422 360 L426 470 L434 520 L434 760 Z" fill="#0a1330"/><path d="M380 760 L380 600 L456 600 L456 760 Z" fill="#0b1535"/><path d="M380 600 L418 560 L456 600 Z" fill="#0a1330"/><circle cx="418" cy="296" r="3" fill="#ffd48a"/>`;
    return svg(`
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050b26"/><stop offset=".6" stop-color="#122a6a"/><stop offset="1" stop-color="#2a4a96"/></linearGradient>
    <radialGradient id="mg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
    <radialGradient id="cityglow" cx="50%" cy="100%" r="60%"><stop offset="0" stop-color="#ffb36b" stop-opacity=".35"/><stop offset="1" stop-color="#ffb36b" stop-opacity="0"/></radialGradient>
    <filter id="bl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>
  </defs>
  <rect width="840" height="1494" fill="url(#sky)"/>
  ${stars}
  <circle cx="560" cy="450" r="110" fill="url(#mg)"/>
  <circle cx="560" cy="450" r="44" fill="#fbf4dc"/>
  <circle cx="548" cy="440" r="7" fill="#e7dec2" opacity=".7"/><circle cx="572" cy="462" r="5" fill="#e7dec2" opacity=".6"/><circle cx="566" cy="432" r="4" fill="#e7dec2" opacity=".6"/>
  <rect x="0" y="520" width="840" height="260" fill="url(#cityglow)"/>
  <g filter="url(#bl)">${city}${dom}</g>`);
  }

  function loftRoom() {
    // the room itself, with the window glass cut out (transparent) so the view and snow show through
    const R = rng(404);
    let herring = "";
    for (let row = 0; row < 12; row++) {
      for (let col = -1; col < 18; col++) {
        const x = col * 52 + (row % 2) * 26, y = 1300 + row * 18;
        const tone = ["#9a6338", "#8b5530", "#a86e40", "#93592f"][Math.floor(R() * 4)];
        herring += `<path d="M${x} ${y} L${x + 26} ${y + 18} L${x + 52} ${y} L${x + 26} ${y - 18} Z" fill="${tone}" stroke="#5a3218" stroke-width="1" opacity=".95"/>`;
      }
    }
    let damask = "";
    for (let y = 60; y < 1200; y += 120) for (let x = (y / 120) % 2 ? 60 : 0; x < 860; x += 120) damask += `<path d="${sparkle(x, y, 16)}" fill="#e9d6b1" opacity=".35"/>`;
    // tree: many needle strokes per tier, shaded
    let tree = "";
    const tiers = [[680, 596, 70, 760], [680, 680, 104, 900], [680, 800, 136, 1060], [680, 940, 166, 1240]];
    tiers.forEach(([cx, top, half, base], ti) => {
      tree += `<path d="M${cx} ${top} L${cx - half} ${base} Q${cx} ${base + 22} ${cx + half} ${base} Z" fill="#163f2a"/>`;
      for (let k = 0; k < 260; k++) {
        const t = R(), side = R() < 0.5 ? -1 : 1;
        const yy = top + (base - top) * Math.sqrt(t);
        const wx = half * Math.sqrt(t) * R();
        const xx = cx + side * wx;
        const len = 10 + R() * 18, ang = side * (0.5 + R() * 0.6) + Math.PI / 2;
        const lit = side > 0 ? 0.75 : 1.15;
        const col = ["#1f5a3a", "#2a6d47", "#34805a", "#18492f"][Math.floor(R() * 4)];
        tree += `<path d="M${f(xx)} ${f(yy)} l${f(Math.cos(ang) * len * 0.6 * -side)} ${f(Math.sin(ang) * len * 0.5)}" stroke="${col}" stroke-width="${f(2.4 * lit)}" stroke-linecap="round" opacity=".95"/>`;
      }
      tree += `<path d="M${cx} ${top} L${cx + half} ${base} Q${cx + half * 0.5} ${base + 14} ${cx + 6} ${base + 16} Z" fill="#000" opacity=".22"/>`;
    });
    const balls = [[640, 830, "#a8232b"], [722, 1000, "#c9a23c"], [604, 1150, "#2c6e8f"], [760, 1200, "#a8232b"], [700, 900, "#c9a23c"], [596, 990, "#7a2a6e"], [660, 1080, "#c9a23c"], [740, 760, "#2c6e8f"]]
      .map(([bx, by, c]) => `<circle cx="${bx}" cy="${by}" r="12" fill="${c}"/><circle cx="${bx}" cy="${by}" r="12" fill="url(#ball)"/>`)
      .join("");
    const stockings = [[70, "#9c1f2a"], [146, "#e9e0cf"], [222, "#2f6a46"]]
      .map(([sx, c]) => `<path d="M${sx} 856 h36 v64 q0 24 -24 24 h-28 q-16 0 -16 -14 q0 -13 15 -13 h17 Z" fill="${c}"/><path d="M${sx} 856 h36 v64 q0 24 -24 24 h-28 q-16 0 -16 -14 q0 -13 15 -13 h17 Z" fill="url(#knit)"/><rect x="${sx - 5}" y="850" width="46" height="20" rx="6" fill="#f6f2ea"/>`)
      .join("");
    let garland = "";
    for (let k = 0; k < 60; k++) {
      const x = 34 + k * 5, y = 812 + Math.sin(k / 6) * 4;
      garland += `<path d="M${x} ${f(y)} l${f(-6 + R() * 12)} ${f(-8 - R() * 8)}" stroke="${R() < 0.5 ? "#2a6d47" : "#1f5a3a"}" stroke-width="2.6" stroke-linecap="round"/>`;
    }
    return svg(`
  <defs>
    ${grain("g3", 0.06, 0.8)}
    ${giftDefs}
    <mask id="glassCut"><rect width="840" height="1494" fill="#fff"/><path d="M152 738 L152 330 A268 268 0 0 1 688 330 L688 738 Z" fill="#000"/></mask>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ead8b8"/><stop offset="1" stop-color="#f4e6cc"/></linearGradient>
    <linearGradient id="frame" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9e1d2"/><stop offset=".5" stop-color="#fffaf0"/><stop offset="1" stop-color="#ddd3c1"/></linearGradient>
    <linearGradient id="marble" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4efe6"/><stop offset=".5" stop-color="#e6ddcf"/><stop offset="1" stop-color="#d4c8b5"/></linearGradient>
    <radialGradient id="soot" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#3a2a22"/><stop offset="1" stop-color="#120a07"/></radialGradient>
    <radialGradient id="ball" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".35" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
    <linearGradient id="floorSheen" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".3" stop-color="#ffd49a" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
    <pattern id="knitP" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 4 L4 0 L8 4" stroke="#000" stroke-width="1" fill="none" opacity=".25"/></pattern>
    <linearGradient id="knit" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".15"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <radialGradient id="rug" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#8e2b2b"/><stop offset=".7" stop-color="#6e1f22"/><stop offset=".72" stop-color="#d4b06a"/><stop offset=".78" stop-color="#5a1a1d"/><stop offset="1" stop-color="#3e1214"/></radialGradient>
    <radialGradient id="vig2" cx="50%" cy="50%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1a0d05" stop-opacity=".55"/></radialGradient>
    <linearGradient id="reveal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfc4b0"/><stop offset=".1" stop-color="#f2ece0"/><stop offset=".9" stop-color="#f2ece0"/><stop offset="1" stop-color="#b9ad98"/></linearGradient>
  </defs>
  <g mask="url(#glassCut)">
    <rect width="840" height="1494" fill="url(#wall)"/>
    ${damask}
    <rect x="0" y="1010" width="840" height="290" fill="#efe2c8"/>
    ${[40, 330, 560].map((x) => `<rect x="${x}" y="1040" width="${x === 330 ? 200 : 240}" height="230" rx="4" fill="none" stroke="#d6c39f" stroke-width="5"/>`).join("")}
    <rect x="0" y="1004" width="840" height="10" fill="#dccaa6"/>
    <path d="M118 772 L118 330 A302 302 0 0 1 722 330 L722 772 Z" fill="url(#frame)"/>
    <path d="M134 756 L134 330 A286 286 0 0 1 706 330 L706 756 Z" fill="url(#reveal)"/>
    <rect x="410" y="40" width="20" height="700" fill="url(#frame)"/>
    <rect x="140" y="522" width="560" height="18" fill="url(#frame)"/>
    <rect x="100" y="744" width="640" height="32" rx="6" fill="#fffaf0"/>
    <rect x="100" y="774" width="640" height="10" fill="#cbbd9f"/>
  </g>
  <path d="M152 738 L152 330 A268 268 0 0 1 688 330 L688 738 Z" fill="#ffffff" opacity=".05"/>
  <rect x="411" y="62" width="18" height="676" fill="url(#frame)"/>
  <rect x="152" y="522" width="536" height="16" fill="url(#frame)"/>
  <rect x="411" y="62" width="4" height="676" fill="#ffffff" opacity=".6"/>
  <path d="M210 740 L460 70 L520 70 L270 740 Z" fill="#ffffff" opacity=".045"/>
  <!-- fireplace -->
  <rect x="36" y="840" width="288" height="462" fill="url(#marble)"/>
  <rect x="36" y="840" width="288" height="462" fill="url(#vig2)" opacity=".5"/>
  <path d="M60 1302 V1070 C60 1000 300 1000 300 1070 V1302 Z" fill="#c9bba4"/>
  <path d="M84 1302 V1078 C84 1022 276 1022 276 1078 V1302 Z" fill="url(#soot)"/>
  <rect x="96" y="1262" width="168" height="18" rx="8" fill="#5b3622" transform="rotate(-7 180 1271)"/>
  <rect x="100" y="1262" width="160" height="18" rx="8" fill="#6b412a" transform="rotate(8 180 1271)"/>
  <rect x="20" y="812" width="320" height="34" rx="5" fill="#efe7da"/>
  <rect x="20" y="842" width="320" height="10" fill="#bfb19a"/>
  ${garland}
  ${stockings}
  <rect x="258" y="764" width="22" height="48" rx="4" fill="#f8f1e3"/><rect x="290" y="780" width="22" height="32" rx="4" fill="#f8f1e3"/>
  <!-- floor & rug -->
  <rect x="0" y="1290" width="840" height="204" fill="#8b5530"/>
  ${herring}
  <rect x="0" y="1290" width="840" height="204" fill="url(#floorSheen)"/>
  <ellipse cx="400" cy="1404" rx="320" ry="66" fill="url(#rug)"/>
  <ellipse cx="400" cy="1404" rx="288" ry="54" fill="none" stroke="#d4b06a" stroke-width="3" opacity=".7"/>
  <ellipse cx="400" cy="1404" rx="200" ry="34" fill="none" stroke="#d4b06a" stroke-width="2" opacity=".5"/>
  <!-- tree -->
  <rect x="664" y="1236" width="32" height="60" fill="#5a3a22"/>
  <path d="M630 1282 H730 L720 1300 H640 Z" fill="#8d2b2b"/>
  ${tree}
  ${balls}
  <rect width="840" height="1494" filter="url(#g3)"/>
  <rect width="840" height="1494" fill="url(#vig2)"/>`);
  }

  /* ================================================================ thumbnails (840 × 380) */
  function altbauThumb() {
    const R = rng(505);
    let win = "";
    const cols = [92, 232, 372, 512, 652];
    [56, 166, 276].forEach((y, r) =>
      cols.forEach((x, ci) => {
        if (r === 2 && ci === 2) return;
        const lit = (r + ci) % 2 === 0 || R() < 0.3;
        win += `<rect x="${x - 10}" y="${y - 8}" width="104" height="${r === 0 ? 96 : 92}" rx="4" fill="#e3caa0"/>`;
        win += `<path d="M${x} ${y + 76} V${y + 30} A42 30 0 0 1 ${x + 84} ${y + 30} V${y + 76} Z" fill="${lit ? "url(#lit)" : "url(#dark)"}"/>`;
        win += `<path d="M${x + 42} ${y} V${y + 76} M${x} ${y + 44} H${x + 84}" stroke="#f3e6c8" stroke-width="4"/>`;
        win += `<rect x="${x - 8}" y="${y + 76}" width="100" height="10" rx="2" fill="#f4f6fa"/>`;
      })
    );
    return svg(`
  <defs>
    ${giftDefs}
    <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1b4a"/><stop offset="1" stop-color="#25428e"/></linearGradient>
    <linearGradient id="fac" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9c08f"/><stop offset=".5" stop-color="#efdcb4"/><stop offset="1" stop-color="#d2b888"/></linearGradient>
    <radialGradient id="lit" cx="50%" cy="60%" r="70%"><stop offset="0" stop-color="#fff1c4"/><stop offset=".6" stop-color="#f6c160"/><stop offset="1" stop-color="#c98a30"/></radialGradient>
    <linearGradient id="dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3f7e"/><stop offset="1" stop-color="#16244f"/></linearGradient>
  </defs>
  <rect width="840" height="380" fill="url(#sk)"/>
  <rect x="30" y="28" width="780" height="360" fill="url(#fac)"/>
  <rect x="20" y="14" width="800" height="20" rx="3" fill="#e6d2a6"/><rect x="20" y="8" width="800" height="8" rx="3" fill="#f6f9fd"/>
  <rect x="30" y="148" width="780" height="8" fill="#d8c193"/><rect x="30" y="258" width="780" height="8" fill="#d8c193"/>
  ${win}
  <path d="M362 380 V318 A58 44 0 0 1 478 318 V380 Z" fill="#4a2a1a"/>
  <path d="M370 380 V320 A50 38 0 0 1 470 320 V380 Z" fill="#6a3d26"/>
  <ellipse cx="420" cy="360" rx="70" ry="10" fill="#ffd48a" opacity=".35"/>
  ${gift3D("ab1", 322, 340, 52, 40, "#a8232b", "#f2e6cc", false, 10)}
  ${gift3D("ab2", 388, 352, 58, 28, "#c9a23c", "#fff4dc", false, 10)}
  ${gift3D("ab3", 456, 336, 48, 44, "#2c6e5a", "#f2e6cc", false, 10)}`, "0 0 840 380");
  }

  function penthouseThumb() {
    const R = rng(606);
    let stars = "";
    for (let i = 0; i < 40; i++) stars += `<circle cx="${f(R() * 840)}" cy="${f(R() * 230)}" r="${f(0.6 + Math.pow(R(), 3) * 2.4)}" fill="#fff" opacity="${f(0.5 + R() * 0.5)}"/>`;
    let mull = "";
    for (let x = 300; x < 600; x += 38) mull += `<rect x="${x}" y="146" width="5" height="140" fill="#eef4fb"/>`;
    const clouds = [[100, 330, 74], [210, 300, 84], [330, 318, 80], [450, 292, 94], [580, 316, 84], [700, 298, 88], [800, 330, 74], [20, 350, 64]];
    const cl = (dy, col, op) => clouds.map(([x, y, r]) => `<circle cx="${x}" cy="${y + dy}" r="${r}" fill="${col}" opacity="${op}"/>`).join("");
    return svg(`
  <defs>
    <linearGradient id="sk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1550"/><stop offset="1" stop-color="#2b48a8"/></linearGradient>
    <radialGradient id="mg2" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6d8" stop-opacity=".5"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
    <linearGradient id="glass2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8ecff"/><stop offset=".5" stop-color="#9fc4ea"/><stop offset="1" stop-color="#7aa3d4"/></linearGradient>
    <filter id="cb" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
  <rect width="840" height="380" fill="url(#sk2)"/>
  ${stars}
  <circle cx="690" cy="92" r="80" fill="url(#mg2)"/><circle cx="690" cy="92" r="34" fill="#fbf4dc"/>
  <rect x="250" y="126" width="370" height="20" rx="3" fill="#f2f6fc"/>
  <rect x="270" y="146" width="330" height="146" fill="url(#glass2)"/>
  <rect x="306" y="190" width="70" height="96" fill="#ffe2a0" opacity=".85"/>
  <rect x="466" y="170" width="70" height="116" fill="#ffe2a0" opacity=".7"/>
  ${mull}
  <path d="M270 146 L420 146 L300 292 L270 292 Z" fill="#ffffff" opacity=".18"/>
  <rect x="250" y="286" width="370" height="14" rx="3" fill="#f2f6fc"/>
  <g filter="url(#cb)">${cl(10, "#9fb3d8", 0.8)}</g>
  ${cl(0, "#f6f9ff", 1)}
  <rect x="0" y="330" width="840" height="50" fill="#f6f9ff"/>`, "0 0 840 380");
  }

  /* ================================================================ phone scene backdrop + night sky */
  function phoneBg() {
    const R = rng(707);
    let bokeh = "";
    for (let i = 0; i < 34; i++) {
      const warm = R() < 0.55;
      const r = 30 + R() * 90;
      bokeh += `<circle cx="${f(R() * 840)}" cy="${f(R() * 1494)}" r="${f(r)}" fill="${warm ? "#ffcf86" : "#7fd6ea"}" opacity="${f(0.08 + R() * 0.16)}"/>`;
    }
    return svg(`
  <defs>
    <linearGradient id="pb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d3b52"/><stop offset=".5" stop-color="#0a2c40"/><stop offset="1" stop-color="#061c2a"/></linearGradient>
    <filter id="bk" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
    <radialGradient id="pv" cx="50%" cy="45%" r="75%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></radialGradient>
    ${grain("g4", 0.05)}
  </defs>
  <rect width="840" height="1494" fill="url(#pb)"/>
  <g filter="url(#bk)">${bokeh}</g>
  <rect width="840" height="1494" filter="url(#g4)"/>
  <rect width="840" height="1494" fill="url(#pv)"/>`);
  }

  function nightBg() {
    const R = rng(808);
    let stars = "";
    for (let i = 0; i < 260; i++) {
      const x = R() * 840, y = R() * 1100, r = 0.5 + Math.pow(R(), 4) * 2.8;
      stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="#fff" opacity="${f(0.35 + R() * 0.65)}"/>`;
      if (r > 2.2) stars += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 4)}" fill="url(#sg)"/>`;
    }
    let roofs = "";
    let x = -20;
    while (x < 860) {
      const w = 70 + R() * 90, h = 120 + R() * 160, tone = ["#07122c", "#091634", "#060f26"][Math.floor(R() * 3)];
      const ry = 1494 - h;
      roofs += `<path d="M${f(x)} 1494 V${f(ry + 30)} L${f(x + w / 2)} ${f(ry)} L${f(x + w)} ${f(ry + 30)} V1494 Z" fill="${tone}"/>`;
      roofs += `<path d="M${f(x)} ${f(ry + 30)} L${f(x + w / 2)} ${f(ry)} L${f(x + w)} ${f(ry + 30)}" stroke="#e8f0fa" stroke-width="5" fill="none" opacity=".85"/>`;
      for (let wy = ry + 50; wy < 1480; wy += 30) for (let wx = x + 10; wx < x + w - 14; wx += 22) if (R() < 0.3) roofs += `<rect x="${f(wx)}" y="${f(wy)}" width="9" height="13" fill="#ffcf86" opacity="${f(0.6 + R() * 0.4)}"/>`;
      x += w - 6;
    }
    const dom = `<path d="M404 1494 L404 1170 L412 1110 L416 1000 L420 940 L424 1000 L428 1110 L436 1170 L436 1494 Z" fill="#060f26"/><path d="M372 1494 V1260 H468 V1494 Z" fill="#07122c"/><path d="M372 1260 L420 1214 L468 1260 Z" fill="#060f26"/>`;
    return svg(`
  <defs>
    <linearGradient id="ns" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040b22"/><stop offset=".55" stop-color="#0b2556"/><stop offset="1" stop-color="#1a3f7e"/></linearGradient>
    <radialGradient id="sg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#cfe4ff" stop-opacity=".35"/><stop offset="1" stop-color="#cfe4ff" stop-opacity="0"/></radialGradient>
    <radialGradient id="mg3" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff6d8" stop-opacity=".45"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
    <radialGradient id="cg" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="#ffb36b" stop-opacity=".3"/><stop offset="1" stop-color="#ffb36b" stop-opacity="0"/></radialGradient>
    <filter id="mw" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
    ${grain("g5", 0.05)}
  </defs>
  <rect width="840" height="1494" fill="url(#ns)"/>
  <ellipse cx="420" cy="520" rx="520" ry="90" fill="#9fc0ff" opacity=".08" filter="url(#mw)" transform="rotate(-24 420 520)"/>
  ${stars}
  <circle cx="680" cy="150" r="130" fill="url(#mg3)"/>
  <circle cx="680" cy="150" r="46" fill="#fbf4dc"/>
  <circle cx="666" cy="140" r="8" fill="#e7dec2" opacity=".7"/><circle cx="692" cy="166" r="6" fill="#e7dec2" opacity=".6"/>
  <rect x="0" y="1060" width="840" height="434" fill="url(#cg)"/>
  ${roofs}${dom}
  <rect width="840" height="1494" filter="url(#g5)"/>`);
  }

  window.SPScene = { rng, atticBg, atticDesk, gift3D, giftDefs, loftView, loftRoom, altbauThumb, penthouseThumb, phoneBg, nightBg, sparkle, star };
})();
