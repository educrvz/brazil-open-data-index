import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Download,
  Github,
} from "lucide-react";
import catalog from "./sources.json";
import "./styles.css";

const accessOrder = ["Open API", "Open", "Free key", "Restricted", "Paid"];
const GEO_LANGUAGE_COOKIE = "bodi_default_language";
const USER_LANGUAGE_COOKIE = "bodi_language";
const CATEGORY_ORDER = [
  "Finance, budget & transparency",
  "Statistics, economy & labor",
  "Business, tax & trade",
  "Land, agriculture & environment",
  "Health, education & research",
  "Security, justice & politics",
  "Infrastructure, utilities & transport",
  "Meta-catalogs & civic infrastructure",
  "Other / cross-domain",
];

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
    start: "Começar por dados.gov.br",
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

function compactUrl(url) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function getCategory(source) {
  const domain = source.domain.toLowerCase();
  const text = `${source.name} ${source.domain} ${source.description}`.toLowerCase();

  if (
    domain.includes("finance") ||
    domain.includes("budget") ||
    domain.includes("transparency") ||
    domain.includes("procurement") ||
    domain.includes("taxation")
  ) {
    return "Finance, budget & transparency";
  }

  if (
    domain.includes("macroeconomy") ||
    domain.includes("statistics") ||
    domain.includes("labor") ||
    domain.includes("banking") ||
    domain.includes("demographics")
  ) {
    return "Statistics, economy & labor";
  }

  if (
    domain.includes("business") ||
    domain.includes("company") ||
    domain.includes("registry") ||
    domain.includes("trade") ||
    text.includes("cnpj") ||
    text.includes("comex")
  ) {
    return "Business, tax & trade";
  }

  if (
    domain.includes("land") ||
    domain.includes("geospatial") ||
    domain.includes("environment") ||
    domain.includes("agriculture") ||
    domain.includes("weather")
  ) {
    return "Land, agriculture & environment";
  }

  if (
    domain.includes("health") ||
    domain.includes("education") ||
    domain.includes("social") ||
    domain.includes("research")
  ) {
    return "Health, education & research";
  }

  if (
    domain.includes("security") ||
    domain.includes("justice") ||
    domain.includes("politics") ||
    domain.includes("law") ||
    domain.includes("legislature")
  ) {
    return "Security, justice & politics";
  }

  if (
    domain.includes("infrastructure") ||
    domain.includes("utilities") ||
    domain.includes("telecom") ||
    domain.includes("transport") ||
    domain.includes("energy") ||
    domain.includes("tourism") ||
    domain.includes("culture")
  ) {
    return "Infrastructure, utilities & transport";
  }

  if (domain.includes("meta-catalog") || domain.includes("open data") || domain.includes("multi-domain")) {
    return "Meta-catalogs & civic infrastructure";
  }

  return "Other / cross-domain";
}

function readCookie(name) {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split("=")[1];
}

function getInitialLanguage() {
  const storedLanguage = readCookie(USER_LANGUAGE_COOKIE);
  if (storedLanguage === "en" || storedLanguage === "pt") return storedLanguage;

  const geoLanguage = readCookie(GEO_LANGUAGE_COOKIE);
  if (geoLanguage === "en" || geoLanguage === "pt") return geoLanguage;

  return navigator.language?.toLowerCase().startsWith("pt") ? "pt" : "en";
}

function saveUserLanguage(language) {
  document.cookie = `${USER_LANGUAGE_COOKIE}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function SourceCard({ source, t }) {
  return (
    <article className="source-card">
      <div className="source-card__top">
        <div>
          <h2>{source.name}</h2>
        </div>
        <a className="card-arrow" href={source.url} target="_blank" rel="noreferrer" aria-label={source.name}>
          <ArrowUpRight size={15} />
        </a>
      </div>

      <p>{source.description}</p>

      <div className="endpoint">{compactUrl(source.url)}</div>

      <div className="source-card__footer">
        <span className={`access access--${source.accessType.toLowerCase().replaceAll(" ", "-")}`}>
          {t.accessTypes[source.accessType] ?? source.accessType}
        </span>
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
  const { sources } = catalog;
  const [language, setLanguage] = useState(getInitialLanguage);
  const [category, setCategory] = useState("All");
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
    document.title = t.title;
  }, [language, t.title]);

  const categories = useMemo(
    () => [
      { name: "All", count: sources.length },
      ...CATEGORY_ORDER.map((name) => ({
        name,
        count: sources.filter((source) => getCategory(source) === name).length,
      })).filter((item) => item.count > 0),
    ],
    [sources],
  );

  const filtered = useMemo(() => {
    return sources.filter((source) => {
      return category === "All" || getCategory(source) === category;
    });
  }, [category, sources]);

  const chooseLanguage = (nextLanguage) => {
    saveUserLanguage(nextLanguage);
    setLanguage(nextLanguage);
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
                  onClick={() => chooseLanguage(item)}
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
              <div className="access-strip" aria-label={t.filters.access}>
                <span>
                  <strong>{t.accessTypes.Open}</strong>
                  {language === "pt" ? "Acesso público" : "Public access"}
                </span>
                <span>
                  <strong>{t.accessTypes["Open API"]}</strong>
                  API
                </span>
                <span>
                  <strong>{t.accessTypes["Free key"]}</strong>
                  {language === "pt" ? "Cadastro rápido" : "Quick signup"}
                </span>
                <span>
                  <strong>{t.accessTypes.Restricted}</strong>
                  {language === "pt" ? "Fluxo restrito" : "Restricted flow"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="catalog" id="sources">
        <div className="catalog__inner">
          <aside className="categories" aria-label={t.filters.domain}>
            <h2>{language === "pt" ? "Categorias" : "Categories"}</h2>
            <div className="category-list">
              {categories.map((item, index) => (
                <button
                  key={item.name}
                  className={category === item.name ? "is-active" : ""}
                  onClick={() => setCategory(item.name)}
                  type="button"
                >
                  <span className="category-dot" style={{ "--dot-index": index }} />
                  <span>{item.name === "All" ? t.filters.all : item.name}</span>
                  <strong>{item.count}</strong>
                </button>
              ))}
            </div>
          </aside>

          <div className="results">
            <div className="results__header">
              <div>
                <span className="category-heading-dot" />
                <strong>{category === "All" ? t.filters.all : category}</strong>
              </div>
              <p>{filtered.length} {t.results.sources}</p>
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
