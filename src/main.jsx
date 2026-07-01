import React, { useEffect, useMemo, useState } from "react";
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

const copy = {
  en: {
    projectLinks: "Project links",
    language: "Language",
    eyebrow: "Brazil public datasets, APIs, portals, and bulk files",
    title: "Brazil Open Data Index",
    lede:
      "A contribution-friendly index of public Brazilian data sources across government finance, companies, health, education, land, security, infrastructure, and civic research.",
    creditPrefix: "Inspired by",
    creditName: "Open Data Index — Daily Proto",
    browse: "Browse sources",
    start: "Start with dados.gov.br",
    stats: {
      summary: "Catalog summary",
      sources: "sources",
      domains: "domains",
      levels: "levels",
      lastVerified: "last verified",
    },
    filters: {
      label: "Filters",
      search: "Search source, agency, topic...",
      domain: "Domain",
      level: "Level",
      access: "Access",
      relevance: "Project use",
      all: "All",
      clear: "Clear filters",
    },
    results: {
      of: "of",
      sources: "sources",
      contributePrefix: "To contribute, edit",
      contributeSuffix: "and open a pull request.",
    },
    card: {
      access: "Access",
      formats: "Formats",
      granularity: "Granularity",
      notSpecified: "Not specified",
      varies: "Varies",
      verified: "Verified",
      docs: "Docs",
      source: "Source",
    },
    accessTypes: {
      "Open API": "Open API",
      Open: "Open",
      "Free key": "Free key",
      Restricted: "Restricted",
      Paid: "Paid",
    },
  },
  pt: {
    projectLinks: "Links do projeto",
    language: "Idioma",
    eyebrow: "Bases públicas, APIs, portais e arquivos do Brasil",
    title: "Índice Brasileiro de Dados Abertos",
    lede:
      "Um índice aberto para contribuições com fontes públicas de dados brasileiros sobre finanças públicas, empresas, saúde, educação, território, segurança, infraestrutura e pesquisa cívica.",
    creditPrefix: "Inspirado por",
    creditName: "Open Data Index — Daily Proto",
    browse: "Explorar fontes",
    start: "Comecar por dados.gov.br",
    stats: {
      summary: "Resumo do catálogo",
      sources: "fontes",
      domains: "domínios",
      levels: "níveis",
      lastVerified: "última verificação",
    },
    filters: {
      label: "Filtros",
      search: "Buscar fonte, órgão, tema...",
      domain: "Domínio",
      level: "Nível",
      access: "Acesso",
      relevance: "Uso do projeto",
      all: "Todos",
      clear: "Limpar filtros",
    },
    results: {
      of: "de",
      sources: "fontes",
      contributePrefix: "Para contribuir, edite",
      contributeSuffix: "e abra um pull request.",
    },
    card: {
      access: "Acesso",
      formats: "Formatos",
      granularity: "Granularidade",
      notSpecified: "Não especificado",
      varies: "Varia",
      verified: "Verificado em",
      docs: "Docs",
      source: "Fonte",
    },
    accessTypes: {
      "Open API": "API aberta",
      Open: "Aberto",
      "Free key": "Chave gratuita",
      Restricted: "Restrito",
      Paid: "Pago",
    },
  },
};

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function includes(value, query) {
  return value.toLowerCase().includes(query);
}

function SourceCard({ source, t }) {
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
          {t.accessTypes[source.accessType] ?? source.accessType}
        </span>
      </div>

      <p>{source.description}</p>

      <dl className="source-facts">
        <div>
          <dt>{t.card.access}</dt>
          <dd>{source.accessMethod || t.card.notSpecified}</dd>
        </div>
        <div>
          <dt>{t.card.formats}</dt>
          <dd>{source.formats.slice(0, 4).join(", ") || t.card.notSpecified}</dd>
        </div>
        <div>
          <dt>{t.card.granularity}</dt>
          <dd>{source.granularity || t.card.varies}</dd>
        </div>
      </dl>

      <div className="source-card__footer">
        <span>{t.card.verified} {source.lastVerified}</span>
        <div className="source-card__links">
          {source.docs ? (
            <a href={source.docs} target="_blank" rel="noreferrer">
              {t.card.docs} <ArrowUpRight size={14} />
            </a>
          ) : null}
          <a href={source.url} target="_blank" rel="noreferrer">
            {t.card.source} <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}

