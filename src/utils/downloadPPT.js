import PptxGenJS from 'pptxgenjs';

// ── Brand colours (hex without #) ─────────────────────────────
const C = {
  bgDark:  '06091a',
  bgPanel: '0d1230',
  bgLight: '111836',
  sky:     '0ea5e9',
  indigo:  '6366f1',
  emerald: '10b981',
  amber:   'f59e0b',
  rose:    'f43f5e',
  violet:  '8b5cf6',
  white:   'f1f5f9',
  muted:   '64748b',
  border:  '1e2444',
};

const ACCENT = [C.sky, C.indigo, C.emerald, C.amber, C.rose, C.violet, C.sky, C.indigo];

// ── Slide dimensions (LAYOUT_WIDE = 13.33" × 7.5") ────────────
const SW = 13.33;
const SH = 7.5;

// ── Reusable helpers ───────────────────────────────────────────
function addBg(slide, color = C.bgDark) {
  slide.background = { color };
}

function addTopBar(slide, accentColor = C.indigo) {
  // Dual-color gradient bar
  slide.addShape('rect', { x: 0, y: 0, w: SW / 2, h: 0.07, fill: { color: C.sky } });
  slide.addShape('rect', { x: SW / 2, y: 0, w: SW / 2, h: 0.07, fill: { color: accentColor } });
}

function addHeader(slide, title, accentColor = C.indigo) {
  addTopBar(slide, accentColor);
  slide.addShape('rect', { x: 0, y: 0.07, w: SW, h: 0.43, fill: { color: C.bgPanel } });
  slide.addText('FounderMindAI', {
    x: 0.2, y: 0.1, w: 3, h: 0.3,
    fontSize: 8, bold: true, color: C.muted, fontFace: 'Arial',
  });
  slide.addText(title, {
    x: 3, y: 0.1, w: SW - 5, h: 0.3,
    fontSize: 8, color: C.muted, align: 'center', fontFace: 'Arial',
  });
}

function addFooter(slide, num, total) {
  slide.addShape('line', {
    x: 0.25, y: SH - 0.28, w: SW - 0.5, h: 0,
    line: { color: C.border, width: 0.5 },
  });
  slide.addText('FounderMindAI  |  Startup Intelligence Report  |  Confidential', {
    x: 0.25, y: SH - 0.26, w: 9, h: 0.22,
    fontSize: 6.5, color: C.muted, fontFace: 'Arial',
  });
  slide.addText(`${num} / ${total}`, {
    x: SW - 2.25, y: SH - 0.26, w: 2, h: 0.22,
    fontSize: 6.5, color: C.muted, align: 'right', fontFace: 'Arial',
  });
}

function addCard(slide, x, y, w, h, label, value, accent = C.sky) {
  slide.addShape('roundRect', {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: C.bgPanel },
    line: { color: C.border, width: 0.4 },
  });
  slide.addShape('rect', { x, y, w: 0.05, h, fill: { color: accent } });
  slide.addText(label.toUpperCase(), {
    x: x + 0.12, y: y + 0.1, w: w - 0.2, h: 0.22,
    fontSize: 6.5, bold: true, color: C.muted, fontFace: 'Arial', charSpacing: 0.5,
  });
  slide.addText(String(value || ''), {
    x: x + 0.12, y: y + 0.34, w: w - 0.2, h: h - 0.45,
    fontSize: 9, color: C.white, fontFace: 'Arial',
    wrap: true, valign: 'top',
  });
}

function addSectionTitle(slide, title, accent = C.sky, y = 0.6) {
  slide.addText(title.toUpperCase(), {
    x: 0.25, y, w: SW - 0.5, h: 0.28,
    fontSize: 9, bold: true, color: accent, charSpacing: 1, fontFace: 'Arial',
  });
  slide.addShape('line', {
    x: 0.25, y: y + 0.28, w: SW - 0.5, h: 0,
    line: { color: accent, width: 0.5 },
  });
}

function scoreBand(s) {
  if (s >= 86) return 'Exceptional';
  if (s >= 76) return 'Strong';
  if (s >= 66) return 'Above Avg';
  if (s >= 51) return 'Average';
  if (s >= 36) return 'Weak';
  return 'Poor';
}
function scoreHex(s) {
  if (s >= 86) return C.emerald;
  if (s >= 76) return '34d399';
  if (s >= 66) return C.amber;
  if (s >= 51) return 'fb923c';
  if (s >= 36) return 'f87171';
  return C.rose;
}

