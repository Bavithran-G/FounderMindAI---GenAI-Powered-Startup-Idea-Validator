import { jsPDF } from 'jspdf';

// ── Page geometry ──────────────────────────────────────────────
const PW = 210;          // A4 width  (mm)
const PH = 297;          // A4 height (mm)
const ML = 14;           // left margin
const MR = 14;           // right margin
const CW = PW - ML - MR; // usable content width = 182mm
const BOTTOM = PH - 14;  // last safe Y before footer area

// ── Brand palette  (R, G, B arrays) ───────────────────────────
const SKY    = [14,  165, 233];
const INDIGO = [99,  102, 241];
const NAVY   = [6,   9,   30];
const PANEL  = [15,  20,  50];
const CARD   = [22,  28,  66];
const WHITE  = [241, 245, 249];
const MUTED  = [100, 116, 139];
const EMERALD= [16,  185, 129];
const AMBER  = [245, 158, 11];
const ROSE   = [244, 63,  94];
const VIOLET = [139, 92,  246];

// ── Safe jsPDF v4 helpers ──────────────────────────────────────
function setFill(doc, col) { doc.setFillColor(col[0], col[1], col[2]); }
function setStroke(doc, col, w = 0.3) {
  doc.setDrawColor(col[0], col[1], col[2]);
  doc.setLineWidth(w);
}
function setTxt(doc, col) { doc.setTextColor(col[0], col[1], col[2]); }
function setFont(doc, size, bold = false) {
  doc.setFontSize(size);
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
}

// jsPDF v4 uses doc.rect() for filled rectangles; roundedRect moved
function fillRect(doc, x, y, w, h) {
  doc.rect(x, y, w, h, 'F');
}
function strokeRect(doc, x, y, w, h) {
  doc.rect(x, y, w, h, 'S');
}
// Rounded rect compatible with jsPDF v4
function rRect(doc, x, y, w, h, r, style = 'F') {
  try {
    doc.roundedRect(x, y, w, h, r, r, style);
  } catch (_) {
    // fallback to plain rect if API differs
    doc.rect(x, y, w, h, style);
  }
}

function safe(val, fallback = '—') {
  if (val === null || val === undefined || val === '') return fallback;
  return String(val);
}
function safeArr(val) {
  return Array.isArray(val) ? val : [];
}

function wrapText(doc, text, x, y, maxW, lineH = 5.5, maxLines = 99) {
  const lines = doc.splitTextToSize(safe(text), maxW);
  const out = lines.slice(0, maxLines);
  doc.text(out, x, y);
  return y + out.length * lineH;
}

// ── Score colour / band ────────────────────────────────────────
function scoreCol(s) {
  if (s >= 86) return EMERALD;
  if (s >= 76) return [52, 211, 153];
  if (s >= 66) return AMBER;
  if (s >= 51) return [251, 146, 60];
  if (s >= 36) return [248, 113, 113];
  return ROSE;
}
function scoreBand(s) {
  if (s >= 86) return 'EXCEPTIONAL';
  if (s >= 76) return 'STRONG';
  if (s >= 66) return 'ABOVE AVG';
  if (s >= 51) return 'AVERAGE';
  if (s >= 36) return 'WEAK';
  return 'POOR';
}
function priorityCol(p) {
  if (p === 'High')   return ROSE;
  if (p === 'Medium') return AMBER;
  return MUTED;
}

// ── Page-level chrome ──────────────────────────────────────────
function drawBg(doc) {
  setFill(doc, NAVY);
  fillRect(doc, 0, 0, PW, PH);
}

function drawPageHeader(doc, label) {
  // Sky bar
  setFill(doc, SKY);   fillRect(doc, 0,  0, PW / 2, 2.5);
  setFill(doc, INDIGO); fillRect(doc, PW / 2, 0, PW / 2, 2.5);
  // Panel strip
  setFill(doc, PANEL); fillRect(doc, 0, 2.5, PW, 12);
  // Header text
  setFont(doc, 7); setTxt(doc, MUTED);
  doc.text('FounderMindAI', ML, 10);
  doc.text(label, PW / 2, 10, { align: 'center' });
  const d = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  doc.text(d, PW - MR, 10, { align: 'right' });
  setStroke(doc, MUTED, 0.25);
  doc.line(0, 14.5, PW, 14.5);
  return 20; // starting Y for content
}

