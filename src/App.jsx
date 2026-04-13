import { useState, useCallback } from "react";

const PCFG = {
  "X (Twitter)":  { lim: 280,   risk: "safe",    rl: "Most freedom",       col: "#1d9bf0", rule: "Can mention products by name. Can link to site. Use hemp-derived framing. Avoid explicit intoxication claims." },
  "Instagram":    { lim: 2200,  risk: "caution",  rl: "Lifestyle only",     col: "#e1306c", rule: "Zero product sale language. No THC or Delta-9 in caption — use hemp or plant-based. Pure lifestyle framing. No promotional CTAs." },
  "TikTok":       { lim: 2200,  risk: "risk",     rl: "Creator brief only", col: "#fe2c55", rule: "Write as influencer creator brief — they handle compliance. No explicit product promotion. Lifestyle moments only. Avoid hashtags cannabis thc weed." },
  "LinkedIn":     { lim: 3000,  risk: "safe",     rl: "B2B friendly",       col: "#0a66c2", rule: "Professional tone. Brand milestones, retail expansion, partnerships, thought leadership. Hemp-derived alternative beverage is fine." },
  "YouTube":      { lim: 5000,  risk: "caution",  rl: "Educational OK",     col: "#ff0000", rule: "Video description only. Education and lifestyle content OK. Include 18+ note. No explicit intoxication claims." },
  "Facebook":     { lim: 63000, risk: "risk",     rl: "Community only",     col: "#1877f2", rule: "Community and lifestyle content only. No product promotions or sale language for THC. Brand storytelling with responsible use language." },
  "Email / SMS":  { lim: null,  risk: "safe",     rl: "Full freedom",       col: "#803cee", rule: "Full creative freedom. Can mention products, doses, deals. Include age verification note and unsubscribe reminder." },
};

const PILLARS = [
  { v: "lifestyle and alcohol alternative messaging", label: "Lifestyle / alcohol alternative" },
  { v: "event and sport moment coverage", label: "Event / sport moment" },
  { v: "hemp and cannabis education", label: "Education / hemp 101" },
  { v: "product spotlight and features", label: "Product spotlight" },
  { v: "trade, retail expansion and B2B growth", label: "Trade / B2B growth" },
  { v: "UGC and social proof from customers", label: "UGC / social proof" },
];

const PRODUCTS = [
  { v: "", label: "No specific product — brand awareness" },
  { v: "Gorilla Elixir THC Drink (Delta-9, 2.5–5mg per serving, 750ml bottle)", label: "Gorilla Elixir THC Drink (2.5–5mg Delta-9)" },
  { v: "Gorilla 20mg THC Energy Shot", label: "20mg THC Energy Shot" },
  { v: "Gorilla 20mg CBD Energy Shot", label: "20mg CBD Energy Shot" },
  { v: "Gorilla HHC Energy Shot (20mg)", label: "HHC Energy Shot (20mg)" },
  { v: "Gorilla UNTAMED 50mg Delta-9 THC Shot", label: "UNTAMED 50mg Delta-9 Shot" },
  { v: "Gorilla Delta-9 Gummies (20mg, 10-piece pack)", label: "Delta-9 Gummies (20mg, 10-pack)" },
];

const PERSONAS = [
  "Social adults replacing alcohol",
  "Wellness-focused consumers",
  "Sport & fight fans (Power Slap / UFC audience)",
  "Hemp-curious newcomers",
  "Experienced cannabis consumers",
  "Retail buyers & distributors (B2B)",
];

const TONES = [
  "Bold and energetic",
  "Clean and premium",
  "Educational and trustworthy",
  "Playful and social",
  "Rebellious and counter-culture",
];

const PLATFORM_LIST = Object.keys(PCFG);

