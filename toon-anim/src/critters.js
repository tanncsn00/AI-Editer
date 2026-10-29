// critters.js: the channel's own cast, painted with the same brush as Clawd. A chibi animal (pig, cat, buffalo): a big
// round head that carries Clawd's face kit (eyes at (±2.5u, -6u), mouth near (0, -4.3u)), a small round body with
// clothes, stubby legs and two arms that take the same aL / aR / armL / armR hooks. Every option that feel() and
// emotions() return works here too, so the 31 acted emotions drive these characters unchanged.
//
//   critter(kind, x, y, u, options)   (x, y) = ground point between the feet; u = size unit (head is ~9u wide)
//   extra options: outfit ('singlet' | 'raincoat' | 'robe' | 'tee'), scarf (colour), mustache (bool), draw(u, sw) on top
(() => {
  const SPECIES = {
    pig: { col: '#F2A6B8', dk: '#C9768C', lt: '#FFD6E0', snout: { y: -4.9, rx: 1.35, ry: .95, mouth: 1.15 } },
    cat: { col: '#F2C14E', dk: '#C38E25', lt: '#FCE3A0', snout: null },
    buffalo: { col: '#B8322C', dk: '#7A1E1A', lt: '#E8796C', snout: { y: -4.6, rx: 2.3, ry: 1.25, mouth: 1.45 } },
  };
  const OUTFIT = {
    singlet: { col: '#F4F1E8', trim: '#D8D2C2' },
    raincoat: { col: '#7FC4B8', trim: '#4E9488' },
    robe: { col: '#6E1414', trim: '#E8AA38' },
    tee: { col: '#7DB35A', trim: '#4E7F36' },
  };
  let CRITTER_N = 0;

  // Round animal eyes for the open-eyed looks (Clawd's tall slits are his alone); every other eye comes from the kit.
  const ROUND = new Set(['normal', 'look', 'wide', 'scared', 'red', 'blank', 'shine']);
  function roundEye(e, s, u, o, sw) {
    const lx = (o.lookX || 0) * u * .45, ly = (o.lookY || 0) * u * .35;
    const blinkOn = ['normal', 'look', 'wide'].includes(e) && ((T * .9 + (o.seed || 0) * 1.7) % 3.3) < .12;
    if (blinkOn) { inkLine([[-.75 * u, .2 * u], [.75 * u, .2 * u]], sw, PAL.ink, 'ink', .4); return; }
    if (e === 'wide' || e === 'scared' || e === 'blank') {
      paint(ellPts(0, 0, 1.05 * u, 1.2 * u, 18), { wash: PAL.cream, ink: PAL.ink, sw: sw * .8 });
      const r = e === 'scared' ? .28 : e === 'blank' ? .12 : .55;
      paint(ellPts(lx, ly, r * u, r * 1.15 * u, 12), { wash: PAL.ink, ink: null });
      if (e === 'wide') paint(ellPts(lx - .2 * u, ly - .25 * u, .17 * u, .2 * u, 8), { wash: PAL.cream, ink: null });
      return;
    }
    paint(ellPts(lx, ly, .62 * u, .78 * u, 16), { wash: PAL.ink, ink: null });
    paint(ellPts(lx - .2 * u, ly - .3 * u, .2 * u, .24 * u, 8), { wash: PAL.cream, ink: null });
    if (e === 'shine') paint(ellPts(lx + .22 * u, ly + .25 * u, .1 * u, .1 * u, 6), { wash: PAL.cream, ink: null });
    if (e === 'red') {
      paint(ellPts(lx, ly + .1 * u, .3 * u, .3 * u, 10), { wash: '#E23E36', ink: null });
      inkLine([[-1 * u * -s, -1.5 * u], [1 * u * -s, -.8 * u]], sw * 1.5, PAL.ink, 'ink', 0);   // a slanted angry brow
    }
  }
  function critterEyes(u, o, sw) {
    const kinds = Array.isArray(o.eyes) ? o.eyes : o.eyes === 'wink' ? ['happy', 'normal'] : [o.eyes || 'normal', o.eyes || 'normal'];
    if (!kinds.some(k => ROUND.has(k)) || (o.squint || 0) > .8) { eyes(u, o, sw, [-1, 1]); return; }
    const sqz = clamp(o.squint || 0);
    if (sqz > 0) { push(); translate(0, -6 * u); scale(1 + sqz * .15, 1 - sqz); translate(0, 6 * u); }
    for (const s of [-1, 1]) {
      const k = kinds[s < 0 ? 0 : 1];
      push(); translate(s * 2.3 * u, -6 * u);
      if (ROUND.has(k)) roundEye(k, s, u, o, sw); else eye(k, s, u, o, sw);
      pop();
    }
    if (sqz > 0) pop();
  }

  function ears(kind, u, sw, c) {
    const P = pts => pts.map(([a, b]) => [a * u, b * u]);
    if (kind === 'pig') {
      for (const s of [-1, 1]) {
        paint(P([[s * 2.2, -8.6], [s * 4.3, -10.2], [s * 4.1, -7.6]]), { wash: c.col, fill: c.dk, fillOp: 60, ink: PAL.ink, sw: sw * .8, curv: .4 });
        paint(P([[s * 2.7, -8.5], [s * 3.9, -9.5], [s * 3.8, -7.9]]), { wash: mixCol(c.col, PAL.rose, .5), ink: null, curv: .4 });
      }
    } else if (kind === 'cat') {
      for (const s of [-1, 1]) {
        paint(P([[s * 1.4, -8.9], [s * 3.4, -11.4], [s * 4.1, -7.9]]), { wash: c.col, fill: c.dk, fillOp: 50, ink: PAL.ink, sw: sw * .8, curv: .15 });
        paint(P([[s * 2.1, -8.8], [s * 3.3, -10.4], [s * 3.6, -8.3]]), { wash: '#F4A9B6', ink: null, curv: .15 });
      }
    } else if (kind === 'buffalo') {
      for (const s of [-1, 1]) {
        paint(ribbon(through(P([[s * 3.3, -8.4], [s * 5.4, -9.2], [s * 6.3, -11.2], [s * 5.6, -12.6]]), 4), 1.1 * u, .25 * u), { wash: '#EFE3C8', fill: '#C9B88F', fillOp: 70, ink: PAL.ink, sw: sw * .8 });
        paint(ellPts(s * 4.5 * u, -6.9 * u, 1.1 * u, .55 * u, 14, 0, s * .5), { wash: c.col, fill: c.dk, fillOp: 70, ink: PAL.ink, sw: sw * .7 });
      }
    }
  }

  function tail(kind, u, sw, c, t) {
    const sway = Math.sin(t * 3) * .35;
    if (kind === 'pig') inkLine(through([[3 * u, -1.8 * u], [4.2 * u, -2.6 * u], [4.6 * u, -1.6 * u], [3.9 * u, -1.4 * u], [4.4 * u, -2.2 * u + sway * u]], 4), sw * 1.1, c.dk, 'ink', .6);
    else if (kind === 'cat') paint(ribbon(through([[2.6 * u, -1.2 * u], [4.6 * u, -1.6 * u], [5.4 * u, -3.8 * u], [4.8 * u + sway * u, -5.6 * u]], 4), .7 * u, .45 * u), { wash: c.col, fill: c.dk, fillOp: 60, ink: PAL.ink, sw: sw * .8 });
    else if (kind === 'buffalo') {
      inkLine([[2.8 * u, -1.6 * u], [4 * u, -.8 * u + sway * u * .5], [4.4 * u, -.2 * u]], sw * 1.1, c.dk, 'ink', .5);
      paint(ellPts(4.5 * u, -.1 * u, .45 * u, .6 * u, 10), { wash: PAL.ink, ink: null });
    }
  }

  function snoutAndNose(kind, u, sw, c, S) {
    if (kind === 'pig') {
      paint(ellPts(0, S.y * u, S.rx * u, S.ry * u, 18), { wash: mixCol(c.col, PAL.rose, .45), fill: c.dk, fillOp: 50, ink: PAL.ink, sw: sw * .8 });
      for (const s of [-1, 1]) paint(ellPts(s * .5 * u, S.y * u, .22 * u, .38 * u, 10), { wash: mixCol(PAL.ink, c.dk, .4), ink: null });
    } else if (kind === 'buffalo') {
      paint(ellPts(0, S.y * u, S.rx * u, S.ry * u, 20), { wash: c.lt, fill: c.col, fillOp: 50, ink: PAL.ink, sw: sw * .8 });
      for (const s of [-1, 1]) paint(ellPts(s * .8 * u, (S.y - .1) * u, .3 * u, .45 * u, 10), { wash: PAL.ink, ink: null });
      const ring = ellPts(0, (S.y + .9) * u, .85 * u, .6 * u, 16); inkLine([...ring, ring[0]], sw * 1.4, '#E8AA38', 'ink', 0);   // the nose ring
    } else if (kind === 'cat') {
      paint([[-.4 * u, -5.1 * u], [.4 * u, -5.1 * u], [0, -4.7 * u]], { wash: '#E77F92', ink: PAL.ink, sw: sw * .5 });
      for (const s of [-1, 1]) for (const k of [-1, 0, 1]) inkLine([[s * 3.0 * u, (-4.8 + k * .35) * u], [s * 4.9 * u, (-4.9 + k * .7) * u]], sw * .4, PAL.ink, 'inkfine', .2);
      for (const k of [-1, 0, 1]) inkLine([[k * .7 * u, -9.3 * u], [k * .8 * u, -8.5 * u]], sw * .9, c.dk, 'ink', 0);   // forehead stripes
    }
  }

  function outfitBody(u, sw, c, kind, o) {
    const O = OUTFIT[o.outfit] || null;
    const bodyPts = ellPts(0, -1.95 * u, 3.1 * u, 2.05 * u, 26, u * .05);
    paint(bodyPts, { wash: c.col, fill: c.dk, fillOp: 50, tex: .5, ink: PAL.ink, sw });
    if (!O) return;
    if (o.outfit === 'singlet') {
      paint(rrPts(-2.2 * u, -3.5 * u, 4.4 * u, 3.2 * u, 1.1 * u, u * .05), { wash: O.col, fill: O.trim, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
      for (const s of [-1, 1]) inkLine([[s * 1.4 * u, -3.5 * u], [s * 1.7 * u, -4.1 * u]], sw * .9, PAL.ink, 'ink', 0);
    } else if (o.outfit === 'raincoat') {
      paint(through([[-3.3 * u, -.4 * u], [-3 * u, -3.4 * u], [0, -4.1 * u], [3 * u, -3.4 * u], [3.3 * u, -.4 * u]], 4), { wash: O.col, washOp: 225, fill: O.trim, fillOp: 70, tex: .4, ink: PAL.ink, sw: sw * .8 });
      for (let k = 0; k < 3; k++) paint(ellPts(0, (-3 + k * .9) * u, .22 * u, .22 * u, 8), { wash: PAL.cream, ink: PAL.ink, sw: sw * .4 });
    } else if (o.outfit === 'robe') {
      paint(through([[-3.4 * u, -.2 * u], [-3.2 * u, -3.6 * u], [0, -4.0 * u], [3.2 * u, -3.6 * u], [3.4 * u, -.2 * u]], 4), { wash: O.col, fill: '#3A0A0A', fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
      paint(through([[-2.3 * u, -3.9 * u], [0, -2.4 * u], [2.3 * u, -3.9 * u]], 4).concat([[1.6 * u, -3.7 * u], [0, -2.9 * u], [-1.6 * u, -3.7 * u]]), { wash: O.trim, ink: PAL.ink, sw: sw * .6 });
    } else if (o.outfit === 'tee') {
      paint(rrPts(-2.9 * u, -3.7 * u, 5.8 * u, 3.0 * u, 1.2 * u, u * .05), { wash: O.col, fill: O.trim, fillOp: 60, tex: .5, ink: PAL.ink, sw: sw * .8 });
    }
  }

  function arm(which, u, sw, c, o, sleeve) {
    const a = which === 'L' ? (o.aL ?? .2) : (o.aR ?? .2), dir = which === 'L' ? -1 : 1, hook = which === 'L' ? o.armL : o.armR;
    push(); translate(dir * 2.6 * u, -2.9 * u); rotate(dir < 0 ? a : -a);
    paint(ribbon([[0, 0], [dir * 1.2 * u, 0], [dir * 2.3 * u, 0]], .95 * u, .8 * u), { wash: sleeve || c.col, fill: c.dk, fillOp: 50, ink: PAL.ink, sw: sw * .8 });
    paint(ellPts(dir * 2.4 * u, 0, .55 * u, .55 * u, 12), { wash: c.col, ink: PAL.ink, sw: sw * .7 });   // paw
    if (hook) { translate(dir * 2.2 * u, 0); if (dir < 0) scale(-1, 1); hook(u, sw); }
    pop();
  }

  function critter(kind, x, y, u, o = {}) {
    const S = SPECIES[kind];
    const id = o.boilKey ?? 'c' + ++CRITTER_N, rs = part => boilSeed(`critter ${id} ${part}`);
    const c = tintCols({ col: o.col || S.col, dk: o.dk || S.dk, lt: o.lt || S.lt, tint: o.tint, tintK: o.tintK });
    const sw = clamp(u / 15, .45, 2.4), dy = (o.dy || 0) * u, sq = (o.sq || 0) + (o.take || 0);
    x += (o.dx || 0) * u;
    const sleeve = OUTFIT[o.outfit] ? OUTFIT[o.outfit].col : null;

    rs('shadow');
    if (!o.noShadow) paint(ellPts(x, y + u * .2, u * 3.6 * (1 - Math.min(.5, Math.abs(o.dy || 0) * .06)), u * .7, 20), { fill: PAL.ink, fillOp: 90, bleed: .25, tex: .3, border: .1, ink: null });

    push(); translate(x, y + dy); if (o.rot) rotate(o.rot);
    scale((o.flip ? -1 : 1) * (1 + sq * .6), 1 - sq);

    rs('tail'); tail(kind, u, sw, c, T);
    rs('legs');
    for (const s of [-1, 1]) {
      const lift = o.walk != null ? Math.max(0, Math.sin((o.walk + (s > 0 ? .5 : 0)) * TAU)) * .5 : 0;
      paint(ellPts(s * 1.45 * u, (-.25 - lift) * u, .95 * u, .55 * u, 14), { wash: c.dk, ink: PAL.ink, sw: sw * .8 });
    }
    rs('armR-back'); if ((o.aR ?? .2) < -.6) arm('R', u, sw, c, o, sleeve);
    rs('body'); outfitBody(u, sw, c, kind, o);
    rs('ears'); ears(kind, u, sw, c);
    rs('head');
    paint(ellPts(0, -5.95 * u, 4.45 * u, 3.55 * u, 32, u * .05), { wash: c.col, ink: null });
    paint(ellPts(-1.4 * u, -7.3 * u, 2.4 * u, 1.3 * u, 18, u * .1, -.2), { fill: c.lt, fillOp: 120, bleed: .2, tex: .85, border: .8, ink: null });
    paint(ellPts(0, -3.6 * u, 3.6 * u, 1.1 * u, 20, u * .05), { fill: c.dk, fillOp: 70, bleed: .05, tex: .7, border: .5, ink: null });
    paint(ellPts(0, -5.95 * u, 4.45 * u, 3.55 * u, 32, u * .05), { ink: PAL.ink, sw });
    if (o.gloom > .02) for (let i = 0; i < 5; i++) { const gx = lerp(-2.4 * u, 2.4 * u, i / 4); inkLine([[gx, -8.9 * u], [gx, (-8.9 + 2.2 * o.gloom) * u]], sw * .45, PAL.ink, 'inkfine', 0); }
    if (o.scarf) {
      paint(through([[-4.7 * u, -3.2 * u], [-4.9 * u, -7.4 * u], [0, -10.3 * u], [4.9 * u, -7.4 * u], [4.7 * u, -3.2 * u]], 5).concat([[3.9 * u, -3.4 * u], [3.9 * u, -7 * u], [0, -9.3 * u], [-3.9 * u, -7 * u], [-3.9 * u, -3.4 * u]]), { wash: o.scarf, fill: mixCol(o.scarf, PAL.ink, .3), fillOp: 70, tex: .5, ink: PAL.ink, sw: sw * .8 });
    }
    rs('face');
    if (o.blush) blush(u, sw, { sides: [-1, 1], bx: 3.1 }, o.blush === true ? 1 : o.blush);
    rs('eyes'); critterEyes(u, o, sw);
    rs('snout'); if (S.snout) snoutAndNose(kind, u, sw, c, S.snout); else snoutAndNose(kind, u, sw, c, null);
    rs('mouth');
    push(); translate(0, S.snout ? S.snout.mouth * u : 0); mouth(u, o.mouth, sw); pop();
    if (o.mustache) {
      rs('mustache');
      const my = (S.snout ? S.snout.y + S.snout.ry + .1 : -4.7) * u;
      paint(through([[-2.5 * u, my + .5 * u], [-1.2 * u, my - .2 * u], [0, my + .15 * u], [1.2 * u, my - .2 * u], [2.5 * u, my + .5 * u], [1.2 * u, my + .3 * u], [0, my + .55 * u], [-1.2 * u, my + .3 * u]], 4), { wash: '#3A2A22', ink: null });
    }
    rs('hat'); if (o.hat) { push(); translate(0, (o.hat === 'hard' ? -.6 : -1.3) * u); scale(o.hat === 'hard' ? .95 : 1, 1); hat(u, o.hat, sw); pop(); }
    rs('armL'); arm('L', u, sw, c, o, sleeve);
    rs('armR'); if ((o.aR ?? .2) >= -.6) arm('R', u, sw, c, o, sleeve);
    rs('draw'); if (o.draw) o.draw(u, sw);
    pop();

    rs('emote');
    if (o.emote) {
      const top = EMOTE_TOP.includes(o.emote), dir = o.flip ? -1 : 1;
      emote(o.emote, x + dir * (top ? 0 : 5) * u, y + dy + (top ? -11.8 : -9.4) * u * (1 - sq), u * .9, o.emoteK ?? 1, o.emoteAge ?? T);
    }
    rs('after');
  }

  window.critter = critter;

  LOOPS.cast = t => {
    paint(rectPts(-20, -20, W + 40, H + 40), { wash: PAL.paper, ink: null });
    const rows = [['pig', { outfit: 'singlet', mustache: true }], ['cat', { outfit: 'raincoat', hat: 'hard' }], ['buffalo', { outfit: 'robe', hat: 'crown' }]];
    const moods = ['neutral', 'furious', 'surprised', 'cry', 'nervous', 'happy'];
    rows.forEach(([kind, look], r) => moods.forEach((m, i) => {
      const cx = 180 + (i % 3) * 360, cy = 300 + (r * 2 + Math.floor(i / 3)) * 300;
      const f = feel(m, t);
      critter(kind, cx, cy, 15, { ...f, ...look, mouth: m === 'furious' ? 'wail' : f.mouth, boilKey: `${kind}${i}` });
    }));
  };
  LOOPS.cast.len = 2;
})();
