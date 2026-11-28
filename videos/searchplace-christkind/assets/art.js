/* SearchPlace · Christkind — vector illustrations.
   Every function returns an SVG string; ids are prefixed so several copies can live on one page.
   Deterministic: the only "randomness" is a seeded PRNG. */
(function () {
  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const circ = (arr, fill, extra) =>
    arr.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra || ""}/>`).join("");
  function star5(cx, cy, R, r) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r : R;
      d += (i ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + " " + (cy + rr * Math.sin(a)).toFixed(1) + " ";
    }
    return d + "Z";
  }
  function sparkle(cx, cy, R) {
    const k = R * 0.22;
    return `M${cx} ${cy - R} Q${cx + k} ${cy - k} ${cx + R} ${cy} Q${cx + k} ${cy + k} ${cx} ${cy + R} Q${cx - k} ${cy + k} ${cx - R} ${cy} Q${cx - k} ${cy - k} ${cx} ${cy - R} Z`;
  }

  /* ------------------------------------------------------------------ the Christkind (400 × 440) */
  function angel(p) {
    const hairBack = [
      [140, 132, 36], [125, 172, 31], [129, 210, 28], [145, 242, 24],
      [260, 132, 36], [275, 172, 31], [271, 210, 28], [255, 242, 24],
      [166, 96, 38], [234, 96, 38], [200, 86, 40],
    ];
    const bangs = [[158, 122, 25], [185, 108, 27], [215, 108, 27], [242, 122, 25]];
    const sideCurls = [[145, 170, 17], [255, 170, 17], [142, 202, 15], [258, 202, 15]];
    const wingL = [[112, 246, 44], [80, 284, 40], [114, 306, 40], [150, 266, 34]];
    const wingR = wingL.map(([x, y, r]) => [400 - x, y, r]);
    const wing = (id, arr, flip) => `
      <g id="${p}-${id}">
        ${circ(arr, "#cbd8e4", 'stroke="#cbd8e4" stroke-width="11"')}
        ${circ(arr, "#ffffff")}
        <path d="${flip ? "M304 270 Q294 262 282 268 M300 300 Q288 292 276 298" : "M96 270 Q106 262 118 268 M100 300 Q112 292 124 298"}"
          stroke="#e2e9f0" stroke-width="5" stroke-linecap="round" fill="none"/>
      </g>`;
    return `
<svg viewBox="0 0 400 440" width="100%" height="100%" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${p}-haloG" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#fff3b0" stop-opacity=".9"/>
      <stop offset="1" stop-color="#ffd76a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${p}-dress" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fffaf0"/><stop offset=".55" stop-color="#fff6e2"/><stop offset="1" stop-color="#f4e6c6"/>
    </linearGradient>
  </defs>
  ${wing("wingL", wingL, false)}
  ${wing("wingR", wingR, true)}
  <g id="${p}-body">
    <path d="M162 210 C176 204 224 204 238 210 L284 392 C232 406 168 406 116 392 Z" fill="url(#${p}-dress)"/>
    <path d="M116 392 C168 406 232 406 284 392 L288 410 C232 424 168 424 112 410 Z" fill="#f2b51d"/>
    <path d="${star5(200, 288, 25, 10.5)}" fill="#f2b51d"/>
    <ellipse cx="200" cy="212" rx="37" ry="11" fill="#f2b51d"/>
    <circle cx="146" cy="324" r="18" fill="#ffe2cc" stroke="#f1c3a6" stroke-width="2"/>
    <circle cx="254" cy="324" r="18" fill="#ffe2cc" stroke="#f1c3a6" stroke-width="2"/>
  </g>
  <g id="${p}-phone" opacity="0">
    <rect x="232" y="258" width="46" height="76" rx="10" fill="#173a5a"/>
    <rect x="236.5" y="265" width="37" height="62" rx="6" fill="#3a8fc6"/>
    <circle cx="255" cy="282" r="7" fill="#f7d248"/>
    <path d="M244 300 H266 M244 311 H262" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
    <circle cx="257" cy="332" r="16" fill="#ffe2cc" stroke="#f1c3a6" stroke-width="2"/>
  </g>
  <g id="${p}-head">
    ${circ(hairBack.map(([x, y, r]) => [x + 3, y + 5, r]), "#dc9f28")}
    ${circ(hairBack, "#f5c23c")}
    <circle cx="200" cy="160" r="57" fill="#ffe4cf"/>
    <ellipse cx="161" cy="186" rx="12" ry="7.5" fill="#f7a1ad" opacity=".8"/>
    <ellipse cx="239" cy="186" rx="12" ry="7.5" fill="#f7a1ad" opacity=".8"/>
    <g id="${p}-eyes">
      <ellipse cx="179" cy="165" rx="7.5" ry="9.5" fill="#3a2a2e"/>
      <ellipse cx="221" cy="165" rx="7.5" ry="9.5" fill="#3a2a2e"/>
      <circle cx="181.6" cy="161.2" r="2.9" fill="#ffffff"/>
      <circle cx="223.6" cy="161.2" r="2.9" fill="#ffffff"/>
    </g>
    <g id="${p}-eyesHappy" opacity="0">
      <path d="M170 168 Q179 157 188 168 M212 168 Q221 157 230 168" stroke="#3a2a2e" stroke-width="4.8" stroke-linecap="round" fill="none"/>
    </g>
    <g id="${p}-brows" opacity="0">
      <path d="M166 148 L188 140 M212 140 L234 148" stroke="#c98f2a" stroke-width="4.5" stroke-linecap="round"/>
    </g>
    <path id="${p}-mSmile" d="M189 191 Q200 200 211 191" stroke="#7a3b3b" stroke-width="4.2" stroke-linecap="round" fill="none"/>
    <path id="${p}-mSad" d="M189 198 Q200 188 211 198" stroke="#7a3b3b" stroke-width="4.2" stroke-linecap="round" fill="none" opacity="0"/>
    <path id="${p}-mFlat" d="M190 195 Q200 193 210 195" stroke="#7a3b3b" stroke-width="4.2" stroke-linecap="round" fill="none" opacity="0"/>
    <g id="${p}-mOpen" opacity="0">
      <path d="M182 186 C190 191 210 191 218 186 C215 207 185 207 182 186 Z" fill="#b8414f"/>
      <ellipse cx="200" cy="200" rx="8" ry="3.8" fill="#f08a96"/>
    </g>
    <ellipse id="${p}-mOoh" cx="200" cy="195" rx="6.5" ry="8.5" fill="#b8414f" opacity="0"/>
    <g id="${p}-tear" opacity="0">
      <path d="M236 174 C231 183 230 189 236 193 C242 189 241 183 236 174 Z" fill="#86cdf2"/>
      <circle cx="234.5" cy="186" r="1.6" fill="#ffffff"/>
    </g>
    ${circ(sideCurls, "#f5c23c")}
    ${circ(bangs.map(([x, y, r]) => [x + 2, y + 4, r]), "#e3a82c")}
    ${circ(bangs, "#f7c745")}
    <path d="M150 114 Q158 104 168 108 M178 100 Q186 92 196 96 M208 98 Q216 92 224 98 M234 110 Q242 104 250 112"
      stroke="#ffe08a" stroke-width="4" stroke-linecap="round" fill="none"/>
  </g>
  <g id="${p}-halo">
    <ellipse cx="200" cy="40" rx="78" ry="24" fill="url(#${p}-haloG)" opacity=".7"/>
    <ellipse cx="200" cy="40" rx="56" ry="12.5" fill="none" stroke="#f4c43a" stroke-width="8"/>
    <ellipse cx="200" cy="38" rx="56" ry="12.5" fill="none" stroke="#ffe486" stroke-width="3"/>
  </g>
</svg>`;
  }

  /* ------------------------------------------------------------------ gift box */
  function gift(id, x, y, w, h, c, rib, bow) {
    const b = bow
      ? `<ellipse cx="${x + w / 2 - 15}" cy="${y - 7}" rx="17" ry="9.5" fill="${rib}" transform="rotate(-22 ${x + w / 2 - 15} ${y - 7})"/>
         <ellipse cx="${x + w / 2 + 15}" cy="${y - 7}" rx="17" ry="9.5" fill="${rib}" transform="rotate(22 ${x + w / 2 + 15} ${y - 7})"/>
         <circle cx="${x + w / 2}" cy="${y - 4}" r="7.5" fill="${rib}"/>`
      : "";
    return `<g id="${id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${c}"/>
      <rect x="${x + w * 0.8}" y="${y}" width="${w * 0.2}" height="${h}" rx="7" fill="#000" opacity=".12"/>
      <rect x="${x}" y="${y}" width="${w}" height="${Math.min(16, h * 0.2)}" rx="7" fill="#fff" opacity=".14"/>
      <rect x="${x + w / 2 - 8}" y="${y}" width="16" height="${h}" fill="${rib}"/>
      <rect x="${x}" y="${y + h * 0.42}" width="${w}" height="13" fill="${rib}"/>
      ${b}
    </g>`;
  }
  function letter(x, y, rot, id) {
    return `<g ${id ? `id="${id}"` : ""} transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="-48" y="-31" width="96" height="62" rx="6" fill="#fbf6ec"/>
      <rect x="-48" y="-31" width="96" height="62" rx="6" fill="none" stroke="#e7dccb" stroke-width="2"/>
      <path d="M-33 -13 H31 M-33 0 H25 M-33 13 H17" stroke="#c7bfae" stroke-width="4.5" stroke-linecap="round"/>
    </g>`;
  }

  /* ------------------------------------------------------------------ the cramped attic (840 × 1494) */
  function attic(p) {
    const R = rng(7);
    let planks = "";
    for (let x = 60; x < 840; x += 70) planks += `<rect x="${x}" y="0" width="7" height="1494" fill="#423d5c"/>`;
    let roofPl = "";
    for (let x = 30; x < 840; x += 70) roofPl += `<rect x="${x}" y="0" width="6" height="900" fill="#322e47"/>`;
    let stars = "";
    for (let i = 0; i < 14; i++) {
      stars += `<circle class="${p}-wstar" cx="${(552 + R() * 96).toFixed(1)}" cy="${(702 + R() * 136).toFixed(1)}" r="${(1.6 + R() * 2.2).toFixed(1)}" fill="#ffffff"/>`;
    }
    const deskLetters = [
      [205, 1310, -10], [300, 1288, 12], [418, 1372, -6], [196, 1432, 8],
      [560, 1410, -12], [650, 1300, 10], [705, 1452, -15], [100, 1398, 5],
    ].map(([x, y, r]) => letter(x, y, r)).join("");
    return `
<svg viewBox="0 0 840 1494" width="840" height="1494" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="${p}-roofC"><path d="M0 0 H840 V551 L0 894 Z"/></clipPath>
    <clipPath id="${p}-winC"><rect x="552" y="702" width="96" height="136" rx="4"/></clipPath>
    <linearGradient id="${p}-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5a5479"/><stop offset="1" stop-color="#4d4769"/>
    </linearGradient>
    <linearGradient id="${p}-night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#101a44"/><stop offset="1" stop-color="#22357a"/>
    </linearGradient>
  </defs>
  <rect width="840" height="1494" fill="url(#${p}-wall)"/>
  ${planks}
  <g clip-path="url(#${p}-roofC)">
    <rect width="840" height="900" fill="#3a3652"/>
    ${roofPl}
  </g>
  <path d="M0 894 L840 551" stroke="#6b6491" stroke-width="10"/>
  <path d="M0 906 L840 563" stroke="#2c283f" stroke-width="6" opacity=".6"/>
  <g id="${p}-window">
    <rect x="538" y="688" width="124" height="164" rx="10" fill="#5b3d31"/>
    <rect x="552" y="702" width="96" height="136" rx="4" fill="url(#${p}-night)"/>
    <g clip-path="url(#${p}-winC)">${stars}<g id="${p}-wsnow"></g></g>
    <rect x="596" y="702" width="9" height="136" fill="#5b3d31"/>
    <rect x="552" y="765" width="96" height="9" fill="#5b3d31"/>
    <rect x="530" y="848" width="140" height="14" rx="4" fill="#6c4a3b"/>
  </g>
  <g id="${p}-giftsL">
    ${gift(p + "-gL3", 24, 1083, 150, 121, "#c8504a", "#f3e3c6", false)}
    ${gift(p + "-gL2", 34, 983, 126, 100, "#3f8f86", "#f3e3c6", false)}
    ${gift(p + "-gL1", 30, 913, 132, 70, "#d9a640", "#fff4dc", true)}
  </g>
  <g id="${p}-giftsR">
    ${gift(p + "-gR5", 630, 1090, 206, 114, "#4f63b8", "#e9edf8", false)}
    ${gift(p + "-gR4", 640, 990, 190, 100, "#8a5a9e", "#f2e6f6", false)}
    ${gift(p + "-gR3", 650, 900, 175, 90, "#5e9a5a", "#eef6e6", false)}
    ${gift(p + "-gR2", 662, 815, 150, 85, "#c8504a", "#f3e3c6", false)}
  </g>
  <g id="${p}-angelSlot"></g>
  <g id="${p}-desk">
    <rect x="0" y="1204" width="840" height="290" fill="#6a4a3b"/>
    <rect x="0" y="1204" width="840" height="22" fill="#86604c"/>
    <path d="M0 1300 H840 M0 1398 H840" stroke="#5a3e31" stroke-width="5"/>
    <path d="M210 1226 V1300 M560 1300 V1398 M330 1398 V1494" stroke="#5a3e31" stroke-width="5"/>
    ${deskLetters}
  </g>
  ${gift(p + "-gTop", 676, 738, 126, 77, "#d9839c", "#fff0f4", true)}
</svg>`;
  }

  /* ------------------------------------------------------------------ the dream loft (840 × 1494) */
  function loft(p, viewBox, opts) {
    opts = opts || {};
    const R = rng(11);
    let stripes = "";
    for (let x = 20; x < 840; x += 72) stripes += `<rect x="${x}" y="0" width="30" height="1300" fill="#f4e2c1"/>`;
    let stars = "";
    for (let i = 0; i < 26; i++) {
      const x = 170 + R() * 500, y = 90 + R() * 440;
      if (Math.hypot(x - 560, y - 450) < 84) continue;
      const r = 1.8 + R() * 2.8;
      stars += i % 4 === 0
        ? `<path class="${p}-star" d="${sparkle(Math.round(x), Math.round(y), Math.round(r * 3))}" fill="#ffffff"/>`
        : `<circle class="${p}-star" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#ffffff"/>`;
    }
    let city = "";
    let x = 148;
    let bi = 0;
    while (x < 692) {
      const w = 46 + R() * 54, h = 70 + R() * 150;
      city += `<rect x="${x.toFixed(1)}" y="${(742 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${bi % 2 ? "#0e1b49" : "#132357"}"/>`;
      for (let wy = 742 - h + 16; wy < 730; wy += 26) {
        for (let wx = x + 9; wx < x + w - 12; wx += 18) {
          if (R() < 0.42) city += `<rect class="${p}-cw" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="8" height="11" fill="#ffd56a"/>`;
        }
      }
      x += w + 4;
      bi++;
    }
    // tree tiers
    const tiers = [
      [680, 596, 92, 790], [680, 690, 118, 940], [680, 820, 148, 1110], [680, 968, 170, 1282],
    ];
    let tree = `<rect x="660" y="1262" width="40" height="40" fill="#7a4e33"/>`;
    tiers.forEach(([cx, top, half, base]) => {
      tree += `<path d="M${cx} ${top} L${cx - half} ${base} Q${cx} ${base + 18} ${cx + half} ${base} Z" fill="#1f6b47"/>`;
      tree += `<path d="M${cx} ${top} L${cx + half} ${base} Q${cx + half * 0.5} ${base + 12} ${cx + 8} ${base + 14} Z" fill="#185a3b"/>`;
    });
    const garlands = [
      [[612, 760], [700, 740], [752, 724]], [[590, 900], [680, 880], [770, 860]],
      [[560, 1060], [680, 1036], [800, 1010]], [[548, 1230], [680, 1204], [820, 1180]],
    ];
    let lights = "";
    let li = 0;
    garlands.forEach((g) => {
      lights += `<path d="M${g[0][0]} ${g[0][1]} Q${g[1][0]} ${g[1][1] + 24} ${g[2][0]} ${g[2][1]}" stroke="#f3d99a" stroke-width="3" fill="none" opacity=".8"/>`;
      for (let k = 0; k <= 6; k++) {
        const t = k / 6;
        const lx = (1 - t) * (1 - t) * g[0][0] + 2 * (1 - t) * t * g[1][0] + t * t * g[2][0];
        const ly = (1 - t) * (1 - t) * g[0][1] + 2 * (1 - t) * t * (g[1][1] + 24) + t * t * g[2][1];
        lights += `<circle class="${p}-light" id="${p}-light${li}" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="7.5" fill="${li % 3 ? "#ffe27a" : "#fff6d6"}"/>`;
        li++;
      }
    });
    const balls = [[640, 830, "#c8504a"], [722, 1000, "#2f8fa0"], [604, 1150, "#d9a640"], [760, 1220, "#c8504a"], [700, 900, "#d9a640"], [596, 990, "#2f8fa0"]]
      .map(([bx, by, c]) => `<circle cx="${bx}" cy="${by}" r="13" fill="${c}"/><circle cx="${bx - 4}" cy="${by - 4}" r="4" fill="#fff" opacity=".55"/>`)
      .join("");
    const stockings = [[78, "#c8504a"], [150, "#2f8fa0"], [222, "#4f9a5a"]]
      .map(([sx, c]) => `<path d="M${sx} 850 h34 v62 q0 22 -22 22 h-26 q-14 0 -14 -12 q0 -12 14 -12 h14 Z" fill="${c}"/><rect x="${sx - 4}" y="846" width="42" height="18" rx="6" fill="#fff8ec"/>`)
      .join("");
    const under = [
      gift(p + "-ug0", 548, 1222, 92, 70, "#c8504a", "#f3e3c6", true),
      gift(p + "-ug1", 650, 1236, 76, 56, "#4f63b8", "#e9edf8", true),
      gift(p + "-ug2", 738, 1214, 86, 78, "#d9a640", "#fff4dc", true),
      gift(p + "-ug3", 610, 1268, 64, 36, "#5e9a5a", "#eef6e6", false),
    ].join("");
    return `
<svg viewBox="${viewBox || "0 0 840 1494"}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${p}-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#101d55"/><stop offset=".7" stop-color="#22398e"/><stop offset="1" stop-color="#2c4aa6"/>
    </linearGradient>
    <clipPath id="${p}-glass"><path d="M148 742 L148 330 A272 272 0 0 1 692 330 L692 742 Z"/></clipPath>
    <mask id="${p}-moonM"><rect x="420" y="340" width="300" height="230" fill="#fff"/><circle cx="582" cy="434" r="44" fill="#000"/></mask>
    <radialGradient id="${p}-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffd76a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${p}-fireGlow" cx="50%" cy="60%" r="50%">
      <stop offset="0" stop-color="#ffb347" stop-opacity=".75"/><stop offset="1" stop-color="#ff7a2a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="840" height="1494" fill="#fbefd6"/>
  ${stripes}
  <path d="M130 760 L130 330 A290 290 0 0 1 710 330 L710 760 Z" fill="#fffaf0"/>
  <path d="M148 742 L148 330 A272 272 0 0 1 692 330 L692 742 Z" fill="url(#${p}-sky)"/>
  <g clip-path="url(#${p}-glass)">
    ${stars}
    <circle id="${p}-moonGlow" cx="560" cy="450" r="100" fill="url(#${p}-glow)" opacity=".45"/>
    <circle cx="560" cy="450" r="48" fill="#ffe08a" mask="url(#${p}-moonM)"/>
    <g id="${p}-city">${city}</g>
    <rect x="411" y="30" width="18" height="720" fill="#fffaf0"/>
    <rect x="140" y="520" width="560" height="18" fill="#fffaf0"/>
  </g>
  <rect x="112" y="742" width="616" height="30" rx="8" fill="#fff3dc"/>
  <rect x="112" y="768" width="616" height="8" fill="#e8d6b2"/>
  <!-- fireplace -->
  <rect x="48" y="852" width="264" height="450" fill="#ead7b9"/>
  <rect x="48" y="852" width="264" height="450" fill="none" stroke="#d7c09c" stroke-width="6"/>
  <path d="M100 1302 V1052 A80 80 0 0 1 260 1052 V1302 Z" fill="#3b2b26"/>
  <ellipse id="${p}-fireGlowE" cx="180" cy="1250" rx="110" ry="80" fill="url(#${p}-fireGlow)"/>
  <rect x="118" y="1268" width="124" height="18" rx="9" fill="#6e4430" transform="rotate(-8 180 1277)"/>
  <rect x="118" y="1268" width="124" height="18" rx="9" fill="#7c4f38" transform="rotate(9 180 1277)"/>
  <g id="${p}-fire">
    <path id="${p}-f1" d="M132 1284 C120 1236 152 1214 160 1166 C178 1196 198 1178 196 1148 C226 1198 246 1236 230 1284 Z" fill="#f0832a"/>
    <path id="${p}-f2" d="M148 1284 C140 1246 162 1232 170 1200 C182 1220 196 1210 196 1190 C214 1226 226 1252 214 1284 Z" fill="#f7b538"/>
    <path id="${p}-f3" d="M164 1284 C160 1262 172 1250 178 1230 C186 1244 196 1240 196 1228 C206 1250 210 1266 202 1284 Z" fill="#ffe27a"/>
  </g>
  <rect x="30" y="818" width="300" height="34" rx="6" fill="#7a5340"/>
  <rect x="30" y="846" width="300" height="8" fill="#5e3f30"/>
  <g id="${p}-candles">
    <rect x="262" y="772" width="20" height="46" rx="4" fill="#fffaf0"/>
    <rect x="292" y="786" width="20" height="32" rx="4" fill="#fffaf0"/>
    <ellipse class="${p}-cflame" cx="272" cy="762" rx="6" ry="11" fill="#ffcf5a"/>
    <ellipse class="${p}-cflame" cx="302" cy="776" rx="6" ry="11" fill="#ffcf5a"/>
  </g>
  ${stockings}
  <!-- floor & rug -->
  <rect x="0" y="1300" width="840" height="194" fill="#c48f5e"/>
  <path d="M0 1350 H840 M0 1410 H840 M0 1466 H840" stroke="#b07c4f" stroke-width="4"/>
  <ellipse cx="410" cy="1398" rx="330" ry="70" fill="#2c8a9c"/>
  <ellipse cx="410" cy="1398" rx="290" ry="52" fill="none" stroke="#5fc0cf" stroke-width="6"/>
  <!-- tree -->
  <g id="${p}-tree">
    ${tree}
    ${lights}
    ${balls}
    <circle id="${p}-treeGlow" cx="680" cy="590" r="70" fill="url(#${p}-glow)"/>
    <path id="${p}-treeStar" d="${star5(680, 590, 36, 15)}" fill="#f7c948" stroke="#fff0b0" stroke-width="3"/>
  </g>
  <g id="${p}-under" ${opts.giftsVisible ? "" : 'opacity="1"'}>${under}</g>
</svg>`;
  }

  /* ------------------------------------------------------------------ Altbau thumbnail (840 × 380) */
  function altbau(p) {
    let win = "";
    const cols = [100, 240, 380, 520, 660];
    [[62, "#3d55b0"], [170, "#f3c34a"], [278, "#3d55b0"]].forEach(([y, c], r) => {
      cols.forEach((x, ci) => {
        if (r === 2 && ci === 2) return;
        const col = r === 1 ? (ci % 2 ? "#f6cf63" : "#f3c34a") : c;
        win += `<path d="M${x} ${y + 70} V${y + 28} A40 28 0 0 1 ${x + 80} ${y + 28} V${y + 70} Z" fill="${col}"/>`;
        win += `<rect x="${x - 6}" y="${y + 68}" width="92" height="9" rx="3" fill="#e2c88f"/>`;
      });
    });
    return `
<svg viewBox="0 0 840 380" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="${p}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2e78"/><stop offset="1" stop-color="#2b47a3"/></linearGradient></defs>
  <rect width="840" height="380" fill="url(#${p}-sky)"/>
  <rect x="40" y="30" width="760" height="360" fill="#f1dcae"/>
  <rect x="30" y="22" width="780" height="16" rx="4" fill="#e6cd96"/>
  <rect x="30" y="16" width="780" height="8" rx="4" fill="#ffffff"/>
  <rect x="40" y="150" width="760" height="8" fill="#e6cd96"/>
  <rect x="40" y="258" width="760" height="8" fill="#e6cd96"/>
  ${win}
  <path d="M368 380 V316 A52 40 0 0 1 472 316 V380 Z" fill="#6a3f2c"/>
  ${gift(p + "-d1", 330, 338, 52, 42, "#c8504a", "#f3e3c6", false)}
  ${gift(p + "-d2", 390, 350, 58, 30, "#d9a640", "#fff4dc", false)}
  ${gift(p + "-d3", 456, 334, 48, 46, "#3f8f86", "#f3e3c6", false)}
</svg>`;
  }

  /* ------------------------------------------------------------------ cloud penthouse thumbnail (840 × 380) */
  function penthouse(p) {
    const R = rng(23);
    let stars = "";
    for (let i = 0; i < 22; i++) stars += `<circle cx="${(R() * 840).toFixed(1)}" cy="${(R() * 220).toFixed(1)}" r="${(1.4 + R() * 2.2).toFixed(1)}" fill="#fff"/>`;
    let mull = "";
    for (let x = 300; x < 600; x += 40) mull += `<rect x="${x}" y="146" width="6" height="140" fill="#eef5ff"/>`;
    const clouds = [[120, 330, 70], [220, 300, 80], [330, 320, 76], [450, 296, 90], [570, 318, 80], [680, 300, 84], [790, 330, 70], [40, 350, 60]];
    return `
<svg viewBox="0 0 840 380" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="${p}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#142268"/><stop offset="1" stop-color="#2c48aa"/></linearGradient>
  <mask id="${p}-mm"><rect x="600" y="20" width="200" height="160" fill="#fff"/><circle cx="712" cy="80" r="40" fill="#000"/></mask></defs>
  <rect width="840" height="380" fill="url(#${p}-sky)"/>
  ${stars}
  <circle cx="690" cy="96" r="44" fill="#ffe08a" mask="url(#${p}-mm)"/>
  <rect x="250" y="126" width="370" height="20" rx="4" fill="#f4f7ff"/>
  <rect x="270" y="146" width="330" height="146" fill="#bcd6f3"/>
  <rect x="306" y="190" width="70" height="96" fill="#ffe6a0" opacity=".85"/>
  <rect x="466" y="170" width="70" height="116" fill="#ffe6a0" opacity=".7"/>
  ${mull}
  <rect x="250" y="286" width="370" height="16" rx="4" fill="#f4f7ff"/>
  ${circ(clouds.map(([x, y, r]) => [x, y + 6, r]), "#cdd9ef")}
  <rect x="0" y="322" width="840" height="58" fill="#ffffff"/>
  ${circ(clouds, "#ffffff")}
  <g id="${p}-wind" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity="0">
    <path class="${p}-gust" d="M30 120 C140 100 220 150 330 120 C380 106 410 124 400 140"/>
    <path class="${p}-gust" d="M100 220 C210 200 300 250 420 214"/>
    <path class="${p}-gust" d="M420 70 C520 50 600 96 720 64 C760 54 790 70 780 86"/>
  </g>
</svg>`;
  }

  /* ------------------------------------------------------------------ fir branch with lights + bauble (overlay) */
  function branch(p, day) {
    const R = rng(31);
    const twigs = [
      [[64, -40], [170, 6], [318, 30]],
      [[-40, 40], [150, 40], [392, 112]],
      [[-40, 150], [70, 156], [176, 214]],
    ];
    const bez = (g, t) => [
      (1 - t) * (1 - t) * g[0][0] + 2 * (1 - t) * t * g[1][0] + t * t * g[2][0],
      (1 - t) * (1 - t) * g[0][1] + 2 * (1 - t) * t * g[1][1] + t * t * g[2][1],
    ];
    const dark = ["#163d2a", "#1d4a33", "#225539"];
    const light = ["#2a6444", "#33744f", "#3f865b", "#4b9468"];
    let back = "", front = "", snow = "", wood = "";
    twigs.forEach((g, gi) => {
      wood += `<path d="M${g[0][0]} ${g[0][1]} Q${g[1][0]} ${g[1][1]} ${g[2][0]} ${g[2][1]}" stroke="#5b3a26" stroke-width="${gi === 1 ? 8 : 6}" fill="none" stroke-linecap="round"/>`;
      const steps = gi === 1 ? 150 : 110;
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        const [x, y] = bez(g, t);
        const [x2, y2] = bez(g, Math.min(1, t + 0.01));
        const ang = Math.atan2(y2 - y, x2 - x);
        const taper = 1 - t * 0.5;
        for (let n = 0; n < 4; n++) {
          const side = n === 0 ? -1 : n === 1 ? 1 : R() < 0.5 ? -1 : 1;
          const a = ang + side * (0.75 + R() * 0.65) + 0.32;
          const len = (34 + R() * 26) * taper;
          const bx = x + (R() - 0.5) * 4, by = y + (R() - 0.5) * 4;
          const ex = bx + Math.cos(a) * len, ey = by + Math.sin(a) * len;
          const isFront = side > 0 && n < 2;
          const col = isFront ? light[Math.floor(R() * light.length)] : dark[Math.floor(R() * dark.length)];
          const seg = `<path d="M${bx.toFixed(1)} ${by.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="${col}" stroke-width="${(2.6 + R() * 1.6).toFixed(1)}" stroke-linecap="round"/>`;
          if (isFront) front += seg;
          else back += seg;
        }
        if (k % 7 === 2 && R() < 0.75) {
          const deg = (ang * 180) / Math.PI;
          const sx = x + Math.cos(ang - Math.PI / 2) * 9, sy = y + Math.sin(ang - Math.PI / 2) * 9;
          const rx = 10 + R() * 14, ry = 5 + R() * 5;
          snow += `<ellipse cx="${sx.toFixed(1)}" cy="${(sy + 1.5).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#c9d9e3" transform="rotate(${deg.toFixed(1)} ${sx.toFixed(1)} ${sy.toFixed(1)})"/>`;
          snow += `<ellipse cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#f2f7fa" transform="rotate(${deg.toFixed(1)} ${sx.toFixed(1)} ${sy.toFixed(1)})"/>`;
        }
      }
    });
    let lights = "";
    let li = 0;
    [[1, [0.06, 0.18, 0.3, 0.42, 0.55, 0.68, 0.8, 0.92]], [2, [0.2, 0.45, 0.7, 0.92]], [0, [0.35, 0.62, 0.88]]].forEach(([gi, ts]) => {
      ts.forEach((t) => {
        const [x, y] = bez(twigs[gi], t);
        const ox = (R() - 0.5) * 26, oy = 8 + R() * 18;
        lights += `<g class="${p}-fl" id="${p}-fl${li}"><circle cx="${(x + ox).toFixed(1)}" cy="${(y + oy).toFixed(1)}" r="22" fill="url(#${p}-lg)"/><circle cx="${(x + ox).toFixed(1)}" cy="${(y + oy).toFixed(1)}" r="5" fill="#fff6d6"/></g>`;
        li++;
      });
    });
    return `
<svg viewBox="0 0 520 400" width="520" height="400" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${p}-lg" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe7a3" stop-opacity=".95"/><stop offset=".35" stop-color="#ffc861" stop-opacity=".45"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <radialGradient id="${p}-gold" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#fff4c8"/><stop offset=".32" stop-color="#f1cb6c"/><stop offset=".72" stop-color="#c38b2c"/><stop offset="1" stop-color="#6e4710"/></radialGradient>
    <linearGradient id="${p}-cap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a6420"/><stop offset=".5" stop-color="#f3d27c"/><stop offset="1" stop-color="#8a6420"/></linearGradient>
  </defs>
  <g id="${p}-bauble">
    <path d="M250 84 V176" stroke="#d8c18a" stroke-width="2.5"/>
    <rect x="235" y="172" width="30" height="20" rx="4" fill="url(#${p}-cap)"/>
    <circle cx="250" cy="250" r="62" fill="url(#${p}-gold)"/>
    <ellipse cx="228" cy="222" rx="18" ry="10" fill="#ffffff" opacity=".5" transform="rotate(-30 228 222)"/>
    <text x="252" y="277" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="78" fill="#fff0bf" opacity=".55">${day}</text>
    <text x="250" y="275" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="78" fill="#7a4f12" opacity=".82">${day}</text>
  </g>
  ${back}
  ${wood}
  ${front}
  ${snow}
  ${lights}
</svg>`;
  }

  window.SPArt = { rng, angel, attic, loft, altbau, penthouse, branch, gift, letter, sparkle, star5 };
})();