function drawPageFooter(doc, num) {
  setStroke(doc, MUTED, 0.25);
  doc.line(ML, BOTTOM + 2, PW - MR, BOTTOM + 2);
  setFont(doc, 6.5); setTxt(doc, MUTED);
  doc.text('FounderMindAI Startup Intelligence Report', ML, BOTTOM + 6);
  doc.text(`Page ${num}`, PW - MR, BOTTOM + 6, { align: 'right' });
}

// ── Section sub-heading within a page ─────────────────────────
function subHead(doc, label, y, col = SKY) {
  setFont(doc, 8.5, true); setTxt(doc, col);
  doc.text(label, ML, y);
  setStroke(doc, col, 0.4);
  doc.line(ML, y + 2, PW - MR, y + 2);
  return y + 7;
}

// ── A bordered info card ───────────────────────────────────────
function infoCard(doc, x, y, w, h, label, value, col = SKY) {
  setFill(doc, CARD); fillRect(doc, x, y, w, h);
  setFill(doc, col);  fillRect(doc, x, y, 2.5, h); // left accent strip
  setStroke(doc, col, 0.3); strokeRect(doc, x, y, w, h);
  setFont(doc, 6, false); setTxt(doc, MUTED);
  doc.text(label.toUpperCase(), x + 5, y + 5.5);
  setFont(doc, 8, false); setTxt(doc, WHITE);
  const lines = doc.splitTextToSize(safe(value), w - 8);
  doc.text(lines.slice(0, 4), x + 5, y + 12);
}

// ── Score circle ───────────────────────────────────────────────
function scoreCircle(doc, score, label, cx, y) {
  const col = scoreCol(score);
  const band = scoreBand(score);
  // Ring
  setStroke(doc, col, 2.2);
  doc.circle(cx, y + 13, 10.5, 'S');
  // Number
  setFont(doc, 14, true); setTxt(doc, col);
  doc.text(String(score), cx, y + 14.5, { align: 'center' });
  setFont(doc, 6, false); setTxt(doc, MUTED);
  doc.text('/100', cx, y + 20.5, { align: 'center' });
  // Band pill
  setFill(doc, col); rRect(doc, cx - 11, y + 24, 22, 5, 2, 'F');
  setFont(doc, 5.5, true); setTxt(doc, NAVY);
  doc.text(band, cx, y + 28, { align: 'center' });
  // Label
  setFont(doc, 6.5, false); setTxt(doc, MUTED);
  doc.text(label, cx, y + 35, { align: 'center' });
}