// Design tokens lifted from gorillabeverages.com:
//   Fonts    — Montserrat (headings), Anybody (body); loaded from Google Fonts via index.html
//   Palette  — white bg, near-black text (#1a1a1a), purple #803cee accent, green #00a341 CTA,
//              red #f83a3a / amber #ffb74a for status, muted #666666 for secondary text
//   Shapes   — pill buttons (radius 9999), softly rounded cards (16–24px), soft primary-tinted shadows
const HEADING = "'Montserrat', system-ui, sans-serif";
const BODY = "'Anybody', system-ui, sans-serif";

const s = {
  wrap: { background: "#ffffff", minHeight: "100vh", color: "#212121", fontFamily: BODY },
  header: { padding: "18px 32px", background: "#080808", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logoMark: { width: 40, height: 40, background: "#00a341", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "#ffffff", fontFamily: HEADING, flexShrink: 0 },
  logoName: { fontSize: 15, fontWeight: 700, letterSpacing: "0.22em", color: "#ffffff", lineHeight: 1, fontFamily: HEADING, textTransform: "uppercase" },
  logoSub: { fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", fontFamily: HEADING, marginTop: 4, fontWeight: 500 },
  badge: { fontSize: 11, letterSpacing: "0.12em", color: "#ffffff", background: "#803cee", border: "none", padding: "7px 14px", borderRadius: 9999, fontFamily: HEADING, textTransform: "uppercase", fontWeight: 600 },
  main: { maxWidth: 1100, margin: "0 auto", padding: "56px 32px" },
  hero: { fontSize: "clamp(40px,6vw,64px)", fontWeight: 800, letterSpacing: "0.005em", lineHeight: 1.05, marginBottom: 16, fontFamily: HEADING, color: "#1a1a1a" },
  heroAccent: { color: "#803cee" },
  heroSub: { fontSize: 16, color: "#666666", marginBottom: 40, lineHeight: 1.6, maxWidth: 560, fontWeight: 400, fontFamily: BODY },
  panel: { background: "#ffffff", border: "1px solid rgba(33,33,33,0.08)", borderRadius: 24, padding: 36, marginBottom: 28, boxShadow: "0 5px 30px rgba(33,33,33,0.06)" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 },
  fieldLabel: { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#666666", fontFamily: HEADING, fontWeight: 600, marginBottom: 8, display: "block" },
  input: { background: "#f4f4f4", border: "1px solid rgba(33,33,33,0.08)", borderRadius: 10, color: "#212121", fontFamily: BODY, fontSize: 14, padding: "12px 16px", outline: "none", width: "100%", boxSizing: "border-box" },
  select: { background: "#f4f4f4", border: "1px solid rgba(33,33,33,0.08)", borderRadius: 10, color: "#212121", fontFamily: BODY, fontSize: 14, padding: "12px 16px", outline: "none", width: "100%", boxSizing: "border-box" },
  textarea: { background: "#f4f4f4", border: "1px solid rgba(33,33,33,0.08)", borderRadius: 10, color: "#212121", fontFamily: BODY, fontSize: 14, padding: "12px 16px", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 80, lineHeight: 1.6 },
  chips: { display: "flex", gap: 8, flexWrap: "wrap" },
  platGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 },
  genBtn: { width: "100%", padding: "18px", background: "#1a1a1a", color: "#ffffff", border: "none", borderRadius: 9999, fontWeight: 700, fontSize: 14, letterSpacing: "0.14em", cursor: "pointer", marginTop: 24, fontFamily: HEADING, textTransform: "uppercase" },
  genBtnDis: { width: "100%", padding: "18px", background: "#1a1a1a", color: "#ffffff", border: "none", borderRadius: 9999, fontWeight: 700, fontSize: 14, letterSpacing: "0.14em", fontFamily: HEADING, textTransform: "uppercase", marginTop: 24, opacity: 0.35, cursor: "not-allowed" },
  errBox: { marginTop: 14, padding: "14px 18px", background: "rgba(248,58,58,0.08)", border: "1px solid rgba(248,58,58,0.25)", borderRadius: 12, color: "#f83a3a", fontSize: 13, fontFamily: BODY, lineHeight: 1.5 },
  progWrap: { marginTop: 16 },
  progBar: { height: 3, background: "rgba(33,33,33,0.08)", borderRadius: 3, overflow: "hidden" },
  progMsg: { textAlign: "center", fontFamily: HEADING, fontSize: 11, color: "#803cee", letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 0 0", fontWeight: 600 },
  resHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  resTitle: { fontSize: 32, fontWeight: 800, letterSpacing: "0.005em", color: "#1a1a1a", fontFamily: HEADING },
  copyAllBtn: { padding: "10px 20px", border: "2px solid #1a1a1a", borderRadius: 9999, background: "transparent", color: "#1a1a1a", fontFamily: HEADING, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", fontWeight: 600 },
  postsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  pcard: { background: "#ffffff", border: "1px solid rgba(33,33,33,0.08)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(33,33,33,0.05)" },
  pcardWide: { background: "#ffffff", border: "1px solid rgba(33,33,33,0.08)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", gridColumn: "1 / -1", boxShadow: "0 2px 8px rgba(33,33,33,0.05)" },
  pcardHead: { padding: "14px 18px", borderBottom: "1px solid rgba(33,33,33,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  pcardBody: { padding: 20, flex: 1 },
  postTxt: { fontSize: 14, lineHeight: 1.7, color: "#212121", whiteSpace: "pre-wrap", fontWeight: 400, fontFamily: BODY },
  compNote: { marginTop: 12, padding: "10px 12px", background: "#f4f4f4", borderRadius: 8, fontSize: 12, color: "#666666", lineHeight: 1.5, fontFamily: BODY },
  pcardFoot: { padding: "12px 18px", borderTop: "1px solid rgba(33,33,33,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  chars: { fontFamily: HEADING, fontSize: 11, color: "#999999", fontWeight: 500 },
  charsOver: { fontFamily: HEADING, fontSize: 11, color: "#f83a3a", fontWeight: 600 },
  cpyBtn: { padding: "6px 14px", border: "1px solid rgba(33,33,33,0.15)", borderRadius: 9999, background: "transparent", color: "#666666", fontSize: 10, fontFamily: HEADING, cursor: "pointer", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" },
  cpyBtnDone: { padding: "6px 14px", border: "1px solid #00a341", borderRadius: 9999, background: "transparent", color: "#00a341", fontSize: 10, fontFamily: HEADING, cursor: "pointer", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" },
  sumNote: { marginTop: 24, padding: "18px 22px", background: "#f4f4f4", border: "1px solid rgba(33,33,33,0.06)", borderRadius: 16, fontSize: 14, color: "#666666", lineHeight: 1.6, fontFamily: BODY },
};

function Chip({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "8px 18px", borderRadius: 9999, border: active ? "2px solid #803cee" : "1px solid rgba(33,33,33,0.12)", fontSize: 13, fontWeight: 500, cursor: "pointer", background: active ? "rgba(128,60,238,0.08)" : "#ffffff", color: active ? "#803cee" : "#666666", fontFamily: "'Montserrat', sans-serif", transition: "all 0.15s" }}>
      {label}
    </div>
  );
}

function PlatToggle({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "12px 16px", borderRadius: 12, border: active ? "2px solid #00a341" : "1px solid rgba(33,33,33,0.12)", background: active ? "rgba(0,163,65,0.06)" : "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: active ? "#00a341" : "#666666", fontWeight: 600, fontFamily: "'Montserrat', sans-serif", transition: "all 0.15s" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: active ? "#00a341" : "rgba(33,33,33,0.2)", flexShrink: 0, display: "inline-block" }} />
      {label}
    </div>
  );
}

function PillBadge({ risk, label }) {
  const colors = {
    safe:    { color: "#00a341", border: "rgba(0,163,65,0.3)",  bg: "rgba(0,163,65,0.08)" },
    caution: { color: "#ffb74a", border: "rgba(255,183,74,0.35)", bg: "rgba(255,183,74,0.12)" },
    risk:    { color: "#f83a3a", border: "rgba(248,58,58,0.3)",  bg: "rgba(248,58,58,0.08)" },
  };
  const c = colors[risk] || colors.safe;
  return <span style={{ fontSize: 10, fontFamily: "'Montserrat', sans-serif", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 9999, border: `1px solid ${c.border}`, background: c.bg, color: c.color }}>{label}</span>;
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [product, setProduct] = useState("");
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [ctx, setCtx] = useState("");
  const [pillar, setPillar] = useState(PILLARS[0].v);
  const [selectedPlats, setSelectedPlats] = useState(["X (Twitter)", "Instagram", "LinkedIn"]);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState({});

  const togglePlat = (p) => {
    setSelectedPlats(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const generate = useCallback(async () => {
    if (!topic.trim()) { setError("Please enter a content topic first."); return; }
    if (!selectedPlats.length) { setError("Select at least one platform."); return; }
    setError(""); setLoading(true); setPosts([]); setSummary("");

    const platRules = selectedPlats.map(p => {
      const c = PCFG[p] || {};
      return `${p} (limit: ${c.lim ? c.lim + " chars" : "unlimited"}): ${c.rule}`;
    }).join("\n");

    const prompt = `You are a social media content specialist for Gorilla Beverages (gorillalifestyle.com), a Miami-based hemp-derived THC beverage brand. Products: Gorilla Elixir THC Drink (Delta-9, 2.5–5mg/serving), 20mg THC/CBD/HHC energy shots, UNTAMED 50mg Delta-9 shot, Delta-9 gummies. Multi-year partnership with Power Slap (Dana White / UFC). All products Farm Bill compliant, third-party lab tested, CGMP, made in USA, ships nationwide.

BRAND: Premium lifestyle. "Clean buzz, no hangover." Alcohol alternative positioning.

TASK:
- Topic: ${topic}
- Content pillar: ${pillar}
- Product: ${product || "brand awareness, no specific product"}
- Persona: ${persona}
- Tone: ${tone}
- Extra context: ${ctx || "none"}

PLATFORM RULES:
${platRules}

GLOBAL RULES (all platforms):
- NEVER use: high, stoned, buzzed, intoxicated, get you high, psychoactive (unless purely educational on safe platforms)
- USE instead: smooth experience, clean buzz, balanced, functional, relaxed, calm focus, hemp-derived, alternative beverage
- Never show or describe consumption
- Never make health or medical claims
- Never target minors
- Frame as lifestyle / social / wellness alcohol alternative

Respond ONLY with valid JSON, no markdown, no extra text:
{"posts":[{"platform":"exact platform name","content":"full post text with emojis and hashtags","compliance_notes":"brief compliance note"}],"summary":"2-3 sentence compliance summary"}

Platforms: ${selectedPlats.join(", ")}`;

    try {
      const res = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        let msg = `Status ${res.status}`;
        try { const d = await res.json(); msg = d.error?.message || msg; } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      const raw = (data.content || []).map(i => i.text || "").join("");
      const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPosts(parsed.posts || []);
      setSummary(parsed.summary || "");
    } catch (e) {
      setError("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  }, [topic, product, persona, tone, ctx, pillar, selectedPlats]);

  const copyPost = (i, content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(prev => ({ ...prev, [i]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [i]: false })), 2000);
    });
  };

  const copyAll = () => {
    const txt = posts.map(p => `=== ${p.platform.toUpperCase()} ===\n${p.content}`).join("\n\n");
    navigator.clipboard.writeText(txt);
  };

  const isWide = (p) => ["LinkedIn", "YouTube", "Email / SMS"].includes(p);

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={s.logoMark}>G</div>
          <div>
            <div style={s.logoName}>Gorilla</div>
            <div style={s.logoSub}>Content Engine</div>
          </div>
        </div>
        <div style={s.badge}>🛡 THC-Compliant AI</div>
      </div>

      <div style={s.main}>
        <div style={s.hero}>Content that<br /><span style={s.heroAccent}>hits different.</span></div>
        <p style={s.heroSub}>Platform-aware AI content for hemp-derived THC beverages. Every post pre-screened for compliance — no flagged terms, no shadowbans.</p>

        <div style={s.panel}>
          <div style={s.grid2}>
            <div>
              <label style={s.fieldLabel}>Content topic / source</label>
              <input style={s.input} value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Power Slap event in New Orleans" />
            </div>
            <div>
              <label style={s.fieldLabel}>Product to feature (optional)</label>
              <select style={s.select} value={product} onChange={e => setProduct(e.target.value)}>
                {PRODUCTS.map(p => <option key={p.v} value={p.v}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={s.fieldLabel}>Target persona</label>
              <select style={s.select} value={persona} onChange={e => setPersona(e.target.value)}>
                {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={s.fieldLabel}>Tone</label>
              <select style={s.select} value={tone} onChange={e => setTone(e.target.value)}>
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={s.fieldLabel}>Extra context (optional)</label>
              <textarea style={s.textarea} value={ctx} onChange={e => setCtx(e.target.value)} placeholder="e.g. Sold out samples at venue, crowd loved the Elixir, Dana White was there..." />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={s.fieldLabel}>Content pillar</label>
            <div style={s.chips}>
              {PILLARS.map(p => (
                <Chip key={p.v} label={p.label} active={pillar === p.v} onClick={() => setPillar(p.v)} />
              ))}
            </div>
          </div>

          <div>
            <label style={s.fieldLabel}>Generate for platforms</label>
            <div style={s.platGrid}>
              {PLATFORM_LIST.map(p => (
                <PlatToggle key={p} label={p} active={selectedPlats.includes(p)} onClick={() => togglePlat(p)} />
              ))}
            </div>
          </div>

          {loading && (
            <div style={s.progWrap}>
              <div style={s.progBar}>
                <div style={{ height: "100%", background: "#803cee", borderRadius: 3, animation: "none", width: "60%" }} />
              </div>
              <div style={s.progMsg}>GENERATING COMPLIANT CONTENT...</div>
            </div>
          )}

          {error && <div style={s.errBox}>{error}</div>}

          <button style={loading ? s.genBtnDis : s.genBtn} disabled={loading} onClick={generate}>
            {loading ? "GENERATING..." : "⚡ GENERATE CONTENT"}
          </button>
        </div>

        {posts.length > 0 && (
          <div>
            <div style={s.resHeader}>
              <div style={s.resTitle}>YOUR CONTENT SUITE</div>
              <button style={s.copyAllBtn} onClick={copyAll}>COPY ALL</button>
            </div>

            <div style={s.postsGrid}>
              {posts.map((post, i) => {
                const cfg = PCFG[post.platform] || { risk: "safe", rl: "", col: "#803cee", lim: null };
                const len = (post.content || "").length;
                const over = cfg.lim && len > cfg.lim;
                return (
                  <div key={i} style={isWide(post.platform) ? s.pcardWide : s.pcard}>
                    <div style={s.pcardHead}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: cfg.col }}>{post.platform}</span>
                      <PillBadge risk={cfg.risk} label={cfg.rl} />
                    </div>
                    <div style={s.pcardBody}>
                      <div style={s.postTxt}>{post.content}</div>
                      {post.compliance_notes && <div style={s.compNote}>{post.compliance_notes}</div>}
                    </div>
                    <div style={s.pcardFoot}>
                      <span style={over ? s.charsOver : s.chars}>{len.toLocaleString()}{cfg.lim ? ` / ${cfg.lim.toLocaleString()} chars` : " chars"}{over ? " ⚠ over" : ""}</span>
                      <button style={copied[i] ? s.cpyBtnDone : s.cpyBtn} onClick={() => copyPost(i, post.content)}>
                        {copied[i] ? "COPIED ✓" : "COPY"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {summary && (
              <div style={s.sumNote}>
                <strong style={{ color: "#803cee", fontWeight: 600, fontFamily: "'Montserrat', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12 }}>Compliance summary:</strong> {summary}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
