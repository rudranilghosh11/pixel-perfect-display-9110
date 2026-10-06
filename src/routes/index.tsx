import { createFileRoute } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const TITLE = "ContractGuard — Contract Clause Risk & Obligation Detection";
const DESC = "An educational NLP prototype that spots risky contract clauses and tracks obligations, trained on 510 CUAD v1 contracts. Not legal advice.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const APP = "https://contractguard-nlp.streamlit.app/";
const REPO = "https://github.com/rudranilghosh11/contractguard";

const NAV = [
  ["problem", "Problem"], ["features", "Features"], ["how", "How it works"], ["tiers", "Risk tiers"],
  ["demo", "Demo"], ["results", "Results"], ["explain", "Explainability"], ["limits", "Limitations"],
  ["team", "Team"], ["refs", "References"],
] as const;

const C = { navy: "var(--navy)", teal: "var(--teal)", med: "var(--risk-med)" };

function Ext({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>;
}

const btnPrimary = "inline-flex items-center rounded-md bg-teal px-5 py-3 text-sm font-semibold text-navy-foreground transition hover:opacity-90";
const btnGhost = "inline-flex items-center rounded-md border border-navy-foreground/40 px-5 py-3 text-sm font-semibold text-navy-foreground transition hover:bg-navy-foreground/10";

function Section({ id, eyebrow, title, children, alt }: { id: string; eyebrow: string; title: string; children: ReactNode; alt?: boolean }) {
  return (
    <section id={id} className={alt ? "bg-secondary/60" : ""}>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold text-navy md:text-4xl">{title}</h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <div className="rounded-lg border-l-4 border-teal bg-teal-soft p-4 text-sm text-navy">{children}</div>;
}

const tierStyle: Record<string, string> = {
  High: "bg-risk-high text-navy-foreground",
  Medium: "bg-risk-med text-navy",
  Low: "bg-risk-low text-navy-foreground",
};
function Tier({ t }: { t: "High" | "Medium" | "Low" }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${tierStyle[t]}`}>{t === "Low" ? "Low (protective)" : t}</span>;
}

const models = [
  { name: "Logistic Regression", Accuracy: 0.845, "Macro-F1": 0.818 },
  { name: "Linear SVM", Accuracy: 0.848, "Macro-F1": 0.815 },
  { name: "Complement NB", Accuracy: 0.806, "Macro-F1": 0.743 },
];
const byLength = [
  { name: "Short (≤40)", Accuracy: 0.862, "Macro-F1": 0.819, "High-risk recall": 0.765 },
  { name: "Medium (41–100)", Accuracy: 0.839, "Macro-F1": 0.818, "High-risk recall": 0.81 },
  { name: "Long (>100)", Accuracy: 0.792, "Macro-F1": 0.773, "High-risk recall": 0.829 },
];
const byType = [
  { name: "Distribution/Reseller", Accuracy: 0.78, "Macro-F1": 0.664, "High-risk recall": 0.73 },
  { name: "License/IP", Accuracy: 0.843, "Macro-F1": 0.749, "High-risk recall": 0.833 },
  { name: "Marketing/Alliance", Accuracy: 0.842, "Macro-F1": 0.829, "High-risk recall": 0.827 },
  { name: "Services/Maint.", Accuracy: 0.855, "Macro-F1": 0.752, "High-risk recall": 0.75 },
  { name: "Supply/Mfg.", Accuracy: 0.892, "Macro-F1": 0.746, "High-risk recall": 0.75 },
];
const coefs: { cls: string; data: { term: string; w: number }[] }[] = [
  { cls: "Non-Compete", data: [{ term: "competitive", w: 7.0 }, { term: "competitor", w: 6.1 }, { term: "competing", w: 5.2 }] },
  { cls: "Termination For Convenience", data: [{ term: "terminate", w: 6.9 }, { term: "written notice", w: 5.5 }, { term: "notice", w: 5.1 }, { term: "any time", w: 4.6 }] },
  { cls: "Uncapped Liability", data: [{ term: "liability", w: 5.9 }, { term: "except", w: 4.5 }, { term: "damages", w: 4.2 }] },
];

function ChartBox({ title, data, keys, height = 300 }: { title: string; data: object[]; keys: string[]; height?: number }) {
  const colors = [C.navy, C.teal, C.med];
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-navy">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
          <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {keys.map((k, i) => <Bar key={k} dataKey={k} fill={colors[i]} radius={[4, 4, 0, 0]} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Demo() {
  const [tab, setTab] = useState<"clause" | "obl">("clause");
  const why = ["competes", "engage", "business"];
  const text = "Neither party shall, during the term and for two years after, engage in any business that competes with the other party.";
  const tabCls = (on: boolean) => `rounded-md px-4 py-2 text-sm font-semibold transition ${on ? "bg-navy text-navy-foreground" : "text-navy hover:bg-secondary"}`;
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 rounded-lg border p-1">
          <button className={tabCls(tab === "clause")} onClick={() => setTab("clause")}>Single clause</button>
          <button className={tabCls(tab === "obl")} onClick={() => setTab("obl")}>Obligations</button>
        </div>
        <span className="rounded-full border-2 border-risk-med bg-risk-med/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-navy">
          Sample output (static illustration, not live)
        </span>
      </div>
      {tab === "clause" ? (
        <div className="mt-6 space-y-5">
          <p className="rounded-lg bg-secondary p-5 font-serif text-lg leading-relaxed text-navy">
            {text.split(/(\s+)/).map((w, i) =>
              why.some((k) => w.toLowerCase().startsWith(k)) ? <mark key={i} className="rounded bg-teal-soft px-1 font-semibold text-teal">{w}</mark> : w,
            )}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><p className="text-xs uppercase text-muted-foreground">Clause type</p><p className="mt-1 font-semibold text-navy">Non-Compete</p></div>
            <div><p className="text-xs uppercase text-muted-foreground">Risk tier</p><div className="mt-1"><Tier t="High" /></div></div>
            <div><p className="text-xs uppercase text-muted-foreground">Why (key words)</p><p className="mt-1 font-semibold text-teal">{why.join(", ")}</p></div>
          </div>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b text-xs uppercase text-muted-foreground">
              <tr>{["Sentence", "Type", "Actor", "Deadline", "Amount"].map((h) => <th key={h} className="py-3 pr-4">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {[
                ["The Distributor shall not sell competing products in the Territory.", "PROHIBITION", "Distributor", "—", "—"],
                ["The Customer shall pay all invoices within thirty (30) days of receipt.", "OBLIGATION", "Customer", "within thirty (30) days", "—"],
                ["The Licensor may audit the Licensee's records once per year.", "RIGHT", "Licensor", "—", "—"],
              ].map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`py-3 pr-4 ${i === 1 ? "font-semibold text-teal" : "text-navy"}`}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted-foreground">Rows are illustrative examples, not model output.</p>
        </div>
      )}
      <div className="mt-8"><Ext href={APP} className={btnPrimary}>Try the real model →</Ext></div>
    </div>
  );
}

function Index() {
  return (
    <div className="font-sans text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-6 py-4">
          <a href="#top" className="shrink-0 font-serif text-lg font-bold text-navy">Contract<span className="text-teal">Guard</span></a>
          <div className="ml-auto flex gap-4 text-sm text-muted-foreground">
            {NAV.map(([id, l]) => <a key={id} href={`#${id}`} className="shrink-0 hover:text-teal">{l}</a>)}
          </div>
        </nav>
      </header>

      <section id="top" className="bg-navy text-navy-foreground">
        <div className="mx-auto max-w-6xl px-6 py-28 md:py-36">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal">NLP · Legal-tech prototype</p>
          <h1 className="mt-4 text-5xl font-bold md:text-7xl">ContractGuard</h1>
          <p className="mt-6 max-w-2xl text-xl md:text-2xl">Spot risky contract clauses and track obligations before you sign.</p>
          <p className="mt-4 max-w-2xl text-navy-foreground/70">An educational NLP prototype trained on 510 real commercial contracts (CUAD v1). Not legal advice.</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Ext href={APP} className={btnPrimary}>Open live app</Ext>
            <Ext href={REPO} className={btnGhost}>View on GitHub</Ext>
          </div>
        </div>
      </section>

      <Section id="problem" eyebrow="01 · The problem" title="Small companies sign what they can't fully read">
        <p className="mb-8 max-w-3xl text-muted-foreground">Startups and small businesses often sign long contracts without a lawyer and miss risky clauses such as uncapped liability, non-competes, exclusivity and liquidated damages.</p>
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Long documents">Commercial contracts run to dozens of pages of dense boilerplate.</Card>
          <Card title="Hidden risk">Dangerous terms sit quietly among standard clauses.</Card>
          <Card title="No legal team">Founders often review contracts alone, under time pressure.</Card>
        </div>
      </Section>

      <Section id="features" eyebrow="02 · What it does" title="Four outputs for every contract" alt>
        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Clause type">Classifies each clause into 14 risk-relevant types plus “Neutral / Other”.</Card>
          <Card title="Risk tier">Assigns High / Medium / Low (protective).</Card>
          <Card title="Missing-protection warning">Warns you if no Cap On Liability clause is found.</Card>
          <Card title="Obligations register">Tags each sentence as OBLIGATION / PROHIBITION / RIGHT with actor, deadlines and amounts.</Card>
        </div>
      </Section>

      <Section id="how" eyebrow="03 · How it works" title="A transparent, classical pipeline">
        <ol className="grid gap-4 md:grid-cols-4">
          {["CUAD contracts", "Clause extraction and Neutral chunks", "TF-IDF (word 1–2 grams) + Logistic Regression", "Streamlit app with risk tiers and rule-based obligation engine"].map((s, i) => (
            <li key={s} className="relative rounded-xl border bg-card p-5 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-sm font-bold text-navy-foreground">{i + 1}</span>
              <p className="mt-3 text-sm font-medium text-navy">{s}</p>
              {i < 3 && <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-xl text-teal md:block">→</span>}
            </li>
          ))}
        </ol>
        <div className="mt-8"><Note>Train/test split is done <strong>by contract</strong> (20% test, seed 42) to avoid leakage from reused boilerplate.</Note></div>
      </Section>

      <Section id="tiers" eyebrow="04 · Risk tiers" title="How clauses are ranked" alt>
        <Note>These tiers are our own assumption, from the viewpoint of a small company signing the contract. They are not legal fact.</Note>
        <div className="mt-6 overflow-hidden rounded-xl border bg-card">
          {([
            ["High", ["Uncapped Liability", "Liquidated Damages", "Non-Compete", "Exclusivity", "Change Of Control", "Ip Ownership Assignment"]],
            ["Medium", ["Termination For Convenience", "Anti-Assignment", "Minimum Commitment", "Rofr/Rofo/Rofn", "Covenant Not To Sue", "Audit Rights"]],
            ["Low", ["Cap On Liability", "Insurance"]],
          ] as const).map(([t, items]) => (
            <div key={t} className="flex flex-col gap-3 border-b p-5 last:border-0 md:flex-row md:items-center">
              <div className="w-40 shrink-0"><Tier t={t} /></div>
              <div className="flex flex-wrap gap-2">{items.map((x) => <span key={x} className="rounded-md bg-secondary px-3 py-1 text-sm text-navy">{x}</span>)}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="demo" eyebrow="05 · Sample output" title="What the app shows you"><Demo /></Section>

      <Section id="results" eyebrow="06 · Results and audit" title="How well it works — and where it doesn't" alt>
        <div className="grid gap-6 lg:grid-cols-2">
          <ChartBox title="Model comparison" data={models} keys={["Accuracy", "Macro-F1"]} />
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold text-navy">High-risk tier (Logistic Regression)</h3>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[["Precision", "0.846"], ["Recall", "0.795"], ["F1", "0.82"]].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-teal-soft p-5"><p className="font-serif text-3xl font-bold text-navy">{v}</p><p className="mt-1 text-xs uppercase text-muted-foreground">{k}</p></div>
              ))}
            </div>
            <p className="mt-6 text-xs text-muted-foreground">Results from a single run (seed 42).</p>
          </div>
          <ChartBox title="Audit by clause length (words)" data={byLength} keys={["Accuracy", "Macro-F1", "High-risk recall"]} />
          <ChartBox title="Audit by contract type" data={byType} keys={["Accuracy", "Macro-F1", "High-risk recall"]} />
        </div>
        <div className="mt-8 rounded-xl border-2 border-navy bg-card p-6">
          <h3 className="text-lg font-semibold text-navy">Honest reading</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Long clauses score about 7 points lower in accuracy.</li>
            <li>Distribution contracts are the weakest subgroup.</li>
            <li>About 1 in 5 high-risk clauses is missed.</li>
            <li>Recall matters more than precision: a missed risky clause costs more than a false alarm.</li>
            <li>Subgroup sizes are small, so these gaps should not be over-interpreted.</li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">Results from a single run (seed 42).</p>
        </div>
      </Section>

      <Section id="explain" eyebrow="07 · Explainability" title="Top words the model relies on">
        <div className="grid gap-6 lg:grid-cols-3">
          {coefs.map((c) => (
            <div key={c.cls} className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-base font-semibold text-navy">{c.cls}</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={c.data} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" domain={[0, 8]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="term" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="w" name="Coefficient" fill={C.teal} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
        <div className="mt-6"><Note>Uncapped Liability is the weakest class (F1 0.526): it shares near-identical vocabulary with Cap On Liability, and bag-of-words cannot see negation or scope.</Note></div>
      </Section>

      <Section id="limits" eyebrow="08 · Limitations" title="What to keep in mind" alt>
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "Trained on US SEC-filed contracts only; Indian contracts may behave differently.",
            "Risk tiers are our assumption.",
            "The Neutral class assumes un-annotated text is non-risky.",
            "Bag-of-words handles negation and scope poorly.",
            "Subgroup sizes are small.",
            "Educational prototype, not legal advice.",
            "Never upload confidential contracts to a public demo.",
          ].map((l) => <li key={l} className="flex gap-3 rounded-lg bg-card p-4 text-sm text-navy shadow-sm"><span className="text-teal">●</span>{l}</li>)}
        </ul>
      </Section>

      <Section id="team" eyebrow="09 · Team" title="Team NLP-44">
        <p className="-mt-6 mb-8 text-muted-foreground">Team NLP-44, BBA(AI), Natural Language Processing CA3</p>
        <div className="grid gap-6 md:grid-cols-3">
          {[["Aarav Seth", "Team Leader · data, model, repo"], ["Aryan Bakshi", "Audit, explainability, error analysis"], ["Rudranil Ghosh", "App, pitch, report"]].map(([n, r]) => (
            <div key={n} className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-navy font-serif text-xl font-bold text-navy-foreground">{n.split(" ").map((x) => x[0]).join("")}</div>
              <h3 className="mt-4 text-lg font-semibold text-navy">{n}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="refs" eyebrow="10 · References" title="Data and links" alt>
        <ul className="space-y-3 text-sm">
          {[
            ["CUAD v1 — The Atticus Project (Hendrycks et al. 2021, CC BY 4.0)", "https://www.atticusprojectai.org/cuad"],
            ["CUAD paper (arXiv:2103.06268)", "https://arxiv.org/abs/2103.06268"],
            ["CUAD on GitHub", "https://github.com/TheAtticusProject/cuad"],
            ["CUAD on Hugging Face", "https://huggingface.co/datasets/theatticusproject/cuad"],
            ["ContractGuard project repo", REPO],
          ].map(([l, h]) => (
            <li key={h} className="rounded-lg bg-card p-4 shadow-sm">
              <p className="font-medium text-navy">{l}</p>
              <Ext href={h} className="break-all text-teal hover:underline">{h}</Ext>
            </li>
          ))}
        </ul>
      </Section>

      <footer className="bg-navy py-8 text-center text-sm text-navy-foreground/80">Educational project. Not legal advice.</footer>
    </div>
  );
}