// ══════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════════════════════════
export function downloadReportPDF(result) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let page = 1;

  // ────────────────────────────────────────────────────────────
  // PAGE 1 — Cover
  // ────────────────────────────────────────────────────────────
  drawBg(doc);

  // Top dual bar
  setFill(doc, SKY);    fillRect(doc, 0, 0, PW / 2, 3);
  setFill(doc, INDIGO); fillRect(doc, PW / 2, 0, PW / 2, 3);

  // Central glow panel
  setFill(doc, PANEL); rRect(doc, PW / 2 - 40, 40, 80, 10, 5, 'F');
  setFont(doc, 10, true); setTxt(doc, SKY);
  doc.text('FounderMindAI', PW / 2, 47, { align: 'center' });

  // Main title
  setFont(doc, 28, true); setTxt(doc, WHITE);
  doc.text('FounderMindAI', PW / 2, 78, { align: 'center' });

  setFont(doc, 10, false); setTxt(doc, MUTED);
  doc.text('Startup Intelligence Report', PW / 2, 88, { align: 'center' });

  // Divider
  setFill(doc, INDIGO); fillRect(doc, PW / 2 - 28, 93, 56, 0.6);

  // Idea box
  setFill(doc, PANEL); rRect(doc, ML + 8, 100, CW - 16, 34, 4, 'F');
  setStroke(doc, SKY, 0.5); rRect(doc, ML + 8, 100, CW - 16, 34, 4, 'S');

  setFont(doc, 7, false); setTxt(doc, MUTED);
  doc.text('STARTUP IDEA', PW / 2, 107, { align: 'center' });

  setFont(doc, 11, true); setTxt(doc, WHITE);
  const ideaL = doc.splitTextToSize(`"${safe(result.idea)}"`, CW - 32);
  doc.text(ideaL.slice(0, 3), PW / 2, 116, { align: 'center' });

  // Stats row
  const stats = [
    { v: '6', l: 'AI Agents' },
    { v: '5', l: 'Sections' },
    { v: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), l: 'Generated' },
  ];
  const sw = (CW - 16) / 3;
  stats.forEach((s, i) => {
    const sx = ML + 8 + i * sw;
    setFill(doc, CARD); rRect(doc, sx + 2, 142, sw - 4, 22, 3, 'F');
    setFont(doc, 14, true); setTxt(doc, SKY);
    doc.text(s.v, sx + sw / 2, 153, { align: 'center' });
    setFont(doc, 7, false); setTxt(doc, MUTED);
    doc.text(s.l, sx + sw / 2, 160, { align: 'center' });
  });

  // Footer bar
  setFont(doc, 7, false); setTxt(doc, MUTED);
  doc.text('Powered by FounderMindAI  |  Confidential', PW / 2, PH - 8, { align: 'center' });
  setFill(doc, INDIGO); fillRect(doc, 0, PH - 3, PW, 3);

  drawPageFooter(doc, page);

  // ────────────────────────────────────────────────────────────
  // PAGE 2 — Market Research
  // ────────────────────────────────────────────────────────────
  const mr = result.marketResearch;
  if (mr) {
    doc.addPage(); page++;
    drawBg(doc);
    let y = drawPageHeader(doc, 'Market Research');

    // Score circle + Analysis card side by side
    scoreCircle(doc, mr.opportunityScore || 0, 'Opportunity Score', ML + 16, y);
    infoCard(doc, ML + 38, y, CW - 38, 38, 'Market Analysis', mr.analysis, SKY);
    setFont(doc, 7.5, true); setTxt(doc, EMERALD);
    doc.text('TAM: ' + safe(mr.targetMarketSize), ML + 41, y + 36);
    y += 44;

    // Competitors
    y = subHead(doc, 'Competitors', y, SKY);
    const cols = safeArr(mr.competitors).slice(0, 6);
    const cw2 = (CW - 2) / 2;
    cols.forEach((c, i) => {
      const cx = ML + (i % 2) * (cw2 + 2);
      const cy = y + Math.floor(i / 2) * 26;
      setFill(doc, CARD); fillRect(doc, cx, cy, cw2, 24);
      setFill(doc, SKY);  fillRect(doc, cx, cy, 2.5, 24);
      setStroke(doc, MUTED, 0.2); strokeRect(doc, cx, cy, cw2, 24);
      setFont(doc, 8, true);  setTxt(doc, WHITE);
      doc.text(safe(c.name), cx + 5, cy + 7);
      setFont(doc, 7, false); setTxt(doc, MUTED);
      const dl = doc.splitTextToSize(safe(c.description), cw2 - 8);
      doc.text(dl.slice(0, 1), cx + 5, cy + 13);
      setTxt(doc, AMBER);
      const wl = doc.splitTextToSize('Risk: ' + safe(c.weakness), cw2 - 8);
      doc.text(wl.slice(0, 1), cx + 5, cy + 19);
    });
    y += Math.ceil(cols.length / 2) * 26 + 4;

    // Trends
    y = subHead(doc, 'Market Trends', y, INDIGO);
    safeArr(mr.trends).forEach(t => {
      setFill(doc, SKY); fillRect(doc, ML, y, 1.5, 4);
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      const tl = doc.splitTextToSize(safe(t), CW - 6);
      doc.text(tl[0], ML + 4, y + 4);
      y += 6;
    });
    y += 3;

    // Gaps
    y = subHead(doc, 'Market Gaps', y, VIOLET);
    safeArr(mr.gaps).forEach((g, i) => {
      setFill(doc, INDIGO); rRect(doc, ML, y, 4.5, 4.5, 1, 'F');
      setFont(doc, 6, true); setTxt(doc, WHITE);
      doc.text(String(i + 1), ML + 2.25, y + 3.5, { align: 'center' });
      setFont(doc, 7.5, false); setTxt(doc, WHITE);
      const gl = doc.splitTextToSize(safe(g), CW - 8);
      doc.text(gl[0], ML + 7, y + 4);
      y += 7;
    });

    drawPageFooter(doc, page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 3 — Business Strategy
  // ────────────────────────────────────────────────────────────
  const bs = result.businessStrategy;
  if (bs) {
    doc.addPage(); page++;
    drawBg(doc);
    let y = drawPageHeader(doc, 'Business Strategy');

    // Value proposition box
    setFill(doc, CARD); rRect(doc, ML, y, CW, 20, 3, 'F');
    setStroke(doc, INDIGO, 0.5); rRect(doc, ML, y, CW, 20, 3, 'S');
    setFont(doc, 7, false); setTxt(doc, MUTED);
    doc.text('VALUE PROPOSITION', ML + 5, y + 5.5);
    setFont(doc, 10, true); setTxt(doc, WHITE);
    const vpl = doc.splitTextToSize(safe(bs.valueProposition), CW - 12);
    doc.text(vpl.slice(0, 2), ML + 5, y + 13);
    y += 25;

    // 3 info cards
    const c3 = (CW - 6) / 3;
    infoCard(doc, ML,            y, c3, 32, 'Competitive Moat',     bs.moat,         INDIGO);
    infoCard(doc, ML + c3 + 3,   y, c3, 32, 'Unique Selling Point', bs.usp,          SKY);
    infoCard(doc, ML + 2*(c3+3), y, c3, 32, 'Revenue Model',        bs.revenueModel, EMERALD);
    y += 37;

    // Pricing tiers
    y = subHead(doc, 'Pricing Tiers', y, SKY);
    const tiers = safeArr(bs.pricingTiers);
    const tw = CW / (tiers.length || 3);
    tiers.forEach((tier, i) => {
      const tx = ML + i * tw;
      const featured = i === 1;
      setFill(doc, featured ? CARD : PANEL);
      rRect(doc, tx + 1, y, tw - 2, 58, 3, 'F');
      if (featured) {
        setStroke(doc, INDIGO, 0.7); rRect(doc, tx + 1, y, tw - 2, 58, 3, 'S');
        setFill(doc, INDIGO); rRect(doc, tx + tw / 2 - 10, y - 3, 20, 6, 2, 'F');
        setFont(doc, 5.5, true); setTxt(doc, WHITE);
        doc.text('POPULAR', tx + tw / 2, y + 0.5, { align: 'center' });
      }
      setFont(doc, 9, true);  setTxt(doc, WHITE);
      doc.text(safe(tier.name), tx + tw / 2, y + 10, { align: 'center' });
      setFont(doc, 13, true); setTxt(doc, featured ? INDIGO : SKY);
      doc.text(safe(tier.price), tx + tw / 2, y + 20, { align: 'center' });
      setStroke(doc, MUTED, 0.25);
      doc.line(tx + 4, y + 24, tx + tw - 4, y + 24);
      setFont(doc, 7, false); setTxt(doc, MUTED);
      safeArr(tier.features).slice(0, 5).forEach((f, fi) => {
        const fl = doc.splitTextToSize('+ ' + safe(f), tw - 6);
        doc.text(fl[0], tx + 4, y + 30 + fi * 6.5);
      });
    });
    y += 64;

    // Customer segments
    y = subHead(doc, 'Customer Segments', y, VIOLET);
    let sx = ML;
    safeArr(bs.customerSegments).forEach(seg => {
      const segW = doc.getTextWidth(seg) + 12;
      if (sx + segW > PW - MR) { sx = ML; y += 9; }
      setFill(doc, CARD); rRect(doc, sx, y - 5, segW, 7, 2, 'F');
      setStroke(doc, INDIGO, 0.25); rRect(doc, sx, y - 5, segW, 7, 2, 'S');
      setFont(doc, 7.5, false); setTxt(doc, INDIGO);
      doc.text(seg, sx + 6, y);
      sx += segW + 4;
    });

    drawPageFooter(doc, page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 4 — Product Architecture
  // ────────────────────────────────────────────────────────────
  const pa = result.productArchitect;
  if (pa) {
    doc.addPage(); page++;
    drawBg(doc);
    let y = drawPageHeader(doc, 'Product Architecture');

    // MVP Features
    y = subHead(doc, 'MVP Features — Priority Order', y, EMERALD);
    safeArr(pa.mvpFeatures).slice(0, 6).forEach((f, i) => {
      const bCol = i === 0 ? ROSE : i === 1 ? AMBER : MUTED;
      const bLbl = i === 0 ? 'MUST HAVE' : i === 1 ? 'HIGH' : 'NORMAL';
      setFill(doc, CARD); fillRect(doc, ML, y - 2.5, CW, 9);
      setFill(doc, EMERALD); doc.circle(ML + 4.5, y + 2, 3, 'F');
      setFont(doc, 6.5, true); setTxt(doc, NAVY);
      doc.text(String(i + 1), ML + 4.5, y + 3.5, { align: 'center' });
      setFont(doc, 8, false); setTxt(doc, WHITE);
      const fl = doc.splitTextToSize(safe(f), CW - 30);
      doc.text(fl[0], ML + 11, y + 3);
      setFill(doc, bCol); rRect(doc, PW - MR - 20, y - 1.5, 20, 6, 1.5, 'F');
      setFont(doc, 5.5, true); setTxt(doc, WHITE);
      doc.text(bLbl, PW - MR - 10, y + 2.5, { align: 'center' });
      y += 10;
    });
    y += 3;

    // Roadmap
    y = subHead(doc, 'Development Roadmap', y, SKY);
    const phases = safeArr(pa.roadmap);
    const phW = CW / (phases.length || 3);
    const phCols = [SKY, EMERALD, VIOLET];
    phases.forEach((ph, i) => {
      const px = ML + i * phW;
      setFill(doc, CARD); rRect(doc, px + 1, y, phW - 2, 48, 3, 'F');
      setFill(doc, phCols[i % 3]); rRect(doc, px + 1, y, phW - 2, 8, 3, 'F');
      // Fix round-rect bottom edge
      setFill(doc, phCols[i % 3]); fillRect(doc, px + 1, y + 4.5, phW - 2, 3.5);
      setFont(doc, 7.5, true); setTxt(doc, NAVY);
      doc.text(safe(ph.phase || `Phase ${i + 1}`).replace('Phase ', 'Ph.'), px + phW / 2, y + 6, { align: 'center' });
      setFont(doc, 6.5, false); setTxt(doc, MUTED);
      doc.text(safe(ph.duration), px + phW / 2, y + 15, { align: 'center' });
      setFont(doc, 7, false); setTxt(doc, WHITE);
      safeArr(ph.goals).slice(0, 3).forEach((g, gi) => {
        const gl = doc.splitTextToSize('- ' + safe(g), phW - 6);
        doc.text(gl[0], px + 4, y + 21 + gi * 7.5);
      });
    });
    y += 53;

    // Tech Stack
    y = subHead(doc, 'Recommended Tech Stack', y, VIOLET);
    const cats = safeArr(pa.techStack);
    const catW = CW / (cats.length || 5);
    cats.forEach((cat, i) => {
      const cx = ML + i * catW;
      setFill(doc, CARD); rRect(doc, cx + 1, y, catW - 2, 32, 2, 'F');
      setFont(doc, 6.5, true); setTxt(doc, VIOLET);
      doc.text(safe(cat.category).toUpperCase(), cx + catW / 2, y + 7, { align: 'center' });
      setStroke(doc, VIOLET, 0.2);
      doc.line(cx + 4, y + 9.5, cx + catW - 4, y + 9.5);
      setFont(doc, 7, false); setTxt(doc, SKY);
      safeArr(cat.tools).forEach((t, ti) => {
        doc.text(safe(t), cx + catW / 2, y + 16 + ti * 6, { align: 'center' });
      });
    });

    drawPageFooter(doc, page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 5 — VC Investor Report
  // ────────────────────────────────────────────────────────────
  const inv = result.investor;
  if (inv) {
    doc.addPage(); page++;
    drawBg(doc);
    let y = drawPageHeader(doc, 'VC Investor Report');

    // Score + Verdict
    scoreCircle(doc, inv.fundingScore || 0, 'Funding Score', ML + 16, y);
    setFill(doc, CARD); rRect(doc, ML + 38, y, CW - 38, 42, 3, 'F');
    setStroke(doc, AMBER, 0.5); rRect(doc, ML + 38, y, CW - 38, 42, 3, 'S');
    setFont(doc, 6.5, false); setTxt(doc, MUTED);
    doc.text('VC VERDICT', ML + 43, y + 6);
    setStroke(doc, MUTED, 0.2);
    doc.line(ML + 38, y + 9, ML + CW, y + 9);
    setFont(doc, 8.5, false); setTxt(doc, WHITE);
    const vl = doc.splitTextToSize(safe(inv.verdict), CW - 48);
    doc.text(vl.slice(0, 4), ML + 43, y + 15);
    setFont(doc, 7.5, true); setTxt(doc, AMBER);
    doc.text('Stage: ' + safe(inv.recommendedFundingStage), ML + 43, y + 39);
    y += 48;

    // Market + Defensibility cards
    const half = (CW - 4) / 2;
    infoCard(doc, ML,          y, half, 28, 'Market Size Assessment', inv.marketSizeAssessment, SKY);
    infoCard(doc, ML+half+4,   y, half, 28, 'Defensibility',          inv.defensibility,        VIOLET);
    y += 33;

    // VC Questions
    y = subHead(doc, 'VC Due Diligence Questions', y, AMBER);
    safeArr(inv.vcQuestions).slice(0, 4).forEach((q, i) => {
      setFill(doc, CARD); fillRect(doc, ML, y, CW, 21);
      setFill(doc, AMBER); fillRect(doc, ML, y, 2.5, 21);
      setFont(doc, 8, true); setTxt(doc, AMBER);
      doc.text('Q' + (i + 1), ML + 5, y + 8);
      setFont(doc, 8, true); setTxt(doc, WHITE);
      const ql = doc.splitTextToSize(safe(q.question), CW - 16);
      doc.text(ql[0], ML + 14, y + 8);
      setFont(doc, 7, false); setTxt(doc, MUTED);
      const al = doc.splitTextToSize(safe(q.answer), CW - 16);
      doc.text(al.slice(0, 2), ML + 14, y + 14);
      y += 24;
    });

    // Risks
    y = subHead(doc, 'Key Risks and Mitigations', y, ROSE);
    safeArr(inv.risks).slice(0, 3).forEach((r, i) => {
      setFill(doc, CARD); fillRect(doc, ML, y, CW, 17);
      setFill(doc, ROSE); fillRect(doc, ML, y, 2.5, 17);
      setFont(doc, 7.5, true); setTxt(doc, ROSE);
      const rl = doc.splitTextToSize('Risk: ' + safe(r.risk), CW / 2 - 10);
      doc.text(rl[0], ML + 5, y + 8);
      setFont(doc, 7, false); setTxt(doc, EMERALD);
      const ml = doc.splitTextToSize('Mitigation: ' + safe(r.mitigation), CW / 2 - 6);
      doc.text(ml[0], ML + CW / 2 + 2, y + 8);
      y += 20;
    });

    drawPageFooter(doc, page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 6 — Execution Plan
  // ────────────────────────────────────────────────────────────
  const ex = result.execution;
  if (ex) {
    doc.addPage(); page++;
    drawBg(doc);
    let y = drawPageHeader(doc, '90-Day Execution Plan');

    // Milestones
    y = subHead(doc, 'Key Milestones', y, VIOLET);
    const mils = safeArr(ex.milestones);
    const milW = CW / (mils.length || 3);
    mils.forEach((m, i) => {
      const col = [SKY, EMERALD, VIOLET][i % 3];
      const mx = ML + i * milW;
      setFill(doc, CARD); rRect(doc, mx + 1, y, milW - 2, 20, 3, 'F');
      setFill(doc, col);  fillRect(doc, mx + 1, y, milW - 2, 2.5);
      rRect(doc, mx + 1, y, milW - 2, 2.5, 3, 'F');
      setFont(doc, 7, false); setTxt(doc, WHITE);
      const ml = doc.splitTextToSize(safe(m), milW - 5);
      doc.text(ml.slice(0, 2), mx + 3, y + 9);
    });
    y += 26;

    // KPIs
    y = subHead(doc, 'Key Performance Indicators', y, SKY);
    let kx = ML;
    safeArr(ex.kpis).forEach(kpi => {
      const kw = doc.getTextWidth(kpi) + 12;
      if (kx + kw > PW - MR) { kx = ML; y += 9; }
      setFill(doc, CARD); rRect(doc, kx, y - 5, kw, 7, 2, 'F');
      setStroke(doc, SKY, 0.25); rRect(doc, kx, y - 5, kw, 7, 2, 'S');
      setFont(doc, 7, false); setTxt(doc, SKY);
      doc.text(kpi, kx + 6, y);
      kx += kw + 4;
    });
    y += 12;

    // 30/60/90 day tasks
    const periods = [
      { label: 'Day 1 - 30 Action Plan',  tasks: ex.day30 || [], col: SKY },
      { label: 'Day 31 - 60 Action Plan', tasks: ex.day60 || [], col: EMERALD },
      { label: 'Day 61 - 90 Action Plan', tasks: ex.day90 || [], col: VIOLET },
    ];
    periods.forEach(p => {
      if (y > BOTTOM - 40) return;
      y = subHead(doc, p.label, y, p.col);
      safeArr(p.tasks).slice(0, 4).forEach(task => {
        if (y > BOTTOM - 14) return;
        const pc = priorityCol(task.priority);
        setFill(doc, CARD); fillRect(doc, ML, y - 2.5, CW, 9);
        setFill(doc, pc);   fillRect(doc, ML, y - 2.5, 2.5, 9);
        setFont(doc, 7.5, false); setTxt(doc, WHITE);
        const tl = doc.splitTextToSize(safe(task.task), CW - 36);
        doc.text(tl[0], ML + 5, y + 2);
        setFont(doc, 6.5, false); setTxt(doc, MUTED);
        doc.text('Owner: ' + safe(task.owner), ML + 5, y + 5.5);
        setFill(doc, pc); rRect(doc, PW - MR - 18, y - 1, 18, 5.5, 1.5, 'F');
        setFont(doc, 5.5, true); setTxt(doc, WHITE);
        doc.text(safe(task.priority).toUpperCase(), PW - MR - 9, y + 2.5, { align: 'center' });
        y += 11;
      });
      y += 4;
    });

    drawPageFooter(doc, page);
  }

  // ────────────────────────────────────────────────────────────
  // PAGE 7 — End
  // ────────────────────────────────────────────────────────────
  doc.addPage(); page++;
  drawBg(doc);
  setFill(doc, SKY);    fillRect(doc, 0, 0, PW / 2, 3);
  setFill(doc, INDIGO); fillRect(doc, PW / 2, 0, PW / 2, 3);
  setFill(doc, INDIGO); fillRect(doc, 0, PH - 3, PW, 3);

  setFont(doc, 22, true);  setTxt(doc, WHITE);
  doc.text('FounderMindAI', PW / 2, PH / 2 - 18, { align: 'center' });
  setFont(doc, 10, false); setTxt(doc, MUTED);
  doc.text('Startup Intelligence Report', PW / 2, PH / 2 - 9, { align: 'center' });
  setFill(doc, SKY); fillRect(doc, PW / 2 - 25, PH / 2 - 4, 50, 0.6);
  setFont(doc, 8, false); setTxt(doc, MUTED);
  doc.text('Validate all insights with real-world data before making decisions.', PW / 2, PH / 2 + 6, { align: 'center' });

  drawPageFooter(doc, page);

  // ── Save ──────────────────────────────────────────────────────
  const safe2 = safe(result.idea).replace(/[^a-z0-9]/gi, '_').slice(0, 40);
  doc.save(`FounderMindAI_Report_${safe2}.pdf`);
}