function App() {
  const { sources, summary } = catalog;
  const [language, setLanguage] = useState("en");
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All");
  const [level, setLevel] = useState("All");
  const [access, setAccess] = useState("All");
  const [relevance, setRelevance] = useState("All");
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    document.title = t.title;
  }, [language, t.title]);

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
          <nav className="topbar" aria-label={t.projectLinks}>
            <div className="language-toggle" aria-label={t.language}>
              {["en", "pt"].map((item) => (
                <button
                  key={item}
                  className={language === item ? "is-active" : ""}
                  onClick={() => setLanguage(item)}
                  type="button"
                >
                  {item.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="https://github.com/educrvz/brazil-open-data-index" target="_blank" rel="noreferrer">
              <Github size={17} /> GitHub
            </a>
            <a href="/data/sources.csv" download>
              <Download size={17} /> CSV
            </a>
          </nav>

          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">{t.eyebrow}</p>
              <h1>{t.title}</h1>
              <p className="lede">{t.lede}</p>
              <p className="credit">
                {t.creditPrefix}{" "}
                <a href="https://daily-proto.vercel.app/open-data" target="_blank" rel="noreferrer">
                  {t.creditName}
                </a>
                .
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#sources">
                  {t.browse}
                </a>
                <a className="button" href="https://dados.gov.br/" target="_blank" rel="noreferrer">
                  {t.start}
                </a>
              </div>
            </div>

            <div className="stats-panel" aria-label={t.stats.summary}>
              <div>
                <Database size={22} />
                <strong>{summary.sourceCount}</strong>
                <span>{t.stats.sources}</span>
              </div>
              <div>
                <Globe2 size={22} />
                <strong>{summary.domains.length}</strong>
                <span>{t.stats.domains}</span>
              </div>
              <div>
                <Filter size={22} />
                <strong>{summary.levels.length}</strong>
                <span>{t.stats.levels}</span>
              </div>
              <div>
                <ShieldCheck size={22} />
                <strong>{summary.lastVerified}</strong>
                <span>{t.stats.lastVerified}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog" id="sources">
        <div className="catalog__inner">
          <aside className="filters" aria-label={t.filters.label}>
            <div className="searchbox">
              <Search size={18} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.filters.search}
              />
            </div>

            <label>
              {t.filters.domain}
              <select value={domain} onChange={(event) => setDomain(event.target.value)}>
                <option value="All">{t.filters.all}</option>
                {domains.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              {t.filters.level}
              <select value={level} onChange={(event) => setLevel(event.target.value)}>
                <option value="All">{t.filters.all}</option>
                {levels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              {t.filters.access}
              <select value={access} onChange={(event) => setAccess(event.target.value)}>
                <option value="All">{t.filters.all}</option>
                {accessTypes.map((item) => (
                  <option key={item} value={item}>{t.accessTypes[item] ?? item}</option>
                ))}
              </select>
            </label>

            <label>
              {t.filters.relevance}
              <select value={relevance} onChange={(event) => setRelevance(event.target.value)}>
                <option value="All">{t.filters.all}</option>
                {relevanceOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <button className="clear-button" onClick={clearFilters}>
              {t.filters.clear}
            </button>
          </aside>

          <div className="results">
            <div className="results__header">
              <div>
                <span className="results__count">{filtered.length}</span>
                <span> {t.results.of} {sources.length} {t.results.sources}</span>
              </div>
              <p>{t.results.contributePrefix} <code>data/sources.csv</code> {t.results.contributeSuffix}</p>
            </div>

            <div className="source-grid">
              {filtered.map((source) => (
                <SourceCard key={source.id} source={source} t={t} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
