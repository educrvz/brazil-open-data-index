import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Database,
  Download,
  Filter,
  Github,
  Globe2,
  Search,
  ShieldCheck,
} from "lucide-react";
import catalog from "./sources.json";
import "./styles.css";

const accessOrder = ["Open API", "Open", "Free key", "Restricted", "Paid"];

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function includes(value, query) {
  return value.toLowerCase().includes(query);
}

function SourceCard({ source }) {
  return (
    <article className="source-card">
      <div className="source-card__top">
        <div>
          <div className="source-card__meta">
            <span>{source.level}</span>
            {source.location && source.location !== "-" ? <span>{source.location}</span> : null}
            <span>{source.domain}</span>
          </div>
          <h2>{source.name}</h2>
        </div>
        <span className={`access access--${source.accessType.toLowerCase().replaceAll(" ", "-")}`}>
          {source.accessType}
        </span>
      </div>

      <p>{source.description}</p>

      <dl className="source-facts">
        <div>
          <dt>Access</dt>
          <dd>{source.accessMethod || "Not specified"}</dd>
        </div>
        <div>
          <dt>Formats</dt>
          <dd>{source.formats.slice(0, 4).join(", ") || "Not specified"}</dd>
        </div>
        <div>
          <dt>Granularity</dt>
          <dd>{source.granularity || "Varies"}</dd>
        </div>
      </dl>

      <div className="source-card__footer">
        <span>Verified {source.lastVerified}</span>
        <div className="source-card__links">
          {source.docs ? (
            <a href={source.docs} target="_blank" rel="noreferrer">
              Docs <ArrowUpRight size={14} />
            </a>
          ) : null}
          <a href={source.url} target="_blank" rel="noreferrer">
            Source <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}

function App() {
  const { sources, summary } = catalog;
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");
  const [level, setLevel] = useState("All");
  const [access, setAccess] = useState("All");
  const [relevance, setRelevance] = useState("All");

  const domains = useMemo(() => unique(sources.map((source) => source.domain)), [sources]);
  const levels = useMemo(() => unique(sources.map((source) => source.level)), [sources]);
  const relevanceOptions = useMemo(() => unique(sources.map((source) => source.relevance)), [sources]);
  const accessTypes = useMemo(
    () => accessOrder.filter((type) => sources.some((source) => source.accessType === type)),
    [sources],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sources.filter((source) => {
      const matchesQuery =
        !q ||
        [
          source.name,
          source.agency,
          source.domain,
          source.description,
          source.location,
          source.accessMethod,
          source.relevance,
        ].some((field) => includes(field || "", q));

      return (
        matchesQuery &&
        (domain === "All" || source.domain === domain) &&
        (level === "All" || source.level === level) &&
        (access === "All" || source.accessType === access) &&
        (relevance === "All" || source.relevance === relevance)
      );
    });
  }, [access, domain, level, query, relevance, sources]);

  const clearFilters = () => {
    setQuery("");
    setDomain("All");
    setLevel("All");
    setAccess("All");
    setRelevance("All");
  };

  return (
    <main>
      <section className="hero">
        <div className="hero__inner">
          <nav className="topbar" aria-label="Project links">
            <a href="https://github.com/educrvz/brazil-open-data-index" target="_blank" rel="noreferrer">
              <Github size={17} /> GitHub
            </a>
            <a href="/data/sources.csv" download>
              <Download size={17} /> CSV
            </a>
          </nav>

          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">Brazil public datasets, APIs, portals, and bulk files</p>
              <h1>Brazil Open Data Index</h1>
              <p className="lede">
                A contribution-friendly index of public Brazilian data sources across government finance,
                companies, health, education, land, security, infrastructure, and civic research.
              </p>
              <p className="credit">
                Inspired by{" "}
                <a href="https://daily-proto.vercel.app/open-data" target="_blank" rel="noreferrer">
                  Open Data Index — Daily Proto
                </a>
                .
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#sources">
                  Browse sources
                </a>
                <a className="button" href="https://dados.gov.br/" target="_blank" rel="noreferrer">
                  Start with dados.gov.br
                </a>
              </div>
            </div>

            <div className="stats-panel" aria-label="Catalog summary">
              <div>
                <Database size={22} />
                <strong>{summary.sourceCount}</strong>
                <span>sources</span>
              </div>
              <div>
                <Globe2 size={22} />
                <strong>{summary.domains.length}</strong>
                <span>domains</span>
              </div>
              <div>
                <Filter size={22} />
                <strong>{summary.levels.length}</strong>
                <span>levels</span>
              </div>
              <div>
                <ShieldCheck size={22} />
                <strong>{summary.lastVerified}</strong>
                <span>last verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog" id="sources">
        <div className="catalog__inner">
          <aside className="filters" aria-label="Filters">
            <div className="searchbox">
              <Search size={18} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search source, agency, topic..."
              />
            </div>

            <label>
              Domain
              <select value={domain} onChange={(event) => setDomain(event.target.value)}>
                <option>All</option>
                {domains.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Level
              <select value={level} onChange={(event) => setLevel(event.target.value)}>
                <option>All</option>
                {levels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Access
              <select value={access} onChange={(event) => setAccess(event.target.value)}>
                <option>All</option>
                {accessTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Project use
              <select value={relevance} onChange={(event) => setRelevance(event.target.value)}>
                <option>All</option>
                {relevanceOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <button className="clear-button" onClick={clearFilters}>
              Clear filters
            </button>
          </aside>

          <div className="results">
            <div className="results__header">
              <div>
                <span className="results__count">{filtered.length}</span>
                <span> of {sources.length} sources</span>
              </div>
              <p>To contribute, edit <code>data/sources.csv</code> and open a pull request.</p>
            </div>

            <div className="source-grid">
              {filtered.map((source) => (
                <SourceCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
