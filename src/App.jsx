import { useState, useCallback } from "react";

const PCFG = {
  "X (Twitter)":  { lim: 280,   risk: "safe",    rl: "Most freedom",       col: "#1d9bf0", rule: "Can mention products by name. Can link to site. Use hemp-derived framing. Avoid explicit intoxication claims." },
  "Instagram":    { lim: 2200,  risk: "caution",  rl: "Lifestyle only",     col: "#e1306c", rule: "Zero product sale language. No THC or Delta-9 in caption — use hemp or plant-based. Pure lifestyle framing. No promotional CTAs." },
  "TikTok":       { lim: 2200,  risk: "risk",     rl: "Creator brief only", col: "#fe2c55", rule: "Write as influencer creator brief — they handle compliance. No explicit product promotion. Lifestyle moments only. Avoid hashtags cannabis thc weed." },
  "LinkedIn":     { lim: 3000,  risk: "safe",     rl: "B2B friendly",       col: "#0a66c2", rule: "Professional tone. Brand milestones, retail expansion, partnerships, thought leadership. Hemp-derived alternative beverage is fine." },
  "YouTube":      { lim: 5000,  risk: "caution",  rl: "Educational OK",     col: "#ff0000", rule: "Video description only. Education and lifestyle content OK. Include 18+ note. No explicit intoxication claims." },
  "Facebook":     { lim: 63000, risk: "risk",     rl: "Community only",     col: "#1877f2", rule: "Community and lifestyle content only. No product promotions or sale language for THC. Brand storytelling with responsible use language." },
  "Email / SMS":  { lim: null,  risk: "safe",     rl: "Full freedom",       col: "#b8f23e", rule: "Full creative freedom. Can mention products, doses, deals. Include age verification note and unsubscribe reminder." },
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

const s = {
  wrap: { background: "linear-gradient(rgba(10,10,8,0.9), rgba(10,10,8,0.9)), url('/backg.webp') center/cover no-repeat fixed", minHeight: "100vh", color: "#e8e8e0", fontFamily: "'DM Sans', system-ui, sans-serif" },
  header: { padding: "20px 28px", borderBottom: "1px solid rgba(184,242,62,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logoMark: { width: 36, height: 36, background: "#b8f23e", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18, color: "#0a0a08", fontFamily: "Georgia, serif", flexShrink: 0 },
  logoName: { fontSize: 18, fontWeight: 700, letterSpacing: 3, color: "#b8f23e", lineHeight: 1, fontFamily: "Georgia, serif" },
  logoSub: { fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a6e", fontFamily: "monospace", marginTop: 2 },
  badge: { fontSize: 10, letterSpacing: 1, color: "#b8f23e", border: "1px solid rgba(184,242,62,0.4)", padding: "5px 12px", borderRadius: 20, fontFamily: "monospace", textTransform: "uppercase" },
  main: { maxWidth: 960, margin: "0 auto", padding: "32px 28px" },
  hero: { fontSize: "clamp(38px,6vw,58px)", fontWeight: 700, letterSpacing: 3, lineHeight: 0.95, marginBottom: 10, fontFamily: "Georgia, serif" },
  heroGreen: { color: "#b8f23e" },
  heroSub: { fontSize: 14, color: "#ffffff", marginBottom: 6, lineHeight: 1.7, maxWidth: 520, fontWeight: 300 },
  heroMeta: { fontSize: 14, color: "#b8f23e", marginBottom: 32, lineHeight: 1.7, maxWidth: 520, fontWeight: 400, marginTop: 0 },
  panel: { background: "#141410", border: "1px solid rgba(184,242,62,0.15)", borderRadius: 14, padding: 28, marginBottom: 24 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  fieldLabel: { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#7a7a6e", fontFamily: "monospace", fontWeight: 500, marginBottom: 6, display: "block" },
  input: { background: "#1c1c18", border: "1px solid rgba(184,242,62,0.15)", borderRadius: 9, color: "#e8e8e0", fontFamily: "inherit", fontSize: 13, padding: "10px 14px", outline: "none", width: "100%", boxSizing: "border-box" },
  select: { background: "#1c1c18", border: "1px solid rgba(184,242,62,0.15)", borderRadius: 9, color: "#e8e8e0", fontFamily: "inherit", fontSize: 13, padding: "10px 14px", outline: "none", width: "100%", boxSizing: "border-box" },
  textarea: { background: "#1c1c18", border: "1px solid rgba(184,242,62,0.15)", borderRadius: 9, color: "#e8e8e0", fontFamily: "inherit", fontSize: 13, padding: "10px 14px", outline: "none", width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 68, lineHeight: 1.6 },
  chips: { display: "flex", gap: 7, flexWrap: "wrap" },
  platGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 },
  genBtn: { width: "100%", padding: "15px", background: "#b8f23e", color: "#0a0a08", border: "none", borderRadius: 11, fontWeight: 700, fontSize: 16, letterSpacing: 2, cursor: "pointer", marginTop: 20, fontFamily: "Georgia, serif", textTransform: "uppercase" },
  genBtnDis: { width: "100%", padding: "15px", background: "#b8f23e", color: "#0a0a08", border: "none", borderRadius: 11, fontWeight: 700, fontSize: 16, letterSpacing: 2, fontFamily: "Georgia, serif", textTransform: "uppercase", marginTop: 20, opacity: 0.4, cursor: "not-allowed" },
  errBox: { marginTop: 12, padding: "12px 16px", background: "rgba(224,96,96,0.1)", border: "1px solid rgba(224,96,96,0.3)", borderRadius: 10, color: "#e06060", fontSize: 12, fontFamily: "monospace", lineHeight: 1.6 },
  progWrap: { marginTop: 12 },
  progBar: { height: 2, background: "rgba(184,242,62,0.15)", borderRadius: 2, overflow: "hidden" },
  progMsg: { textAlign: "center", fontFamily: "monospace", fontSize: 11, color: "#b8f23e", letterSpacing: 1, padding: "10px 0 0" },
  resHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  resTitle: { fontSize: 26, fontWeight: 700, letterSpacing: 2, color: "#b8f23e", fontFamily: "Georgia, serif" },
  copyAllBtn: { padding: "7px 16px", border: "1px solid rgba(184,242,62,0.4)", borderRadius: 7, background: "transparent", color: "#b8f23e", fontFamily: "monospace", fontSize: 10, letterSpacing: 1, cursor: "pointer" },
  postsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  pcard: { background: "#141410", border: "1px solid rgba(184,242,62,0.15)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column" },
  pcardWide: { background: "#141410", border: "1px solid rgba(184,242,62,0.15)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", gridColumn: "1 / -1" },
  pcardHead: { padding: "11px 15px", borderBottom: "1px solid rgba(184,242,62,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  pcardBody: { padding: 16, flex: 1 },
  postTxt: { fontSize: 13, lineHeight: 1.75, color: "#e8e8e0", whiteSpace: "pre-wrap", fontWeight: 300 },
  compNote: { marginTop: 10, padding: "8px 10px", background: "#242420", borderRadius: 7, fontSize: 11, color: "#7a7a6e", lineHeight: 1.6, fontFamily: "monospace" },
  pcardFoot: { padding: "10px 15px", borderTop: "1px solid rgba(184,242,62,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" },
  chars: { fontFamily: "monospace", fontSize: 10, color: "#4a4a40" },
  charsOver: { fontFamily: "monospace", fontSize: 10, color: "#e06060" },
  cpyBtn: { padding: "5px 12px", border: "1px solid rgba(184,242,62,0.15)", borderRadius: 5, background: "transparent", color: "#7a7a6e", fontSize: 10, fontFamily: "monospace", cursor: "pointer" },
  cpyBtnDone: { padding: "5px 12px", border: "1px solid #b8f23e", borderRadius: 5, background: "transparent", color: "#b8f23e", fontSize: 10, fontFamily: "monospace", cursor: "pointer" },
  sumNote: { marginTop: 20, padding: "14px 18px", background: "#1c1c18", border: "1px solid rgba(184,242,62,0.15)", borderRadius: 11, fontSize: 13, color: "#7a7a6e", lineHeight: 1.7 },
};

function Chip({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "6px 14px", borderRadius: 20, border: active ? "1px solid #b8f23e" : "1px solid rgba(184,242,62,0.15)", fontSize: 12, fontWeight: 500, cursor: "pointer", background: active ? "#2a3a0e" : "#1c1c18", color: active ? "#b8f23e" : "#7a7a6e", transition: "all 0.15s" }}>
      {label}
    </div>
  );
}

function PlatToggle({ label, active, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "9px 12px", borderRadius: 9, border: active ? "1px solid #b8f23e" : "1px solid rgba(184,242,62,0.15)", background: active ? "#2a3a0e" : "#1c1c18", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: active ? "#b8f23e" : "#7a7a6e", fontWeight: 500, transition: "all 0.15s" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? "#b8f23e" : "#4a4a40", flexShrink: 0, display: "inline-block" }} />
      {label}
    </div>
  );
}

function PillBadge({ risk, label }) {
  const colors = {
    safe:    { color: "#5dca8a", border: "rgba(93,202,138,0.3)",  bg: "rgba(93,202,138,0.08)" },
    caution: { color: "#f2c14e", border: "rgba(242,193,78,0.3)",  bg: "rgba(242,193,78,0.08)" },
    risk:    { color: "#e06060", border: "rgba(224,96,96,0.3)",   bg: "rgba(224,96,96,0.08)" },
  };
  const c = colors[risk] || colors.safe;
  return <span style={{ fontSize: 9, fontFamily: "monospace", padding: "3px 9px", borderRadius: 9, border: `1px solid ${c.border}`, background: c.bg, color: c.color }}>{label}</span>;
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

    const prompt = `You are a casual, punchy social media writer for Gorilla Beverages (gorillalifestyle.com) — a Miami-based hemp-derived THC beverage brand. Partnership with Power Slap / UFC. Farm Bill compliant, lab tested, ships nationwide.

Products: Gorilla Elixir THC Drink (Delta-9, 2.5–5mg), THC/CBD/HHC 20mg energy shots, UNTAMED 50mg Delta-9 shot, Delta-9 gummies.

VOICE & LENGTH — THIS IS CRITICAL:
- Write like a friend texting, not a marketing department. Short sentences. Casual. Real.
- Every post MUST be well under its platform character limit — aim for 50-70% of the max. Shorter is always better.
- X posts: 1-2 punchy sentences max. No filler.
- Instagram/TikTok: 2-3 short lines. Let the visual do the work.
- LinkedIn: Keep it tight — 3-4 sentences, not an essay.
- YouTube: Brief description, not a blog post.
- Facebook: Conversational, 2-3 sentences.
- Email/SMS: Get to the point fast.
- Cut the fluff. No corporate jargon. No walls of text. If a word doesn't earn its spot, delete it.
- Use 1-3 relevant hashtags max (not a hashtag dump).

BRAND: "Clean buzz, no hangover." Alcohol alternative. Premium but approachable.

TASK:
- Topic: ${topic}
- Pillar: ${pillar}
- Product: ${product || "brand awareness, no specific product"}
- Persona: ${persona}
- Tone: ${tone}
- Extra context: ${ctx || "none"}

PLATFORM RULES:
${platRules}

COMPLIANCE (all platforms):
- NEVER say: high, stoned, buzzed, intoxicated, get you high, psychoactive
- USE instead: clean buzz, smooth, balanced, functional, relaxed, hemp-derived
- No consumption depictions, health claims, or minor targeting
- Frame as lifestyle / alcohol alternative

Respond ONLY with valid JSON, no markdown:
{"posts":[{"platform":"exact platform name","content":"post text","compliance_notes":"brief note"}],"summary":"1-2 sentence compliance summary"}

Platforms: ${selectedPlats.join(", ")}`;

    try {
      const res = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
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
        <img src="/gorilla_lifestyle_logo.avif" alt="Gorilla Lifestyle" style={{ height: 48, display: "block" }} />
        <div style={s.badge}>🛡 THC-Compliant AI</div>
      </div>

      <div style={s.main}>
        <div style={s.hero}>CONTENT THAT<br /><span style={s.heroGreen}>HITS DIFFERENT.</span></div>
        <p style={s.heroSub}>Platform-aware AI content for hemp-derived THC beverages.</p>
        <p style={s.heroMeta}>Every post pre-screened for compliance — no flagged terms, no shadowbans.</p>

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
                <div style={{ height: "100%", background: "#b8f23e", borderRadius: 2, animation: "none", width: "60%" }} />
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
                const cfg = PCFG[post.platform] || { risk: "safe", rl: "", col: "#b8f23e", lim: null };
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
                <strong style={{ color: "#b8f23e", fontWeight: 500 }}>Compliance summary:</strong> {summary}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
