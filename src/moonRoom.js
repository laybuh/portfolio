export function startMoonRoom(cv, grainCv) {
  const W = 407, H = 204, VX = 24;
  const x = cv.getContext('2d');

  const P = {
    wallA: '#2a1a2c', wallB: '#2e1c30',
    floor: '#1b131f', trim: '#9b5a8c',
    dark: '#221c25', darker: '#171219', mid: '#2c262f',
    pink: '#cf7a93', pinkL: '#e08fa5', pinkD: '#a85a78',
    neon: '#ffe3ec', neonIn: '#ff9fbd',
    curtain: '#3a2539', curtainD: '#2f1d2e',
    night1: '#27254a', night2: '#3b2f5c',
    win: '#e8a64a', moonPale: '#efe2fa'
  };

  const R = (px, py, w, h, col) => { x.fillStyle = col; x.fillRect(px, py, w, h); };
  const dot = (px, py, col) => R(px, py, 1, 1, col);

  function arch(x0, y0, w, h, col) {
    const r = w / 2;
    R(x0, y0 + r, w, h - r, col);
    for (let dy = 0; dy < r; dy++) {
      const dx = Math.sqrt(r*r - (r - dy - 0.5) ** 2);
      R(Math.round(x0 + r - dx), y0 + dy, Math.round(dx * 2), 1, col);
    }
  }

  let _seed = 7;
  const rnd = () => (_seed = (_seed * 16807) % 2147483647) / 2147483647;
  const GX0 = 153, GX1 = 221, GBOT = 72;
  const farB = [], nearB = [], winDots = [], antennas = [], signs = [];
  for (let bx = GX0; bx < GX1;) {
    const w = 5 + Math.floor(rnd() * 6), h = 11 + Math.floor(rnd() * 12);
    farB.push([bx, Math.min(w, GX1 - bx), h]); bx += w - 1;
  }
  for (let bx = GX0; bx < GX1;) {
    const w = Math.min(6 + Math.floor(rnd() * 7), GX1 - bx), h = 6 + Math.floor(rnd() * 11);
    nearB.push([bx, w, h]);
    for (let wx = bx + 1; wx < bx + w - 1; wx += 2)
      for (let wy = GBOT - h + 2; wy < GBOT - 1; wy += 3)
        if (rnd() < .45) winDots.push([wx, wy, rnd() * 6, rnd() < .7 ? 0 : 1]);
    if (w >= 7 && rnd() < .5) antennas.push([bx + (w >> 1), GBOT - h]);
    else if (w >= 6 && rnd() < .5) signs.push([bx + w - 2, GBOT - h + 2]);
    bx += w;
  }
  const winStars = [[158,38],[167,41],[176,37],[192,40],[200,37],[214,41],[162,44],[183,43]];

  let lampOn = true, lampLevel = 1, t = 0;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let wallT = -1;

  const WALL_W = 375, WALL_H = 162;
  const wallImg = x.createImageData(WALL_W, WALL_H);
  const wallR = new Float32Array(WALL_W * WALL_H), wallA = new Float32Array(WALL_W * WALL_H);
  const HCX = 275 - 24, HCY = 40, HUNIT = 34;
  for (let j = 0; j < WALL_H; j++) for (let i = 0; i < WALL_W; i++) {
    const dx = i - HCX, dy = j - HCY;
    const th = Math.atan2(-dy, dx);
    const s = Math.sin(th);
    const rh = Math.max(0.35, 2 - 2 * s + s * Math.sqrt(Math.abs(Math.cos(th))) / (s + 1.4));
    wallR[j * WALL_W + i] = Math.sqrt(dx * dx + dy * dy) / (rh * HUNIT);
    wallA[j * WALL_W + i] = th;
  }
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const SMOKE = [[26, 15, 32], [44, 25, 48], [74, 40, 66], [112, 62, 94], [156, 92, 126]];
  const PURPLE = [[24, 15, 36], [40, 26, 62], [66, 42, 104], [102, 70, 152], [140, 104, 190]];
  function drawSmokeWall() {
    const tt = still ? 0 : t;
    if (wallT >= 0 && (still || tt - wallT < 0.12)) {
      x.putImageData(wallImg, 0, 0);
      return;
    }
    wallT = tt;
    const d = wallImg.data, LV = 10;
    for (let j = 0; j < WALL_H; j++) {
      const fade = 1 - 0.18 * (j / WALL_H), vy = j * 0.03;
      const wv = Math.sin(vy * 1.4 + tt * 0.3) * 0.9;
      for (let i = 0; i < WALL_W; i++) {
        const idx = j * WALL_W + i, rho = wallR[idx], th = wallA[idx], ux = i * 0.03;
        const warp = wv + Math.sin(ux * 1.7 - tt * 0.22) * 0.8;
        const ph = rho * 4.6 - tt * 0.45 + th + warp * 0.7;
        const ph2 = rho * 7.4 - tt * 0.3 + 2 * th + 1.3 + warp * 0.9;
        const f = Math.sin(ph) + 0.45 * Math.sin(ph2);
        let n = Math.pow(Math.min(1, Math.max(0, f / 2.9 + 0.5)), 1.5) * fade;
        n += 0.2 * Math.max(0, 1 - rho) * fade;
        const hd = (rho - (1 + 0.015 * Math.sin(tt * 1.2))) / 0.05;
        n += 0.45 * Math.exp(-hd * hd) * fade;
        n = Math.min(1, Math.floor(Math.min(1, n) * 0.68 * LV + BAYER[(j & 3) * 4 + (i & 3)] / 16) / LV);
        const pos = n * (SMOKE.length - 1), k = Math.min(SMOKE.length - 2, Math.floor(pos)), m = pos - k;
        const c0 = SMOKE[k], c1 = SMOKE[k + 1], p0 = PURPLE[k], p1 = PURPLE[k + 1], o = idx * 4;
        const pm = Math.pow(Math.max(0, Math.sin(rho * 3.3 + tt * 0.25 - th + ux * 0.6)), 3) * 0.26;
        d[o] = (c0[0] + (c1[0] - c0[0]) * m) * (1 - pm) + (p0[0] + (p1[0] - p0[0]) * m) * pm;
        d[o + 1] = (c0[1] + (c1[1] - c0[1]) * m) * (1 - pm) + (p0[1] + (p1[1] - p0[1]) * m) * pm;
        d[o + 2] = (c0[2] + (c1[2] - c0[2]) * m) * (1 - pm) + (p0[2] + (p1[2] - p0[2]) * m) * pm;
        d[o + 3] = 255;
      }
    }
    x.putImageData(wallImg, 0, 0);
  }

  function wall() {
    drawSmokeWall();
    R(0, 0, 24, H, '#0b080d');
    R(24, 162, 375, 34, P.floor);
    R(24, 162, 375, 1, P.trim);
    R(25, 196, 375, 1, P.trim);
    R(399, 0, 1, 197, P.trim);
  }

  function painting() {
    const HEART = [
      '..XXXXX...XXXXX..',
      '.XXXXXXX.XXXXXXX.',
      'XXXXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXXXX',
      'XXXXXXXXXXXXXXXXX',
      '.XXXXXXXXXXXXXXX.',
      '..XXXXXXXXXXXXX..',
      '...XXXXXXXXXXX...',
      '....XXXXXXXXX....',
      '.....XXXXXXX.....',
      '......XXXXX......',
      '.......XXX.......',
      '........X........'
    ];
    R(59, 49, 36, 27, P.pinkD);
    R(60, 50, 34, 25, P.pink);
    R(61, 51, 32, 23, '#2a1f2c');
    x.globalCompositeOperation = 'lighter';
    const hg = x.createRadialGradient(77, 62, 2, 77, 62, 16);
    hg.addColorStop(0, 'rgba(255,110,160,.22)'); hg.addColorStop(1, 'rgba(255,110,160,0)');
    x.fillStyle = hg; x.fillRect(61, 51, 32, 23);
    x.globalCompositeOperation = 'source-over';
    HEART.forEach((row, ry) => {
      for (let rx = 0; rx < row.length; rx++) if (row[rx] === 'X') dot(68 + rx, 55 + ry, ry >= 8 ? '#e0668f' : (ry >= 4 ? '#f27aa4' : '#ff8fb8'));
    });
    [[71,57],[72,57],[70,58],[71,58]].forEach(([hx, hy]) => dot(hx, hy, '#ffd0e0'));
    R(61, 51, 32, 1, 'rgba(0,0,0,.25)');
  }

  function windowScene() {
    const tw = (i) => 0.5 + 0.5 * Math.sin(t * 2 + i * 1.7);
    R(150, 23, 73, 55, P.darker);
    for (let yy = 0; yy < 46; yy++) {
      const k = Math.pow(yy / 45, 1.4);
      R(GX0, 27 + yy, GX1 - GX0 - 1, 1, `rgb(${Math.round(24 + 120 * k)},${Math.round(16 + 36 * k)},${Math.round(54 + 62 * k)})`);
    }
    winStars.forEach(([sx, sy], i) => { x.globalAlpha = .4 + .6 * tw(i); dot(sx, sy, '#e3d6f7'); });
    x.globalAlpha = 1;
    farB.forEach(([bx, bw, bh]) => R(bx, GBOT - bh, bw, bh, '#2a1a40'));
    nearB.forEach(([bx, bw, bh]) => R(bx, GBOT - bh, bw, bh, '#120c20'));
    winDots.forEach(([wx, wy, ph, kind]) => {
      if (Math.sin(t * .6 + ph * 3) > -0.85) dot(wx, wy, kind ? P.win : '#ff9fc5');
    });
    signs.forEach(([sx, sy]) => { R(sx, sy, 1, 6, '#ff71ce'); R(sx + 1, sy + 1, 1, 2, '#ffb3cf'); });
    antennas.forEach(([ax, at]) => {
      R(ax, at - 4, 1, 4, '#120c20');
      x.globalAlpha = .45 + .55 * (0.5 + 0.5 * Math.sin(t * 1.4 + ax));
      dot(ax, at - 4, '#ff71ce');
      x.globalAlpha = 1;
    });
    for (let yy = 27; yy < 34; yy++) R(GX0, yy, GX1 - GX0 - 1, 1, yy % 2 ? '#1f1727' : '#2d2236');
    R(GX0, 34, GX1 - GX0 - 1, 2, '#3a2b44');
    R(GX0, 36, GX1 - GX0 - 1, 1, P.pinkD);
    dot(GX0 + 2, 35, '#ff9fc5'); dot(GX1 - 4, 35, '#ff9fc5');
    R(GX0 + 4, 37, 1, 9, '#3a2b44'); R(GX0 + 3, 46, 3, 2, '#3a2b44');
    R(150, 23, 73, 4, P.darker);
    R(150, 23, 3, 55, P.darker); R(221, 23, 2, 55, P.darker);
    R(150, 72, 73, 5, P.darker);
    R(185, 36, 2, 36, P.darker);
    R(150, 23, 73, 1, '#2b1a2a');
    R(148, 77, 77, 2, '#2e2234');
    R(148, 79, 77, 1, P.pinkD);
  }

  function bed() {
    R(65, 108, 60, 32, P.mid);
    R(64, 109, 62, 30, P.mid);
    R(66, 107, 58, 1, '#3a3340');
    R(68, 120, 22, 11, P.pink); R(69, 119, 20, 1, P.pinkL);
    R(94, 120, 25, 11, P.pink); R(95, 119, 23, 1, P.pinkL);
    R(90, 121, 4, 10, P.pinkD);
    R(61, 132, 67, 10, P.pinkD);
    R(62, 133, 65, 8, P.pink);
    R(61, 131, 67, 1, P.pinkL);
    R(58, 141, 74, 22, P.dark);
    R(58, 141, 74, 2, '#2a242d');
    R(59, 163, 72, 5, P.darker);
    R(60, 168, 8, 3, P.darker); R(122, 168, 8, 3, P.darker);
  }

  function rug() {
    R(135, 165, 78, 21, P.pink);
    R(137, 163, 74, 2, P.pink);
    R(133, 168, 2, 15, P.pink); R(213, 167, 2, 16, P.pink);
    R(137, 186, 74, 1, P.pink);
  }

  function nightstand() {
    R(169, 131, 35, 39, P.mid);
    R(168, 130, 37, 3, '#35303a');
    R(171, 138, 31, 14, P.dark); R(171, 154, 31, 13, P.dark);
    R(184, 144, 5, 1, '#4a444f'); R(184, 160, 5, 1, '#4a444f');
    R(171, 170, 4, 2, P.darker); R(198, 170, 4, 2, P.darker);
  }

  function lamp() {
    const pts = [];
    for (let dy = -10; dy <= 10; dy++) for (let dx = -10; dx <= 10; dx++) {
      const bx = dx + 6, by = dy + 2;
      if (dx * dx + dy * dy <= 100 && bx * bx + by * by > 56) pts.push([dx, dy]);
    }
    const has = new Set(pts.map(([dx, dy]) => dx + ',' + dy));
    if (lampOn) {
      x.globalCompositeOperation = 'lighter';
      const g = x.createRadialGradient(180, 115, 2, 180, 115, 18);
      g.addColorStop(0, 'rgba(255,113,206,.35)'); g.addColorStop(1, 'rgba(255,113,206,0)');
      x.fillStyle = g; x.fillRect(160, 95, 40, 40);
      x.globalCompositeOperation = 'source-over';
    }
    pts.forEach(([dx, dy]) => {
      const edge = !has.has((dx + 1) + ',' + dy) || !has.has((dx - 1) + ',' + dy) || !has.has(dx + ',' + (dy + 1)) || !has.has(dx + ',' + (dy - 1));
      if (edge) dot(178 + dx, 115 + dy, lampOn ? '#ff9fd0' : '#5a3a50');
    });
    R(177, 125, 2, 2, '#4a4350');
    R(173, 127, 11, 3, '#2c262f'); R(173, 127, 11, 1, '#4a4350');
  }

  function mirror() {
    arch(227, 108, 31, 60, '#171219');
    arch(229, 110, 27, 56, '#2a2230');
    arch(231, 112, 23, 52, '#c98a9d');
    [[235,130],[236,129],[237,128],[238,127],[235,135],[236,134],[237,133]].forEach(([a, b]) => dot(a, b, '#e3aab9'));
    R(226, 166, 33, 2, '#171219');
    R(224, 160, 3, 8, '#171219'); R(258, 160, 3, 8, '#171219');
  }

  function dresser() {
    R(286, 128, 87, 1, '#4a4350');
    R(287, 129, 85, 2, '#35303a');
    R(287, 131, 85, 1, P.darker);
    x.globalAlpha = .75; R(289, 132, 81, 1, '#cf7a93'); x.globalAlpha = 1;
    x.globalCompositeOperation = 'lighter';
    const dg = x.createLinearGradient(0, 133, 0, 142);
    dg.addColorStop(0, 'rgba(207,122,147,.14)'); dg.addColorStop(1, 'rgba(207,122,147,0)');
    x.fillStyle = dg; x.fillRect(289, 133, 81, 9);
    x.globalCompositeOperation = 'source-over';
    R(292, 133, 4, 37, '#2c262f'); R(292, 133, 1, 37, '#3a3340');
    R(363, 133, 4, 37, '#2c262f'); R(363, 133, 1, 37, '#3a3340');
    R(292, 153, 75, 2, '#2c262f'); R(292, 153, 75, 1, '#3a3340');
    R(291, 170, 6, 2, P.darker); R(362, 170, 6, 2, P.darker);
    R(338, 133, 24, 20, '#2c262f');
    R(340, 135, 20, 7, '#221c25'); R(347, 138, 6, 1, '#4a4350');
    R(340, 144, 20, 7, '#221c25'); R(347, 147, 6, 1, '#4a4350');
    R(302, 144, 24, 9, '#25202a'); R(302, 144, 24, 1, '#3a3340');
    R(304, 147, 17, 1, '#1c171e'); R(304, 149, 17, 1, '#1c171e');
    dot(323, 146, '#cf7a93');
    R(297, 134, 1, 36, '#171219'); R(297, 170, 5, 1, '#171219');
    const OX = 309, OY = 103;
    const L = (lx, ly, w, h, col) => R(OX + lx, OY + ly, w, h, col);
    const LD = (lx, ly, col) => dot(OX + lx, OY + ly, col);
    R(307, 101, 45, 26, '#0a070c');
    R(307, 101, 45, 1, '#3a3340');

    for (let ly = 3; ly < 21; ly++) {
      const k = (ly - 3) / 17;
      L(0, ly, 41, 1, `rgb(${Math.round(16 + 34 * k)},${Math.round(9 + 8 * k)},${Math.round(22 + 16 * k)})`);
    }
    const bloom = (bx, by, br, al, col) => {
      x.globalAlpha = al;
      for (let ly = Math.max(3, by - br); ly <= Math.min(20, by + br); ly++)
        for (let lx = Math.max(0, bx - br); lx <= Math.min(40, bx + br); lx++)
          if ((lx - bx) ** 2 + (ly - by) ** 2 <= br * br) LD(lx, ly, col);
      x.globalAlpha = 1;
    };
    bloom(20, 24, 14, .22, '#cf7a93'); bloom(20, 24, 9, .22, '#cf7a93'); bloom(38, 4, 6, .12, '#cf7a93');
    LD(5, 17, '#d99aae');

    L(0, 0, 41, 2, '#08060a'); L(0, 2, 41, 1, '#cf7a93');
    LD(1, 0, '#cf7a93'); LD(3, 0, '#cf7a93'); L(1, 1, 3, 1, '#cf7a93');
    L(6, 1, 3, 1, '#d99aae'); L(10, 1, 4, 1, '#d99aae'); L(15, 1, 3, 1, '#d99aae'); L(19, 1, 3, 1, '#d99aae');
    L(33, 0, 4, 2, '#cf7a93'); LD(37, 0, '#cf7a93'); L(38, 1, 2, 1, '#f0ccd7');

    L(2, 4, 5, 4, '#cf7a93'); L(2, 4, 2, 1, '#e08fa5'); L(2, 5, 5, 1, '#e6b0c0'); L(2, 8, 5, 1, '#d99aae');
    L(2, 10, 4, 5, '#cf7a93'); L(3, 11, 2, 3, '#140e18'); LD(3, 12, '#e08fa5'); L(2, 15, 5, 1, '#d99aae');
    for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++)
      if (dx * dx + dy * dy <= 9.5 && (dx - 2) ** 2 + (dy + 1) ** 2 > 6) LD(37 + dx, 9 + dy, '#efe2fa');

    x.globalAlpha = .55; L(13, 5, 21, 11, '#000000'); x.globalAlpha = 1;
    L(12, 4, 21, 2, '#cf7a93'); L(12, 5, 21, 1, '#a85a78');
    LD(13, 4, '#08060a'); LD(15, 4, '#f0ccd7'); LD(17, 4, '#d99aae'); L(22, 4, 8, 1, '#f0ccd7');
    L(12, 6, 21, 9, '#140e18');
    L(14, 13, 9, 1, '#3a2536');
    for (let i = 0; i < 5; i++) {
      const h = 2 + Math.round(2 + 2 * Math.sin(t * 0.5 + i * 1.3));
      L(14 + i * 2, 13 - h, 1, h, i % 2 ? '#d99aae' : '#cf7a93');
    }
    L(14, 14, 9, 1, '#47303f');
    L(25, 7, 5, 5, '#2a1a2c');
    LD(26, 8, '#cf7a93'); LD(28, 8, '#cf7a93'); L(26, 9, 3, 1, '#cf7a93'); LD(27, 10, '#cf7a93');
    for (let i = 0; i < 2; i++) { const h = 1 + Math.floor(1.5 + 1.5 * Math.sin(t * 1.3 + i * 1.7)); L(31 + i, 11 - h, 1, h, '#e08fa5'); }
    L(24, 13, 8, 1, '#3a2536');
    L(24, 13, 1 + Math.floor(((t * 0.4) % 1) * 7), 1, '#cf7a93');
    L(24, 14, 5, 1, '#5a3a50');

    x.globalAlpha = .55; L(9, 14, 15, 7, '#000000'); x.globalAlpha = 1;
    L(8, 13, 16, 2, '#e08fa5'); L(8, 14, 16, 1, '#a85a78');
    LD(9, 13, '#08060a'); L(11, 13, 5, 1, '#f0ccd7'); LD(22, 13, '#08060a');
    L(8, 15, 16, 6, '#140e18');
    L(10, 16, 10, 1, '#5a3a50'); L(10, 18, 6, 1, '#3a2536');
    if (Math.floor(t * 2) % 2) LD(17, 18, '#e08fa5');

    R(303, 127, 53, 1, '#4a4350');
    R(325, 127, 9, 1, '#2c262f');
    x.globalCompositeOperation = 'lighter';
    const lg = x.createRadialGradient(329, 114, 2, 329, 114, 34);
    lg.addColorStop(0, 'rgba(207,122,147,.10)'); lg.addColorStop(1, 'rgba(207,122,147,0)');
    x.fillStyle = lg; x.fillRect(290, 80, 80, 60);
    x.globalCompositeOperation = 'source-over';
  }

  const GW = 36, GH = 62;
  const GIRL_COLORS = {
    hair: '#2a1f21', ink: '#0b0809',
    skin: '#b39169', skinSh: '#9e7e55', blush: '#b28562',
    lip: '#8b4a2f', lip2: '#a45f3e', gloss: '#cf9570', iris: '#4a2f2c', white: '#e5e5f2', brow: '#3a2420',
    top: '#f8b9d6', topSh: '#d998a0', trim: '#b2709a', tee: '#2a232f', teeSh: '#17131b', teeTrim: '#4a4350',
    skirt: '#1f1a24', skirtHi: '#4a4350', skirtDk: '#121016', sock: '#ffe9f2', shoe: '#2b1b30'
  };
  function outline(g, C) {
    const out = [];
    for (let yy = 0; yy < GH; yy++) for (let xx = 0; xx < GW; xx++) if (g[yy][xx]) {
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx, dy]) => {
        const nx = xx + dx, ny = yy + dy;
        if (nx >= 0 && nx < GW && ny >= 0 && ny < GH && !g[ny][nx]) out.push([nx, ny]);
      });
    }
    out.forEach(([xx, yy]) => { g[yy][xx] = C.ink; });
  }
  function buildGirl(blink, step) {
    const g = Array.from({ length: GH }, () => Array(GW).fill(null));
    const px = (xx, yy, c) => { if (xx >= 0 && xx < GW && yy >= 0 && yy < GH) g[yy][xx] = c; };
    const rect = (xx, yy, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(xx + i, yy + j, c); };
    const ell = (cx, cy, rx, ry, c) => {
      for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++)
        for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++)
          if (((i - cx) / rx) ** 2 + ((j - cy) / ry) ** 2 <= 1) px(i, j, c);
    };
    const C = { ...GIRL_COLORS };
    const xb = (yy) => 14 + (yy - 6) * 1.5;

    ell(17.5, 11, 12.5, 11, C.hair);
    for (let yy = 14; yy <= 30; yy++) {
      const t0 = yy - 14;
      const cl = 8 + 2.2 * Math.sin(t0 * 0.6);
      const cr = 27 + 2.2 * Math.sin(t0 * 0.6 + 2.2) + (yy >= 24 ? (yy - 24) * 0.4 : 0);
      const hw = yy >= 27 ? 2.6 - (yy - 26) * 0.65 : 2.6;
      for (let xx = Math.round(cl - hw); xx <= Math.round(cl + hw); xx++) px(xx, yy, C.hair);
      for (let xx = Math.round(cr - hw); xx <= Math.round(cr + hw); xx++) px(xx, yy, C.hair);
    }

    rect(8, 16, 20, 12, C.hair);
    rect(16, 22, 4, 4, C.skin);
    for (let yy = 26; yy <= 36; yy++) rect(yy === 26 ? 12 : 11, yy, yy === 26 ? 12 : 14, 1, C.tee);
    rect(11, 29, 6, 2, '#3a3340'); rect(19, 29, 6, 2, '#3a3340'); rect(11, 32, 6, 1, C.teeSh); rect(19, 32, 6, 1, C.teeSh);
    rect(11, 36, 14, 1, C.teeSh);
    rect(11, 33, 1, 4, null); rect(24, 33, 1, 4, null);
    [[26, 14, 21], [27, 15, 20], [28, 16, 19]].forEach(([yy, a, b]) => {
      rect(a, yy, b - a + 1, 1, C.skin); px(a - 1, yy, C.teeTrim); px(b + 1, yy, C.teeTrim);
    });
    for (let r = 0; r < 9; r++) {
      const sx0 = 11 - Math.floor(r * 0.5) + (r === 0 ? 1 : 0), sx1 = 24 + Math.floor(r * 0.5) - (r === 0 ? 1 : 0);
      rect(sx0, 37 + r, sx1 - sx0 + 1, 1, r === 8 ? C.skirtHi : C.skirt);
      if (r >= 1 && r < 8) for (let i = sx0 + 2; i < sx1; i += 4) px(i, 37 + r, C.skirtDk);
    }
    rect(8, 27, 4, 4, C.tee); rect(24, 27, 4, 4, C.tee);
    rect(8, 30, 4, 1, C.teeSh); rect(24, 30, 4, 1, C.teeSh);
    rect(9, 31, 2, 9, C.skin); rect(25, 31, 2, 9, C.skin);
    rect(9, 38, 2, 2, C.skin); rect(25, 38, 2, 2, C.skin);
    const leg = (lx, sx, lift) => {
      rect(lx, 46, 3, 5 - lift, C.skin);
      rect(lx, 51 - lift, 3, 4, '#1f1a24'); rect(lx, 51 - lift, 3, 1, '#3a3340');
      rect(sx, 55 - lift, 5, 2, '#15111a'); rect(sx, 56 - lift, 5, 1, '#3a3340');
    };
    leg(14, 12, step === 1 ? 2 : 0); leg(19, 19, step === 2 ? 2 : 0);
    rect(12, 46, 12, 3, C.skin); rect(13, 49, 10, 1, C.skin); rect(17, 46, 1, 4, C.ink); rect(18, 46, 1, 4, C.skinSh);

    ell(17.5, 13.5, 7.5, 8.5, C.skin);
    for (let yy = 4; yy <= 22; yy++) for (let xx = 9; xx <= 26; xx++) {
      if (((xx - 17.5) / 7.5) ** 2 + ((yy - 13.5) / 8.5) ** 2 > 1) continue;
      if (yy <= 6 || (yy <= 13 && xx >= xb(yy))) px(xx, yy, C.hair);
    }
    rect(15, 23, 6, 1, C.skinSh);
    const vis = (xx, yy) => !(yy <= 13 && xx >= xb(yy));
    const eyePx = (xx, yy, c) => { if (vis(xx, yy)) px(xx, yy, c); };
    rect(11, 10, 3, 1, C.brow);
    const eyeCol = (k) => k === 'W' ? C.white : (k === 'H' ? '#ffffff' : C.iris);
    if (blink) {
      for (let i = 0; i < 4; i++) { eyePx(11 + i, 13, C.ink); eyePx(21 + i, 13, C.ink); }
    } else {
      for (let i = 0; i < 4; i++) { eyePx(11 + i, 12, C.ink); eyePx(21 + i, 12, C.ink); }
      px(10, 12, C.ink); px(10, 11, C.ink);
      [['W','E','H','E'], ['W','E','E','E']].forEach((row, j) => row.forEach((k, i) => px(11 + i, 13 + j, eyeCol(k))));
      [['E','H','E','W'], ['E','E','E','W']].forEach((row, j) => row.forEach((k, i) => eyePx(21 + i, 13 + j, eyeCol(k))));
    }
    rect(11, 15, 3, 2, C.blush); rect(22, 15, 3, 2, C.blush);
    px(17, 16, C.skinSh); px(18, 16, C.skinSh);
    rect(16, 18, 4, 1, C.lip); rect(16, 19, 4, 1, C.lip2); px(17, 19, C.gloss);



    outline(g, C);
    return g;
  }
  function buildGirlSide(blink, step, bangs) {
    const g = Array.from({ length: GH }, () => Array(GW).fill(null));
    const OFF = 6;
    const px = (xx, yy, c) => { const X = xx + OFF; if (X >= 0 && X < GW && yy >= 0 && yy < GH) g[yy][X] = c; };
    const rect = (xx, yy, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(xx + i, yy + j, c); };
    const ell = (cx, cy, rx, ry, c) => {
      for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++)
        for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++)
          if (((i - cx) / rx) ** 2 + ((j - cy) / ry) ** 2 <= 1) px(i, j, c);
    };
    const C = { ...GIRL_COLORS };
    C.lite = '#e2c699'; C.iris = '#4a2f2c'; C.brow = '#4a3330';
    const nearSw = step === 2 ? 2 : -2;
    rect(15, 29, 2, 6, C.skin); rect(15 - nearSw, 34, 2, 5, C.skin);
    ell(14, 10, 10.8, 10, C.hair);
    const RE = { 12: 22, 13: 23, 14: 24, 15: 24, 16: 25, 17: 25, 18: 24, 19: 23, 20: 23, 21: 24, 22: 25, 23: 25, 24: 25, 25: 25,
                 26: 24, 27: 24, 28: 23, 29: 21, 30: 19 };
    for (let yy = 12; yy <= 30; yy++) for (let xx = 12; xx <= RE[yy] + Math.round(1.3 * Math.sin(yy * 1.1)); xx++) px(xx, yy, C.hair);
    [[14, 31], [15, 31], [18, 31], [19, 31], [22, 30], [23, 30]].forEach(([xx, yy]) => px(xx, yy, C.hair));
    rect(11, 21, 4, 8, C.skin); rect(11, 21, 4, 2, C.skinSh); rect(14, 23, 1, 6, C.skinSh);
    rect(8, 26, 8, 11, C.tee); rect(8, 36, 8, 1, C.teeSh);
    rect(6, 29, 2, 3, C.tee); px(7, 28, C.tee); rect(5, 30, 1, 2, C.tee); rect(7, 29, 2, 1, '#3a3340'); rect(6, 32, 4, 1, C.teeSh);
    rect(8, 33, 1, 4, null); rect(15, 33, 1, 4, null);
    const sway = step === 2 ? 1 : -1;
    for (let r = 0; r < 9; r++) {
      const sx0 = 7 - Math.floor(r * 0.5) + (r >= 4 ? sway : 0) + (r === 0 ? 1 : 0), sx1 = 16 + Math.floor(r * 0.5) + (r >= 4 ? sway : 0) - (r === 0 ? 1 : 0);
      rect(sx0, 37 + r, sx1 - sx0 + 1, 1, r === 8 ? C.skirtHi : C.skirt);
      if (r >= 1 && r < 8) for (let i = sx0 + 2; i < sx1; i += 4) px(i, 37 + r, C.skirtDk);
    }
    const leg = (lx, lift) => {
      rect(lx, 46, 3, 5 - lift, C.skin); rect(lx - 1, 46, 5, 3, C.skin); rect(lx, 49, 4, 1, C.skin);
      rect(lx, 51 - lift, 3, 4, '#1f1a24'); rect(lx, 51 - lift, 3, 1, '#3a3340');
      rect(lx - 2, 55 - lift, 5, 2, '#15111a'); rect(lx - 2, 56 - lift, 5, 1, '#3a3340');
    };
    if (step === 1) { leg(13, 0); leg(6, 0); } else if (step === 2) { leg(10, 1); leg(9, 0); } else { leg(12, 0); leg(7, 0); }
    if (step === 1) rect(6, 46, 10, 3, C.skin);
    if (step !== 2) rect(11, 46, 1, 5, C.ink);
    rect(10, 27, 4, 4, C.tee); rect(10, 30, 4, 1, C.teeSh);
    rect(11, 31, 2, 4, C.skin); rect(11 + nearSw, 35, 2, 5, C.skin);
    rect(Math.min(11, 11 + nearSw), 34, 2 + Math.abs(nearSw), 1, C.skin);

    const FR = { 9: 7, 10: 6, 11: 6, 12: 6, 13: 6, 14: 6, 15: 5, 16: 6, 17: 7, 18: 7, 19: 7, 20: 8, 21: 10, 22: 12 };
    for (let r = 9; r <= 22; r++) for (let xx = FR[r]; xx <= (r <= 16 ? 11 : 13); xx++) px(xx, r, C.skin);
    if (bangs) {
      for (let xx = 6; xx < 16; xx++) px(xx, 8, C.hair);
      for (let xx = 8; xx < 16; xx++) px(xx, 9, C.hair);
      for (let xx = 10; xx < 16; xx++) px(xx, 10, C.hair);
    } else {
      for (let xx = 7; xx <= 11; xx++) px(xx, 8, C.skin);
      for (let xx = 12; xx < 16; xx++) { px(xx, 8, C.hair); px(xx, 9, C.hair); px(xx, 10, C.hair); }
    }
    for (let r = 11; r <= 13; r++) for (let xx = 11; xx < 16; xx++) px(xx, r, C.hair);
    for (let r = 14; r <= 16; r++) for (let xx = 12; xx < 16; xx++) px(xx, r, C.hair);
    px(12, 17, C.hair); px(12, 18, C.hair);
    rect(7, 10, 2, 1, C.brow);
    if (blink) {
      rect(7, 12, 4, 1, C.ink);
    } else {
      rect(7, 11, 4, 1, C.ink);
      [['E','H','E','W'], ['E','E','E','W']].forEach((row, j) => row.forEach((k, i) =>
        px(7 + i, 12 + j, k === 'W' ? C.white : (k === 'H' ? '#ffffff' : C.iris))));
    }
    rect(9, 14, 2, 2, C.blush);
    px(7, 17, C.lip2);
    for (let r = 17; r <= 28; r++) {
      const cx = 14 + 1.8 * Math.sin((r - 17) * 0.9);
      const w = r >= 26 ? 2 : 3;
      for (let xx = Math.round(cx - w / 2 + 0.5); xx <= Math.round(cx + w / 2 - 0.5 + 0.5); xx++) px(xx, r, C.hair);
    }
    rect(11, 28, 3, 1, C.hair); rect(10, 29, 3, 1, C.hair); px(10, 30, C.hair);
    outline(g, C);
    return g;
  }
  const girlGrids = {};
  const flipGrid = (g) => g.map(row => row.slice().reverse());
  const girlGrid = (blink, step, face) => {
    const k = (blink ? 1 : 0) + '-' + (face ? step : 0) + '-' + face;
    if (!girlGrids[k]) girlGrids[k] = face === 0 ? buildGirl(blink, 0) : (face < 0 ? buildGirlSide(blink, step, true) : flipGrid(buildGirlSide(blink, step, false)));
    return girlGrids[k];
  };

  let girlX = 199, girlTarget = 199, girlLastT = 0, girlHopT = -10, girlPing = null, girlFace = 0;
  const GIRL_Y = 132;
  const girlWalking = () => Math.abs(girlTarget - girlX) > 0.5;
  const moveGirlTo = (cx) => {
    girlTarget = Math.min(364, Math.max(24, cx - 17.5));
    girlPing = { x: cx, t };
  };
  function girl() {
    const dt = Math.min(0.12, Math.max(0, t - girlLastT)); girlLastT = t;
    if (girlWalking()) {
      const d = girlTarget - girlX;
      girlX += Math.sign(d) * Math.min(Math.abs(d), 52 * dt);
    } else girlX = girlTarget;
    const walking = girlWalking();
    girlFace = walking ? Math.sign(girlTarget - girlX) : 0;
    const step = walking ? (Math.floor(t * 4) % 2 ? 1 : 2) : 0;
    const hopAge = t - girlHopT;
    const hop = hopAge >= 0 && hopAge < 0.5 ? Math.round(5 * Math.sin(hopAge / 0.5 * Math.PI)) : 0;
    const gx = Math.round(girlX), gy = GIRL_Y - hop;

    if (girlPing && t - girlPing.t < 0.9) {
      const age = (t - girlPing.t) / 0.9, rad = Math.round(2 + age * 9);
      x.globalAlpha = 1 - age;
      R(Math.round(girlPing.x) - rad, 187, rad * 2, 1, '#cf7a93');
      R(Math.round(girlPing.x) - rad + 2, 188, Math.max(1, rad * 2 - 4), 1, '#cf7a93');
      x.globalAlpha = 1;
    }
    x.fillStyle = 'rgba(8,3,12,.35)';
    x.fillRect(gx + 9, GIRL_Y + 57, 18, 1); x.fillRect(gx + 11, GIRL_Y + 58, 14, 1);
    const g = girlGrid((t % 4.6) < 0.15, step, girlFace);
    for (let yy = 0; yy < GH; yy++) for (let xx = 0; xx < GW; xx++) {
      if (g[yy][xx]) { x.fillStyle = g[yy][xx]; x.fillRect(gx + xx, gy + yy, 1, 1); }
    }
    if (hopAge >= 0 && hopAge < 1.4) {
      x.globalAlpha = 1 - hopAge / 1.4;
      const hy = Math.round(gy - 8 - hopAge * 8);
      [[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[4,1],[1,2],[2,2],[3,2],[2,3]].forEach(([hx, hyy]) => dot(gx + 15 + hx, hy + hyy, '#e08fa5'));
      x.globalAlpha = 1;
    }
  }

  function lighting() {
    let g;

    if (lampLevel > 0.02) {
      x.globalCompositeOperation = 'lighter';
      g = x.createRadialGradient(186, 124, 2, 186, 124, 62);
      g.addColorStop(0, `rgba(255,110,140,${.30 * lampLevel})`);
      g.addColorStop(1, 'rgba(255,110,140,0)');
      x.fillStyle = g; x.fillRect(118, 70, 140, 120);
      x.globalCompositeOperation = 'source-over';
    }
    x.fillStyle = `rgba(8,3,12,${.38 * (1 - lampLevel)})`;
    x.fillRect(0, 0, W, H);
  }

  let last = 0, raf = 0;
  function frame(ms) {
    raf = requestAnimationFrame(frame);
    if (ms - last < 66) return;
    last = ms; t = ms / 1000;
    lampLevel += ((lampOn ? 1 : 0) - lampLevel) * 0.25;

    x.setTransform(1, 0, 0, 1, -VX, 0);
    x.clearRect(0, 0, W, H);
    wall();
    x.save(); x.translate(18, 0); painting(); x.restore();
    windowScene();
    x.save(); x.translate(0, 3); bed(); x.restore();
    x.save(); x.translate(11, 0); rug(); x.restore();
    nightstand();
    x.save(); x.translate(8, 0); lamp(); x.restore();
    x.save(); x.translate(4, 0); mirror(); x.restore();
    dresser();
    girl();
    lighting();
  }
  raf = requestAnimationFrame(frame);

  const HOTSPOTS = [
    { x0: 58, x1: 132, y0: 108, y1: 175, cx: 95 },
    { x0: 77, x1: 113, y0: 49, y1: 76, cx: 95 },
    { x0: 148, x1: 225, y0: 23, y1: 80, cx: 186.5 },
    { x0: 169, x1: 204, y0: 130, y1: 172, cx: 186.5 },
    { x0: 228, x1: 269, y0: 108, y1: 168, cx: 249 },
    { x0: 290, x1: 368, y0: 22, y1: 54, cx: 329.5 },
    { x0: 286, x1: 373, y0: 100, y1: 172, cx: 329.5 }
  ];
  const onClick = (e) => {
    const r = cv.getBoundingClientRect();
    const px = VX + (e.clientX - r.left) / r.width * cv.width;
    const py = (e.clientY - r.top) / r.height * cv.height;
    const gx = Math.round(girlX);
    if (px >= gx + 4 && px <= gx + 33 && py >= GIRL_Y - 6 && py <= GIRL_Y + 58) {
      girlHopT = t;
    } else if (px >= 175 && px <= 197 && py >= 104 && py <= 132) {
      lampOn = !lampOn;
    } else {
      const hs = HOTSPOTS.find(h => px >= h.x0 && px <= h.x1 && py >= h.y0 && py <= h.y1);
      moveGirlTo(hs ? hs.cx : px);
    }
  };
  cv.addEventListener('click', onClick);

  const gc = grainCv.getContext('2d');
  const img = gc.createImageData(grainCv.width, grainCv.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i+1] = img.data[i+2] = v;
    img.data[i+3] = Math.random() < .5 ? 255 : 0;
  }
  gc.putImageData(img, 0, 0);

  return {
    walkTo: moveGirlTo,
    placeAt(cx) {
      girlX = girlTarget = Math.min(364, Math.max(24, cx - 17.5));
    },
    stop() {
      cancelAnimationFrame(raf);
      cv.removeEventListener('click', onClick);
    }
  };
}
