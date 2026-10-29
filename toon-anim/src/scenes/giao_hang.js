// giao_hang.js: "Giao hàng kiểu gì thế!" (9:16). A hot-tempered customer yells at a late shipper, learns the shipper
// walked through the rain on a broken leg to keep the parcel dry, dies of guilt, repeats himself in the underworld and
// is reborn as a shipper. Timing comes from GH_LINES (generated from the approved voice track); see STORYBOARD.md.
(() => {
  const L = i => GH_LINES[i];
  const GROUND = 1500;
  const RAINY = ['#3E4A63', '#56637E'];
  const HELL = ['#5B1A1A', '#8B2A2A'];

  const PIG = { outfit: 'singlet', mustache: true };
  const GHOST = { ...PIG, col: '#EADFE6', dk: '#BFAFBA', lt: '#FFF6FA' };
  const CAT = { outfit: 'raincoat', hat: 'hard' };
  const MENGPO = { scarf: '#8E5BD6' };
  const KING = { outfit: 'robe', hat: 'crown' };
  const pig = (x, y, u, o) => critter('pig', x, y, u, o);
  const cat = (x, y, u, o) => critter('cat', x, y, u, o);
  const buffalo = (x, y, u, o) => critter('buffalo', x, y, u, o);

  // ---------- speaking: the mouth flaps on syllables while a line plays ----------
  const speaking = (t, idx) => idx.some(i => t >= L(i).s && t <= L(i).e);
  const flap = (t, idx, open = 'open', shut = 'flat') => (speaking(t, idx) ? (Math.sin(t * TAU * 6.5) > -.1 ? open : shut) : null);
  const talk = (t, idx, base, open, shut) => { const m = flap(t, idx, open, shut); return m ? { ...base, mouth: m } : base; };

  // ---------- characters' extras ----------
  const cast = (u, sw) => {   // a plaster cast wrapped round the right leg
    paint(rrPts(.35 * u, -1.6 * u, 2.2 * u, 1.9 * u, .45 * u, u * .05), { wash: PAL.cream, fill: '#D8D0C2', fillOp: 70, ink: PAL.ink, sw: sw * .8 });
    for (const y of [-1.2, -.7, -.2]) inkLine([[.45 * u, y * u], [2.45 * u, (y + .25) * u]], sw * .45, mixCol(PAL.ink, PAL.cream, .5), 'inkfine', .3);
  };
  const crutch = (u, sw) => {   // held by the right arm tip, straight down to the ground
    push(); rotate(.42);
    paint(rectPts(-.25 * u, -.25 * u, 5.4 * u, .5 * u), { wash: '#B58A5A', ink: PAL.ink, sw: sw * .7 });
    paint(rrPts(-.6 * u, -.9 * u, .7 * u, 1.8 * u, .3 * u), { wash: '#6B4B33', ink: PAL.ink, sw: sw * .7 });
    pop();
  };
  const parcelAt = (x, y, s, shine = 0) => {
    if (shine > 0) glow(x, y, s * 3.2, '#FFE9A8', shine);
    paint(rrPts(x - s, y - s * .8, s * 2, s * 1.6, s * .12), { wash: '#D9A066', fill: '#B57E45', fillOp: 70, ink: PAL.ink, sw: clamp(s / 40, .5, 1.4) });
    inkLine([[x - s, y - s * .15], [x + s, y - s * .15]], clamp(s / 60, .4, 1), PAL.ink, 'inkfine', 0);
    inkLine([[x, y - s * .8], [x, y + s * .8]], clamp(s / 60, .4, 1), PAL.ink, 'inkfine', 0);
  };
  const parcelHook = shine => (u, sw) => parcelAt(1.2 * u, .2 * u, 2.3 * u, shine);
  const gavel = (u, sw) => {
    push(); rotate(-1.2);
    paint(rectPts(0, -.25 * u, 4 * u, .5 * u), { wash: '#8A5A33', ink: PAL.ink, sw: sw * .7 });
    paint(rrPts(3.4 * u, -1.1 * u, 2.4 * u, 2.2 * u, .3 * u), { wash: '#6B3E22', ink: PAL.ink, sw: sw * .8 });
    pop();
  };
  const bowl = (u, sw) => {
    paint(ellPts(.4 * u, .5 * u, 1.6 * u, .8 * u, 18), { wash: '#E8DCC8', ink: PAL.ink, sw: sw * .7 });
    paint(ellPts(.4 * u, .1 * u, 1.4 * u, .35 * u, 16), { wash: '#7E5A3A', ink: null });
  };

  // ---------- set pieces ----------
  function rain(t, a = 1, wind = .22) {
    for (let i = 0; i < 70; i++) {
      boilSeed('rain' + i);
      const sp = 1500 + 600 * hash(i + 7), x0 = hash(i) * (W + 600) - 300, y = ((hash(i + 50) * (H + 400) + t * sp) % (H + 400)) - 200;
      inkLine([[x0 - y * wind, y], [x0 - (y + 70) * wind, y + 70]], .5 * a, mixCol('#9FB4D6', PAL.cream, .3), 'inkfine', 0);
    }
  }
  function alley(t, lamp = .6) {
    boilSeed('alley-sky');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#4A5670', ink: null });
    paint(ellPts(W * .5, 260, W * .9, 320, 30, 12), { fill: '#66738F', fillOp: 120, bleed: .3, tex: .6, ink: null });
    boilSeed('alley-wall');
    paint(rectPts(-300, 420, W + 600, GROUND - 420), { wash: '#C9A27A', fill: '#9C7A57', fillOp: 90, bleed: .08, tex: .7, ink: PAL.ink, sw: 1 });
    boilSeed('alley-door');
    paint(rectPts(150, 640, 380, GROUND - 640), { wash: '#7A4E30', fill: '#5C3A22', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1.2 });
    paint(rectPts(190, 690, 300, 330), { wash: '#8C5D3B', ink: PAL.ink, sw: .8 });
    paint(rectPts(190, 1060, 300, 380), { wash: '#8C5D3B', ink: PAL.ink, sw: .8 });
    paint(ellPts(470, 1080, 14, 14, 12), { wash: PAL.ochre, ink: PAL.ink, sw: .6 });
    boilSeed('alley-plate');
    paint(rrPts(260, 540, 160, 80, 12), { wash: '#3F5BA9', ink: PAL.ink, sw: .9 });
    letter('69', 340, 582, 54, PAL.cream);
    boilSeed('alley-window');
    paint(rectPts(680, 720, 300, 260), { wash: '#F2D58C', fill: PAL.ochre, fillOp: 60, ink: PAL.ink, sw: 1 });
    glow(830, 850, 260, '#FFD27A', lamp);
    inkLine([[830, 720], [830, 980]], .8);
    boilSeed('alley-ground');
    paint(rectPts(-300, GROUND, W + 600, 700), { wash: '#5E6577', fill: '#3F4556', fillOp: 90, bleed: .05, tex: .6, ink: null });
    inkLine([[-300, GROUND], [W / 2, GROUND - 4], [W + 300, GROUND + 2]], 1.1);
    for (let i = 0; i < 6; i++) { boilSeed('puddle' + i); paint(ellPts(120 + i * 170, GROUND + 120 + 60 * hash(i), 70, 14, 16), { fill: '#8FA3C4', fillOp: 90, ink: null }); }
  }
  function scooter(x, y, s) {
    boilSeed('scooter');
    for (const wx of [-1.6, 1.6]) paint(ellPts(x + wx * s, y - .35 * s, .7 * s, .35 * s, 18), { wash: '#2E2A33', ink: PAL.ink, sw: 1 });   // flat tyres: squashed ovals
    paint(through([[x - 1.6 * s, y - .9 * s], [x - .6 * s, y - 1.9 * s], [x + 1.1 * s, y - 1.9 * s], [x + 1.6 * s, y - .9 * s]], 4).concat([[x + .8 * s, y - .8 * s], [x - .8 * s, y - .8 * s]]), { wash: '#4FAF5A', ink: PAL.ink, sw: 1 });
    inkLine([[x + 1.2 * s, y - 1.9 * s], [x + 1.6 * s, y - 3 * s], [x + 2.2 * s, y - 3 * s]], 1.2);
    paint(rrPts(x - 1.5 * s, y - 3.2 * s, 1.5 * s, 1.2 * s, .15 * s), { wash: '#4FAF5A', fill: '#2E7D3A', fillOp: 80, ink: PAL.ink, sw: 1 });
  }
  function underworld(t, flicker = 1) {
    boilSeed('hell-bg');
    paint(rectPts(-400, -400, W + 800, H + 800), { wash: '#3A0E10', ink: null });
    paint(ellPts(W / 2, H * .45, W * .8, H * .5, 30, 14), { fill: '#7A1E1A', fillOp: 120, bleed: .3, tex: .6, ink: null });
    for (const [i, cx] of [[0, 110], [1, W - 110]]) {
      boilSeed('pillar' + i);
      paint(rectPts(cx - 70, 120, 140, GROUND - 120), { wash: '#6B1C18', fill: '#4A1210', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1 });
      const fl = .8 + .2 * Math.sin(t * 11 + i * 2);
      glow(cx, 420, 230 * fl, '#FF9A3D', .7 * flicker);
      boilSeed('lantern' + i);
      paint(ellPts(cx, 420, 62, 80, 20), { wash: '#E8AA38', fill: '#C0392B', fillOp: 70, ink: PAL.ink, sw: 1 });
    }
    boilSeed('hell-floor');
    paint(rectPts(-300, GROUND, W + 600, 700), { wash: '#260709', fill: '#4A1210', fillOp: 80, tex: .6, ink: null });
    inkLine([[-300, GROUND], [W + 300, GROUND - 3]], 1.1);
  }
  function soupPot(x, y, s, t) {
    boilSeed('pot');
    paint(through([[x - s, y - s * .9], [x - s * .9, y], [x + s * .9, y], [x + s, y - s * .9]], 4), { wash: '#4B4450', ink: PAL.ink, sw: 1 });
    paint(ellPts(x, y - s * .9, s, s * .25, 20), { wash: '#7E5A3A', ink: PAL.ink, sw: .9 });
    for (let i = 0; i < 3; i++) { boilSeed('steam' + i); const k = frac(t * .6 + i / 3); inkLine([[x - s * .4 + i * s * .4, y - s * 1.1 - k * 120], [x - s * .3 + i * s * .4, y - s * 1.3 - k * 160]], .7, mixCol(PAL.cream, '#7A1E1A', k), 'inkfine', .6); }
  }
  function swirl(t, k) {
    boilSeed('swirl');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#2B1055', ink: null });
    push(); translate(W / 2, H / 2); rotate(t * 7); scale(.4 + 2.2 * k);
    for (let i = 0; i < 6; i++) { boilSeed('arm' + i); push(); rotate(i * TAU / 6); paint(ribbon(through([[0, 0], [160, -90], [380, 20], [520, 260]], 4), 6, 46), { wash: i % 2 ? PAL.ochre : PAL.violet, ink: PAL.ink, sw: .8 }); pop(); }
    pop();
  }

  // ---------- helpers for shots ----------
  const cutIn = (lt, k = .25) => clamp(1 - lt / k);   // 1 → 0 over the first k seconds: a camera settle after a cut
  function wipeIn(lt, cols) { if (lt < .3) brushWipe(.5 + lt / .6, cols); }
  function wipeOut(lt, dur, cols) { if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, cols); }

  // A: the customer waits, then explodes at the late shipper
  function shotYell(t, lt, dur) {
    const yell = L(0).s, sh = t > yell ? shakeXY(t, 9 * Math.exp(-(t - yell) * 2)) : [0, 0];
    camBegin(560 + sh[0], kf(t, [[0, 1230], [yell, 1200]]) + sh[1], kf(t, [[0, 1.05], [yell - .1, 1.12], [yell + .12, 1.32], [dur, 1.36]]));
    alley(t, .7);
    const mood = emotions(t, [[0, 'bored', { lookX: -.7 }], [yell - .12, 'furious']]);
    pig(540, GROUND, 54, { ...mood, ...PIG, mouth: speaking(t, [0]) ? (Math.sin(t * TAU * 6.5) > -.1 ? 'wail' : 'O') : 'teeth' });
    camEnd();
    rain(t, .7);
    if (lt < .5) iris(W / 2, 760, lerp(0, 1700, easeIn(lt / .5)));
  }

  // B: the shipper bows and apologises, twice, in the rain
  function shotSorry(t, lt, dur) {
    camBegin(540 + 40 * cutIn(lt), 1210, 1.35);
    alley(t, .5);
    const bows = [L(1).s + .15, L(1).s + 1.05], bow = bows.reduce((s, b) => s + Math.exp(-((t - b - .2) ** 2) / .03), 0);
    const mood = feel('nervous', t);
    cat(560, GROUND, 50, { ...talk(t, [1], mood, 'wobble', 'flat'), ...CAT, sq: (mood.sq || 0) + .22 * bow, rot: .12 * bow, lookY: .6 * bow });
    camEnd();
    rain(t, 1);
  }

  // C: the reveal. Pan from the face down to the cast, the crutch, the flat tyres and the dry parcel being offered
  function shotReveal(t, lt, dur) {
    const pan = ease(seg(lt, .25, 1.2)), out = ease(seg(lt, 1.6, 2.3));
    camBegin(lerp(540, 600, out), lerp(lerp(1110, 1440, pan), 1260, out), lerp(2.1, 1.05, out));
    alley(t, .5);
    scooter(840, GROUND, 70);
    const offer = seg(t, L(2).s - .1, L(2).s + .5);
    const mood = emotions(t, [[0, 'sad'], [L(2).s, 'hopeful', { lookX: .3 }]]);
    cat(500, GROUND, 34, { ...talk(t, [2], mood, 'cat', 'flat'), ...CAT, draw: cast,
      aR: -1.15, armR: crutch, aL: lerp(-.4, .7, backOut(offer)), armL: parcelHook(.4 + .5 * offer) });
    camEnd();
    rain(t, 1);
  }

  // D: the customer understands. A huge take, then the guilt
  function shotGuilt(t, lt, dur, again = false) {
    const sh = shakeXY(t, 14 * Math.exp(-lt * 4));
    camBegin(540 + sh[0], 1200 + sh[1], lerp(1.9, 1.75, ease(lt / dur)));
    if (again) underworld(t); else alley(t, .4);
    const i = again ? 10 : 3;
    const mood = emotions(t, [[t - lt, 'surprised'], [L(i).s + .55, 'cry']], { take: 1.6 });
    pig(540, GROUND, 40, { ...talk(t, [i], mood, 'wail', 'frown'), ...(again ? GHOST : PIG) });
    camEnd();
    if (!again) rain(t, .6);
    flash(.9 * Math.exp(-lt * 12));
  }

  // E: he posts himself away in a box
  function shotBox(t, lt, dur) {
    camBegin(540, 1060, 1.15 + .05 * lt);
    boilSeed('room');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#E9D3AE', fill: '#CDB38C', fillOp: 80, tex: .6, ink: null });
    const sink = ease(seg(lt, .1, .6));
    pig(540, 1250 + 90 * sink, 34, { ...talk(t, [4], feel('cry', t), 'wail', 'frown'), ...PIG });
    boilSeed('box');
    paint([[200, 1160], [880, 1160], [880, 1720], [200, 1720]], { wash: '#D9A066', fill: '#B57E45', fillOp: 80, tex: .6, ink: PAL.ink, sw: 1.2 });
    const flapK = ease(seg(lt, .6, .9));   // he pulls the flaps shut over himself
    if (flapK > .02) {
      paint([[200, 1160], [lerp(200, 540, flapK), 1160], [lerp(200, 540, flapK), lerp(900, 1160, flapK)]], { wash: '#E2B07A', ink: PAL.ink, sw: 1 });
      paint([[880, 1160], [lerp(880, 540, flapK), 1160], [lerp(880, 540, flapK), lerp(900, 1160, flapK)]], { wash: '#E2B07A', ink: PAL.ink, sw: 1 });
    }
    camEnd();
    wipeIn(lt); wipeOut(lt, dur, ['#C0392B', PAL.cream]);
  }

  // F: the ambulance
  function shotAmbulance(t, lt, dur) {
    camBegin(540 - 120 * cutIn(lt, .3), 1060, 1.1);
    boilSeed('amb');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#DCE7EE', ink: null });
    paint(rrPts(90, 380, 900, 1200, 50), { wash: PAL.cream, ink: PAL.ink, sw: 1.2 });
    const red = Math.floor(t * 6) % 2 === 0;
    glow(540, 420, 360, red ? '#FF4D4D' : '#4D8BFF', .9);
    paint(rrPts(380, 330, 320, 110, 30), { wash: red ? '#E4574C' : '#6D86BE', ink: PAL.ink, sw: 1 });
    paint(rectPts(150, 1300, 780, 70), { wash: '#9AA3AE', ink: PAL.ink, sw: 1 });
    pig(720, 1250, 46, { ...talk(t, [5], feel('cry', t), 'wail', 'frown'), ...PIG, rot: -1.45, noShadow: true });
    camEnd();
    wipeIn(lt, ['#C0392B', PAL.cream]);
  }

  // G: the heart monitor goes flat
  function shotMonitor(t, lt, dur) {
    camBegin(540, 1000, 1.05);
    boilSeed('er');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#CFE3DA', fill: '#A9C9BB', fillOp: 70, tex: .5, ink: null });
    paint(rrPts(560, 260, 440, 330, 26), { wash: '#1D2B24', ink: PAL.ink, sw: 1.2 });
    const flat = lt > dur - .35, P = [];
    for (let k = 0; k <= 40; k++) { const x = 590 + k * 9.5, ph = frac(k / 10 - t * 1.8); P.push([x, 430 - (flat ? 0 : (ph < .1 ? 90 * Math.sin(ph * 31) : 0))]); }
    inkLine(P, 1.3, '#4FD1A5', 'ink', 0);
    pig(680, 1330, 46, { ...talk(t, [6], feel(flat ? 'ko' : 'cry', t), 'wail', 'frown'), ...PIG, rot: -1.5, noShadow: true });
    camEnd();
  }

  // H: the grave in the rain, a crow
  function shotGrave(t, lt, dur) {
    camBegin(540, 1050, 1 + .04 * lt);
    boilSeed('grave-sky');
    paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#6B778E', fill: '#4F5A70', fillOp: 90, tex: .6, ink: null });
    boilSeed('grave-hill');
    paint(ellPts(540, 1700, 900, 380, 30, 6), { wash: '#55744A', fill: '#3E5A36', fillOp: 90, tex: .6, ink: PAL.ink, sw: 1 });
    boilSeed('stone');
    paint(through([[330, 1420], [330, 900], [540, 760], [750, 900], [750, 1420]], 4), { wash: '#A7A39C', fill: '#85817A', fillOp: 90, tex: .7, ink: PAL.ink, sw: 1.2 });
    pig(540, 1180, 12, { ...feel('cry', t), ...PIG, noShadow: true });   // his portrait, carved
    const flapK = Math.sin(t * 14);
    boilSeed('crow');
    paint(ellPts(690, 730, 46, 34, 16), { wash: PAL.ink, ink: null });
    paint([[690, 730], [770 + 20 * flapK, 690 - 30 * flapK], [720, 740]], { wash: PAL.ink, ink: null });
    paint([[728, 716], [762, 724], [728, 732]], { wash: PAL.ochre, ink: null });
    camEnd();
    rain(t, .8, .1);
    if (lt < .35) iris(W / 2, H / 2, 0);
    else if (lt < .7) flash(1 - seg(lt, .35, .7), '#1B1820');
  }

  // I: the King of Hell confirms it, with a gavel
  function shotKing(t, lt, dur) {
    const hit = L(7).e, sh = t > hit ? shakeXY(t, 16 * Math.exp(-(t - hit) * 6)) : [0, 0];
    camBegin(540 + sh[0], 1110 + sh[1], 1.1);
    underworld(t);
    const swing = t < hit ? lerp(.3, 1.5, ease(seg(t, L(7).s, hit - .15))) : lerp(-.35, -.2, seg(t, hit, hit + .4));
    buffalo(540, GROUND + 60, 62, { ...talk(t, [7], feel('angry', t), 'open', 'teeth'), ...KING, aR: swing, armR: gavel });
    camEnd();
    if (lt < .45) iris(110, 420, lerp(0, 1900, easeIn(lt / .45)), '#1B0505');
  }

  // J: in the underworld, the ghost yells at the soup stall
  function shotRelapse(t, lt, dur) {
    const yell = L(8).s, sh = t > yell ? shakeXY(t, 7 * Math.exp(-(t - yell) * 2)) : [0, 0];
    camBegin(560 + sh[0], 1210 + sh[1], 1.3);
    underworld(t, .8);
    soupPot(880, GROUND, 120, t);
    const mood = emotions(t, [[t - lt, 'determined'], [yell + .1, 'furious']]);
    pig(450, GROUND, 50, { ...mood, ...GHOST, mouth: speaking(t, [8]) ? (Math.sin(t * TAU * 6.5) > -.1 ? 'wail' : 'O') : 'teeth' });
    camEnd();
  }

  // K: Meng Po (the shipper in a hood) bows with the soup
  function shotMengPo(t, lt, dur) {
    camBegin(540, 1210, 1.35);
    underworld(t, .8);
    const bow = Math.exp(-((t - L(9).s - .3) ** 2) / .04), mood = feel('nervous', t);
    cat(540, GROUND, 50, { ...talk(t, [9], mood, 'wobble', 'flat'), ...MENGPO, sq: (mood.sq || 0) + .22 * bow, rot: .12 * bow, aL: .4, armL: bowl });
    camEnd();
  }

  // L: the reveal again, the same cast and crutch
  function shotReveal2(t, lt, dur) {
    const pan = ease(seg(lt, .1, .7));
    camBegin(540, lerp(1010, 1420, pan), 2.0);
    underworld(t, .8);
    cat(540, GROUND, 34, { ...feel('sad', t), ...MENGPO, draw: cast, aR: -1.15, armR: crutch, aL: .4, armL: bowl });
    camEnd();
  }

  // N: the King, bored: "you're already dead", then the verdict and a gavel slam
  function shotKingSigh(t, lt, dur) {
    const hit = L(12).e, sh = t > hit ? shakeXY(t, 16 * Math.exp(-(t - hit) * 6)) : [0, 0];
    camBegin(540 + sh[0], 1130 + sh[1], kf(t, [[0, 1.25], [L(12).s, 1.25], [hit, 1.45]]));
    underworld(t);
    const swing = t < L(12).s ? .3 : t < hit ? lerp(.3, 1.5, ease(seg(t, L(12).s, hit - .15))) : lerp(-.35, -.2, seg(t, hit, hit + .4));
    const mood = emotions(t, [[t - lt, 'bored'], [L(12).s - .1, 'angry']]);
    buffalo(540, GROUND + 60, 62, { ...talk(t, [11, 12], mood, 'open', 'teeth'), ...KING, aR: swing, armR: gavel });
    camEnd();
  }

  // O: reincarnation. A swirl, then a close-up on his face pulls back to show he IS the shipper now
  const SWIRL = .9;
  function shotReborn(t, lt, dur) {
    if (lt < SWIRL) { swirl(t, ease(lt / SWIRL)); return; }
    const a = lt - SWIRL, pull = ease(seg(a, .35, 1.0));
    camBegin(lerp(500, 600, pull), lerp(1020, 1260, pull), lerp(2.3, 1.05, pull));
    alley(t, .5);
    scooter(840, GROUND, 70);
    const mood = emotions(t, [[t - a, 'surprised'], [t - a + .45, 'scared', { lookY: .9 }]]);
    pig(500, GROUND, 34, { ...mood, ...PIG, outfit: 'raincoat', hat: 'hard', draw: cast, aR: -1.15, armR: crutch, aL: .4, armL: parcelHook(.3) });
    if (a > .5) sfx('?!', 640, 1000, 120, PAL.ochre, a - .5, { life: 1.4 });
    camEnd();
    rain(t, 1);
    flash(.8 * clamp(1 - a / .25), '#E8D9FF');
  }

  // P: now HE bows and apologises
  function shotHisSorry(t, lt, dur) {
    camBegin(540 + 40 * cutIn(lt), 1210, 1.35);
    alley(t, .5);
    const bow = Math.exp(-((t - L(13).s - .3) ** 2) / .04), mood = feel('nervous', t);
    pig(560, GROUND, 50, { ...talk(t, [13], mood, 'wobble', 'flat'), ...PIG, outfit: 'raincoat', hat: 'hard', draw: cast, aL: .4, armL: parcelHook(.3), sq: (mood.sq || 0) + .22 * bow, rot: .12 * bow });
    camEnd();
    rain(t, 1);
  }

  // Q: the old shipper, now the customer, is kind
  function shotKind(t, lt, dur) {
    camBegin(560, 1200, 1.3);
    alley(t, 1);
    const mood = feel('happy', t);
    const wave = speaking(t, [14]) ? 1.3 + .4 * Math.sin(t * 13) : mood.aR;
    cat(560, GROUND, 50, { ...talk(t, [14], mood, 'smile', 'cat'), outfit: 'tee', aR: wave });
    camEnd();
    rain(t, .5);
  }

  // R: he bursts into tears
  function shotTears(t, lt, dur) {
    camBegin(540, 1200, lerp(1.6, 2.0, ease(lt / dur)));
    alley(t, .6);
    pig(540, GROUND, 40, { ...talk(t, [15], feel('cry', t), 'wail', 'frown'), ...PIG, outfit: 'raincoat', hat: 'hard' });
    for (const s of [-1, 1]) for (let i = 0; i < 8; i++) {   // two fountains of tears
      boilSeed('tear' + s + i);
      const k = frac(t * 1.6 + i / 8), x = 540 + s * (100 + 260 * k), y = 1180 - 220 * Math.sin(k * Math.PI) + 160 * k;
      paint(ellPts(x, y, 14, 20, 10), { wash: '#8FB8E6', ink: PAL.ink, sw: .5 });
    }
    camEnd();
    rain(t, .8);
  }

  // S: under the eave, the kind one holds an umbrella over him. Iris closes on the dry parcel
  function shotEnd(t, lt, dur) {
    camBegin(560, 1260, lerp(1.25, 1.0, ease(seg(lt, 0, .8))));
    alley(t, 1);
    pig(380, GROUND, 28, { ...feel('cry', t), ...PIG, outfit: 'raincoat', hat: 'hard', draw: cast, aL: .5, armL: parcelHook(.6) });
    cat(740, GROUND, 28, { ...talk(t, [16], feel('happy', t), 'smile', 'cat'), outfit: 'tee', aL: 1.4 });
    boilSeed('umbrella');
    const ux = 560, uy = 980;
    paint(through([[ux - 340, uy + 40], [ux - 200, uy - 120], [ux, uy - 170], [ux + 200, uy - 120], [ux + 340, uy + 40]], 5).concat([[ux + 170, uy], [ux, uy + 30], [ux - 170, uy]]), { wash: '#E4574C', fill: '#B03A30', fillOp: 70, ink: PAL.ink, sw: 1 });
    inkLine([[ux, uy - 160], [ux + 120, uy + 300]], 1.2);
    const parcel = toScreen(380 - .6 * 28 + 2.2 * 28, GROUND - 4.5 * 28);
    camEnd();
    rain(t, .9);
    if (lt > dur - .8) iris(...parcel, lerp(1700, 0, easeIn(seg(lt, dur - .8, dur - .1))));
  }

  LOOPS.thumb = t => {
    alley(t, .8);
    cat(800, GROUND, 40, { ...feel('sad', t), ...CAT, draw: cast, aR: -1.15, armR: crutch, aL: .4, armL: parcelHook(.9), boilKey: 'thumbcat' });
    pig(270, GROUND + 40, 50, { ...feel('furious', t), ...PIG, mouth: 'wail', flip: true, boilKey: 'thumbpig' });
    rain(t, .8);
  };
  LOOPS.thumb.len = 1;

  shots([
    [0, shotYell],
    [L(1).s - .1, shotSorry],
    [L(1).e + .08, shotReveal],
    [L(3).s - .1, (t, lt, dur) => shotGuilt(t, lt, dur, false)],
    [L(4).s - .12, shotBox],
    [L(5).s - .12, shotAmbulance],
    [L(6).s - .12, shotMonitor],
    [L(6).e + .1, shotGrave],
    [L(7).s - .1, shotKing],
    [L(8).s - .1, shotRelapse],
    [L(9).s - .1, shotMengPo],
    [L(9).e + .08, shotReveal2],
    [L(10).s - .1, (t, lt, dur) => shotGuilt(t, lt, dur, true)],
    [L(11).s - .1, shotKingSigh],
    [L(12).e + .25, shotReborn],
    [L(13).s - .1, shotHisSorry],
    [L(14).s - .1, shotKind],
    [L(15).s - .1, shotTears],
    [L(16).s - .1, shotEnd],
  ]);
})();
