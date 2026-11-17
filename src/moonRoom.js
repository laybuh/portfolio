import paintingUrl from './assets/moonroom/painting.png';
import windowUrl from './assets/moonroom/window.png';
import bedUrl from './assets/moonroom/bed.png';
import rugUrl from './assets/moonroom/rug.png';
import nightstandUrl from './assets/moonroom/nightstand.png';
import lampOnUrl from './assets/moonroom/lamp-on.png';
import lampOffUrl from './assets/moonroom/lamp-off.png';
import mirrorUrl from './assets/moonroom/mirror.png';
import deskUrl from './assets/moonroom/desk.png';
import girlUrl from './assets/moonroom/girl.png';

export function startMoonRoom(cv, grainCv) {
  const W = 407, H = 204, VX = 24;
  const x = cv.getContext('2d');
  const loadPic = (src) => { const i = new Image(); i.src = src; return i; };
  const PICS = {
    painting: [loadPic(paintingUrl), 77, 49],
    window: [loadPic(windowUrl), 148, 23],
    bed: [loadPic(bedUrl), 58, 110],
    rug: [loadPic(rugUrl), 144, 163],
    nightstand: [loadPic(nightstandUrl), 168, 130],
    lampOn: [loadPic(lampOnUrl), 178, 105],
    lampOff: [loadPic(lampOffUrl), 178, 105],
    mirror: [loadPic(mirrorUrl), 228, 108],
    desk: [loadPic(deskUrl), 286, 128]
  };
  const girlPic = loadPic(girlUrl);
  const ready = (i) => i.complete && i.naturalWidth;
  const pic = (k) => { const [i, px, py] = PICS[k]; if (ready(i)) x.drawImage(i, px, py); };

  const P = { floor: '#1b131f', trim: '#9b5a8c' };

  const R = (px, py, w, h, col) => { x.fillStyle = col; x.fillRect(px, py, w, h); };
  const dot = (px, py, col) => R(px, py, 1, 1, col);

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
    pic('painting');
  }

  const winStars = [[158,38],[167,41],[176,37],[192,40],[200,37],[214,41],[162,44],[183,43]];
  const winDots = [[154,60,3.078,1],[156,66,2.012,1],[156,69,0.915,0],[158,60,1.769,1],[160,60,1.641,0],[160,66,1.158,1],[160,69,2.193,0],[162,69,2.434,0],[168,65,5.439,0],[174,58,4.249,0],[174,64,1.984,0],[176,58,4.915,0],[176,61,0.921,0],[176,67,3.794,0],[178,61,5.531,1],[180,61,0.063,0],[180,64,0.01,0],[180,67,4.447,0],[184,66,5.366,0],[188,66,5.4,0],[192,66,1.337,0],[196,67,0.662,1],[196,70,4.127,1],[198,61,5.299,1],[200,61,1.489,1],[200,67,1.408,0],[202,64,3.729,1],[202,67,4.351,0],[202,70,1.87,1],[211,70,2.68,0],[217,68,1.793,0],[219,65,4.338,0],[219,68,3.957,0]];
  const antennas = [[159,54],[178,52],[189,60],[200,55]];
  function windowScene() {
    pic('window');
    if (!ready(PICS.window[0])) return;
    winStars.forEach(([sx, sy], i) => { x.globalAlpha = .4 + .6 * (0.5 + 0.5 * Math.sin(t * 2 + i * 1.7)); dot(sx, sy, '#e3d6f7'); });
    antennas.forEach(([ax, ay]) => { x.globalAlpha = .45 + .55 * (0.5 + 0.5 * Math.sin(t * 1.4 + ax)); dot(ax, ay, '#ff71ce'); });
    x.globalAlpha = 1;
    winDots.forEach(([wx, wy, ph, kind]) => { if (Math.sin(t * .6 + ph * 3) > -0.85) dot(wx, wy, kind ? '#e8a64a' : '#ff9fc5'); });
  }

  function bed() {
    pic('bed');
  }

  function rug() {
    pic('rug');
  }

  function nightstand() {
    pic('nightstand');
  }

  function lamp() {
    if (lampOn) {
      x.globalCompositeOperation = 'lighter';
      const g = x.createRadialGradient(188, 115, 2, 188, 115, 18);
      g.addColorStop(0, 'rgba(255,113,206,.35)'); g.addColorStop(1, 'rgba(255,113,206,0)');
      x.fillStyle = g; x.fillRect(168, 95, 40, 40);
      x.globalCompositeOperation = 'source-over';
    }
    pic(lampOn ? 'lampOn' : 'lampOff');
  }

  function mirror() {
    pic('mirror');
  }

  function dresser() {
    x.globalCompositeOperation = 'lighter';
    const dg = x.createLinearGradient(0, 133, 0, 142);
    dg.addColorStop(0, 'rgba(207,122,147,.14)'); dg.addColorStop(1, 'rgba(207,122,147,0)');
    x.fillStyle = dg; x.fillRect(289, 133, 81, 9);
    x.globalCompositeOperation = 'source-over';
    pic('desk');
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
  const girlFrame = (blink, step, face) => face === 0 ? (blink ? 1 : 0) : (face < 0 ? 2 : 8) + (blink ? 3 : 0) + step;

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
    if (ready(girlPic)) x.drawImage(girlPic, girlFrame((t % 4.6) < 0.15, step, girlFace) * GW, 0, GW, GH, gx, gy, GW, GH);
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
    painting();
    windowScene();
    bed();
    rug();
    nightstand();
    lamp();
    mirror();
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