// ══════════════════════════════════════════════════════════════
//  MAIN
// ══════════════════════════════════════════════════════════════
export function downloadPitchDeckPPT(data) {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = data.startupName + ' — Pitch Deck by FounderMindAI';

  const total = data.slides.length + 2;

  // ────────────────────────────────────────────────────────────
  // SLIDE 1 — Cover
  // ────────────────────────────────────────────────────────────
  const cover = pptx.addSlide();
  addBg(cover, C.bgDark);
  addTopBar(cover, C.indigo);

  // Background glow circle (decorative)
  cover.addShape('ellipse', {
    x: SW / 2 - 2.5, y: 0.8, w: 5, h: 5,
    fill: { color: C.indigo, transparency: 92 },
    line: { color: C.indigo, transparency: 85, width: 0.5 },
  });

  // Brand name
  cover.addText('FounderMindAI', {
    x: 0, y: 1.4, w: SW, h: 0.6,
    fontSize: 16, bold: true, color: C.muted, align: 'center', fontFace: 'Arial',
  });

  // Startup name — large
  cover.addText(data.startupName, {
    x: 0.5, y: 2.1, w: SW - 1, h: 1.2,
    fontSize: 42, bold: true, color: C.white,
    align: 'center', fontFace: 'Arial',
  });

  // Sky underline accent
  cover.addShape('rect', {
    x: SW / 2 - 2, y: 3.35, w: 4, h: 0.05,
    fill: { color: C.sky },
  });

  // Tagline
  cover.addText(`"${data.tagline}"`, {
    x: 1, y: 3.5, w: SW - 2, h: 0.55,
    fontSize: 16, italic: true, color: C.muted,
    align: 'center', fontFace: 'Arial',
  });

  // Slide count badge
  cover.addShape('roundRect', {
    x: SW / 2 - 1.4, y: 4.25, w: 2.8, h: 0.38,
    rectRadius: 0.12,
    fill: { color: C.sky, transparency: 80 },
    line: { color: C.sky, transparency: 50, width: 0.5 },
  });
  cover.addText(`${data.slides.length} slides  |  Generated by FounderMindAI`, {
    x: SW / 2 - 1.4, y: 4.28, w: 2.8, h: 0.32,
    fontSize: 8, color: C.sky, align: 'center', fontFace: 'Arial',
  });

  // Bottom bar
  cover.addShape('rect', {
    x: 0, y: SH - 0.07, w: SW, h: 0.07,
    fill: { color: C.indigo },
  });
  addFooter(cover, 1, total);

  // ────────────────────────────────────────────────────────────
  // CONTENT SLIDES
  // ────────────────────────────────────────────────────────────
  data.slides.forEach((slide, idx) => {
    const s = pptx.addSlide();
    const accent = ACCENT[idx % ACCENT.length];
    const num = idx + 2;

    addBg(s, C.bgDark);
    addHeader(s, `${slide.title}  —  ${data.startupName}`, accent);

    // ── LEFT PANEL (x: 0.25 → 3.75, w: 3.5) ──────────────────
    const lx = 0.25, lw = 3.5;
    s.addShape('roundRect', {
      x: lx, y: 0.6, w: lw, h: SH - 0.95,
      rectRadius: 0.08,
      fill: { color: C.bgPanel },
      line: { color: C.border, width: 0.4 },
    });
    // Accent left strip
    s.addShape('roundRect', {
      x: lx, y: 0.6, w: 0.055, h: SH - 0.95,
      rectRadius: 0.03,
      fill: { color: accent },
    });

    // Slide icon — LARGE text block
    s.addText(slide.icon || '', {
      x: lx, y: 0.75, w: lw, h: 1.4,
      fontSize: 72, align: 'center',
    });

    // Slide title
    s.addText(slide.title, {
      x: lx + 0.1, y: 2.25, w: lw - 0.2, h: 0.6,
      fontSize: 20, bold: true, color: C.white,
      align: 'center', fontFace: 'Arial', wrap: true,
    });

    // Accent underline
    s.addShape('rect', {
      x: lx + 0.9, y: 2.92, w: lw - 1.8, h: 0.04,
      fill: { color: accent },
    });

    // Subtitle
    s.addText(slide.subtitle || '', {
      x: lx + 0.1, y: 3.02, w: lw - 0.2, h: 0.7,
      fontSize: 10.5, italic: true, color: C.muted,
      align: 'center', fontFace: 'Arial', wrap: true,
    });

    // Slide counter
    s.addText(`Slide ${idx + 1} of ${data.slides.length}`, {
      x: lx, y: SH - 0.6, w: lw, h: 0.22,
      fontSize: 7.5, color: C.muted, align: 'center', fontFace: 'Arial',
    });

    // ── RIGHT PANEL (x: 3.9, w: 9.15) ─────────────────────────
    const rx = 3.9, rw = SW - rx - 0.18;

    // Content paragraph box
    s.addShape('roundRect', {
      x: rx, y: 0.6, w: rw, h: 1.85,
      rectRadius: 0.06,
      fill: { color: C.bgLight },
      line: { color: C.border, width: 0.4 },
    });
    s.addText(slide.content || '', {
      x: rx + 0.2, y: 0.72, w: rw - 0.35, h: 1.6,
      fontSize: 10.5, color: C.white, fontFace: 'Arial',
      wrap: true, valign: 'top', paraSpaceAfter: 4,
    });

    // KEY POINTS label
    s.addText('KEY POINTS', {
      x: rx, y: 2.55, w: 2, h: 0.26,
      fontSize: 8, bold: true, color: accent,
      fontFace: 'Arial', charSpacing: 1.5,
    });
    s.addShape('line', {
      x: rx, y: 2.81, w: rw, h: 0,
      line: { color: C.border, width: 0.4 },
    });

    // Key point items — evenly distribute vertical space
    const pointsAreaH = SH - 0.95 - 2.85 - 0.05;  // ~3.65"
    const pts = (slide.keyPoints || []).slice(0, 3);
    const ptH = pointsAreaH / pts.length;

    pts.forEach((pt, pi) => {
      const py = 2.88 + pi * ptH;

      // Numbered badge
      s.addShape('roundRect', {
        x: rx, y: py + 0.08, w: 0.3, h: 0.3,
        rectRadius: 0.05,
        fill: { color: accent, transparency: 20 },
        line: { color: accent, width: 0.5 },
      });
      s.addText(String(pi + 1), {
        x: rx, y: py + 0.09, w: 0.3, h: 0.28,
        fontSize: 9, bold: true, color: C.white, align: 'center', fontFace: 'Arial',
      });

      // Point text
      s.addText(pt, {
        x: rx + 0.38, y: py + 0.05, w: rw - 0.42, h: ptH - 0.15,
        fontSize: 10.5, color: C.white, fontFace: 'Arial',
        wrap: true, valign: 'top',
      });

      // Light separator
      if (pi < pts.length - 1) {
        s.addShape('line', {
          x: rx, y: py + ptH - 0.05, w: rw, h: 0,
          line: { color: C.border, width: 0.3 },
        });
      }
    });

    addFooter(s, num, total);
  });

  // ────────────────────────────────────────────────────────────
  // LAST SLIDE — Thank You
  // ────────────────────────────────────────────────────────────
  const ty = pptx.addSlide();
  addBg(ty, C.bgDark);
  addTopBar(ty, C.indigo);

  ty.addShape('ellipse', {
    x: SW / 2 - 2, y: 1.0, w: 4, h: 4,
    fill: { color: C.sky, transparency: 93 },
    line: { color: C.sky, transparency: 85, width: 0.5 },
  });

  ty.addText('Thank You', {
    x: 0, y: 2.0, w: SW, h: 1.1,
    fontSize: 52, bold: true, color: C.white, align: 'center', fontFace: 'Arial',
  });

  ty.addShape('rect', {
    x: SW / 2 - 2, y: 3.15, w: 4, h: 0.05,
    fill: { color: C.sky },
  });

  ty.addText("Let's build something extraordinary.", {
    x: 0, y: 3.3, w: SW, h: 0.5,
    fontSize: 16, italic: true, color: C.muted, align: 'center', fontFace: 'Arial',
  });

  ty.addText('Generated by FounderMindAI  |  Startup Intelligence Platform', {
    x: 0, y: 4.0, w: SW, h: 0.3,
    fontSize: 9, color: C.muted, align: 'center', fontFace: 'Arial',
  });

  ty.addShape('rect', {
    x: 0, y: SH - 0.07, w: SW, h: 0.07,
    fill: { color: C.indigo },
  });
  addFooter(ty, total, total);

  // ── Save ──────────────────────────────────────────────────────
  const safe = (data.startupName || 'deck').replace(/[^a-z0-9]/gi, '_').slice(0, 40);
  pptx.writeFile({ fileName: `FounderMindAI_PitchDeck_${safe}.pptx` });
}
