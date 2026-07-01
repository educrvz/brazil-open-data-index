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

const CATEGORY_LABELS_PT = {
  "All": "Todos",
  "Finance, budget & transparency": "Finanças, orçamento e transparência",
  "Statistics, economy & labor": "Estatísticas, economia e trabalho",
  "Business, tax & trade": "Empresas, impostos e comércio",
  "Land, agriculture & environment": "Território, agro e meio ambiente",
  "Health, education & research": "Saúde, educação e pesquisa",
  "Security, justice & politics": "Segurança, justiça e política",
  "Infrastructure, utilities & transport": "Infraestrutura, serviços e transporte",
  "Meta-catalogs & civic infrastructure": "Metacatálogos e infraestrutura cívica",
  "Other / cross-domain": "Outros / transversais",
};

const LEVEL_LABELS_PT = {
  "Federal": "Federal",
  "Federal (academic)": "Federal (acadêmico)",
  "Federal (all courts)": "Federal (todos os tribunais)",
  "Federal (all levels)": "Federal (todos os níveis)",
  "Federal (notary network)": "Federal (rede de cartórios)",
  "Federal (private exchange)": "Federal (bolsa privada)",
  "Municipal": "Municipal",
  "State": "Estadual",
};

const DOMAIN_LABELS_PT = {
  "Agribusiness price indicators": "Indicadores de preços do agronegócio",
  "Agriculture & livestock": "Agricultura e pecuária",
  "Air transport": "Transporte aéreo",
  "Banking, payments, financial system": "Bancos, pagamentos e sistema financeiro",
  "Business & company registry": "Empresas e registro empresarial",
  "Business dynamics": "Dinâmica empresarial",
  "Business registry": "Registro empresarial",
  "Capital markets / securities": "Mercado de capitais / valores mobiliários",
  "Company incorporation registry": "Registro de abertura de empresas",
  "Crops / harvests / stocks / prices": "Safras / colheitas / estoques / preços",
  "Culture": "Cultura",
  "Deforestation / land cover": "Desmatamento / cobertura do solo",
  "Demographics & census": "Demografia e censo",
  "Demographics / socio-economic": "Demografia / socioeconômico",
  "Demographics, economy, agriculture, prices": "Demografia, economia, agricultura e preços",
  "Education": "Educação",
  "Elections": "Eleições",
  "Electricity": "Energia elétrica",
  "Energy planning / grid": "Planejamento energético / rede",
  "Environmental enforcement": "Fiscalização ambiental",
  "Federal budget": "Orçamento federal",
  "Fire / burned area": "Fogo / área queimada",
  "Foreign trade": "Comércio exterior",
  "Formal labor market": "Mercado formal de trabalho",
  "Geospatial / base cartography": "Geoespacial / cartografia base",
  "Geospatial / geology": "Geoespacial / geologia",
  "Geospatial / reference / classifications": "Geoespacial / referência / classificações",
  "Geospatial catalog": "Catálogo geoespacial",
  "Gov finance & transparency": "Finanças públicas e transparência",
  "Gov finance (states & municipalities)": "Finanças públicas (estados e municípios)",
  "Gov finance / debt / costs": "Finanças públicas / dívida / custos",
  "Health (fast mirror)": "Saúde (espelho rápido)",
  "Health (modern API)": "Saúde (API moderna)",
  "Health (raw microdata)": "Saúde (microdados brutos)",
  "Health facilities registry": "Cadastro de estabelecimentos de saúde",
  "Health statistics": "Estatísticas de saúde",
  "Health surveillance / products": "Vigilância sanitária / produtos",
  "Higher education / research": "Ensino superior / pesquisa",
  "Intellectual property": "Propriedade intelectual",
  "Judiciary / case data": "Judiciário / dados processuais",
  "Judiciary / legal": "Judiciário / jurídico",
  "Judiciary statistics": "Estatísticas do Judiciário",
  "Land - georeferencing/certification": "Terras - georreferenciamento/certificação",
  "Land cadastre (georeferenced)": "Cadastro fundiário georreferenciado",
  "Land use & land cover / fire / water": "Uso e cobertura do solo / fogo / água",
  "Laws & norms": "Leis e normas",
  "Legislative": "Legislativo",
  "Macroeconomy / S&T": "Macroeconomia / C&T",
  "Macroeconomy / indicators": "Macroeconomia / indicadores",
  "Macroeconomy / regional / social series": "Macroeconomia / séries regionais / sociais",
  "Macroeconomy / statistics": "Macroeconomia / estatísticas",
  "Meta-catalog": "Metacatálogo",
  "Meta-catalog / treated datalake": "Metacatálogo / datalake tratado",
  "Money, banking, macro-financial series": "Moeda, bancos e séries macrofinanceiras",
  "Multi-domain (open data)": "Multidomínio (dados abertos)",
  "Municipal profiles": "Perfis municipais",
  "Oil, gas & fuels": "Petróleo, gás e combustíveis",
  "Private health insurance": "Saúde suplementar",
  "Public procurement": "Compras públicas",
  "Public procurement & contracts": "Compras públicas e contratos",
  "Public procurement (price reference)": "Compras públicas (preços de referência)",
  "Public security": "Segurança pública",
  "Public security & crime": "Segurança pública e criminalidade",
  "Real estate registry (cartórios)": "Registro imobiliário (cartórios)",
  "Research / S&T human capital": "Pesquisa / capital humano em C&T",
  "Road / rail transport": "Transporte rodoviário / ferroviário",
  "Road infrastructure": "Infraestrutura rodoviária",
  "Rural environmental registry": "Cadastro ambiental rural",
  "Rural property (unified citizen view)": "Imóvel rural (visão unificada do cidadão)",
  "Rural property registry": "Cadastro de imóveis rurais",
  "Social programs & welfare": "Programas sociais e assistência",
  "Stock/derivatives market": "Mercado de ações/derivativos",
  "Taxation & fiscal": "Tributação e fiscal",
  "Taxation / fiscal / registry": "Tributação / fiscal / cadastros",
  "Telecom & connectivity": "Telecomunicações e conectividade",
  "Tourism": "Turismo",
  "Voluntary transfers / agreements": "Transferências voluntárias / convênios",
  "Water resources / hydrology": "Recursos hídricos / hidrologia",
  "Waterway / port transport": "Transporte aquaviário / portos",
  "Weather / climate": "Tempo / clima",
};

const TEXT_REPLACEMENTS_PT = [
  ["Manual browser check 2026-07-01: normal portal link works; Swagger API docs link removed.", "Verificação manual no navegador em 2026-07-01: o link normal do portal funciona; o link da documentação Swagger da API foi removido."],
  ["Manual browser check 2026-07-01: did not load.", "Verificação manual no navegador em 2026-07-01: não carregou."],
  ["Manual browser check 2026-07-01: works.", "Verificação manual no navegador em 2026-07-01: funciona."],
  ["API + web query + bulk download", "API + consulta web + download em lote"],
  ["API + web query", "API + consulta web"],
  ["API + dashboards + download", "API + painéis + download"],
  ["API + bulk download", "API + download em lote"],
  ["API + bulk", "API + lote"],
  ["web query + export", "consulta web + exportação"],
  ["web query + download", "consulta web + download"],
  ["web query + dynamic tables", "consulta web + tabelas dinâmicas"],
  ["web query + panels", "consulta web + painéis"],
  ["web query", "consulta web"],
  ["web panel", "painel web"],
  ["web panels", "painéis web"],
  ["web search + download", "busca web + download"],
  ["web tabulation + FTP microdata", "tabulação web + microdados via FTP"],
  ["bulk download", "download em lote"],
  ["bulk CSV", "CSV em lote"],
  ["download + dashboards", "download + painéis"],
  ["dashboards + download", "painéis + download"],
  ["dashboards + report download", "painéis + download de relatórios"],
  ["interactive web + bulk download", "web interativa + download em lote"],
  ["interactive query + panels", "consulta interativa + painéis"],
  ["panel web + download", "painel web + download"],
  ["service portal", "portal de serviços"],
  ["mostly no open API", "geralmente sem API aberta"],
  ["mostly no public API", "geralmente sem API pública"],
  ["no documented API", "sem API documentada"],
  ["normal portal link", "link normal do portal"],
  ["API docs link removed", "link da documentação da API removido"],
  ["Data source", "Fonte de dados"],
  ["BigQuery SQL + Python/R/Stata pkgs + CSV download", "BigQuery SQL + pacotes Python/R/Stata + download CSV"],
  ["API (OData) + R/Python pkgs + web query", "API (OData) + pacotes R/Python + consulta web"],
  ["API (REST v3) + web query builder + sidrapy/sidrar", "API (REST v3) + construtor de consulta web + sidrapy/sidrar"],
  ["CKAN API + bulk download", "API CKAN + download em lote"],
  ["FTP bulk download (or Base dos Dados mirror)", "download em lote via FTP (ou espelho da Base dos Dados)"],
  ["GEE + map platform + raster download", "GEE + plataforma de mapas + download raster"],
  ["S3 sync + bulk download", "sincronizacao S3 + download em lote"],
  ["download (free EOD) + paid feeds", "download gratuito de fechamento + feeds pagos"],
  ["download + dashboards + GIS", "download + painéis + GIS"],
  ["download + map", "download + mapa"],
  ["download + panels + web query", "download + painéis + consulta web"],
  ["download + web catalog + CKAN API", "download + catálogo web + API CKAN"],
  ["download + web systems", "download + sistemas web"],
  ["web query + API + bulk CSV", "consulta web + API + CSV em lote"],
  ["web query + API + bulk download", "consulta web + API + download em lote"],
  ["web query + OGC services", "consulta web + serviços OGC"],
  ["web query + download + API", "consulta web + download + API"],
  ["web query + download + GIS", "consulta web + download + GIS"],
  ["web query + maps", "consulta web + mapas"],
  ["web query / panels", "consulta web / painéis"],
  ["web/app (login)", "web/app (login)"],
  ["Master federal catalog", "Catálogo federal principal"],
  ["Hundreds of cleaned, cross-joinable public datasets", "Centenas de bases públicas tratadas e cruzáveis"],
  ["Thousands of macro, regional and social time series", "Milhares de séries temporais macroeconômicas, regionais e sociais"],
  ["Full federal budget", "Orçamento federal completo"],
  ["authorization vs execution", "autorização versus execução"],
  ["organ/function/program/action", "órgão/função/programa/ação"],
  ["budget line / program / organ", "linha orçamentária / programa / órgão"],
  ["in one datalake with consistent municipality keys", "em um único datalake com chaves municipais consistentes"],
  ["municipal to microdata", "municipal a microdados"],
  ["GDP & state GDP", "PIB e PIB estadual"],
  ["poverty", "pobreza"],
  ["curated from primary sources", "curadas a partir de fontes primárias"],
  ["queryable by code", "consultáveis por código"],
  ["incl. to municipalities", "incl. para municípios"],
  ["Has API/WebService", "Tem API/WebService"],
  ["payroll inconsistency notice", "aviso de inconsistência na folha"],
  ["Pair with", "Combine com"],
  ["Linked state open-data portal", "Vinculado ao portal estadual de dados abertos"],
  ["New version at", "Nova versão em"],
  ["open data via separate Dados Vitória API", "dados abertos via API separada Dados Vitória"],
  ["from Jul/2025", "desde jul/2025"],
  ["country to municipality", "país a município"],
  ["Non-identified microdata of every formal employment bond", "Microdados não identificados de cada vínculo formal de emprego"],
  ["hires/separations", "admissões/desligamentos"],
  ["wages", "salários"],
  ["occupation", "ocupação"],
  ["tenure", "tempo de vínculo"],
  ["demographics by municipality", "demografia por município"],
  ["by numeric series code", "por código numérico da série"],
  ["PIX statistics", "estatísticas do PIX"],
  ["Open Finance", "Open Finance"],
  ["bank balance sheets", "balanços bancários"],
  ["means-of-payment", "meios de pagamento"],
  ["institutions registry", "cadastro de instituições"],
  ["Focus expectations", "expectativas Focus"],
  ["End-of-day historical quotes", "cotações históricas de fechamento"],
  ["real-time/tick data is commercial", "dados em tempo real/tick são comerciais"],
  ["National directory of state Juntas Comerciais", "Diretório nacional das Juntas Comerciais estaduais"],
  ["index to find the competent junta per UF", "índice para encontrar a junta competente por UF"],
  ["of new SP businesses", "de novas empresas de SP"],
  ["Web protocol, simplified certificate", "Protocolo web, certidão simplificada"],
  ["registration of acts", "registro de atos"],
  ["by product", "por produto"],
  ["municipality of declaring firm", "município da empresa declarante"],
  ["ICMS, IPVA, ITCMD collections", "arrecadação de ICMS, IPVA e ITCMD"],
  ["tax waivers by municipality", "renúncias fiscais por município"],
  ["Self-declared rural property boundaries", "Limites autodeclarados de imóveis rurais"],
  ["legal reserve", "reserva legal"],
  ["land-use polygons", "polígonos de uso do solo"],
  ["Query by CPF/CNPJ", "Consulta por CPF/CNPJ"],
  ["Conecta API for gov", "API Conecta para governo"],
  ["Unified view of a holder's properties", "Visão unificada dos imóveis de um titular"],
  ["across CAR+SNCR+SIGEF", "entre CAR+SNCR+SIGEF"],
  ["CAR receipt", "recibo do CAR"],
  ["by biome", "por bioma"],
  ["Active fire foci & burned-area products", "Focos de fogo ativo e produtos de área queimada"],
  ["Brazil & Latin America", "Brasil e América Latina"],
  ["spatial & temporal series", "séries espaciais e temporais"],
  ["Annual land-cover/use maps", "Mapas anuais de cobertura/uso do solo"],
  ["regeneration", "regeneração"],
  ["fire scars", "cicatrizes de fogo"],
  ["water surface", "superfície de água"],
  ["mining", "mineração"],
  ["by pixel/municipality/biome", "por pixel/município/bioma"],
  ["River flow/level", "Vazão/nível de rios"],
  ["rainfall", "chuva"],
  ["water quality", "qualidade da água"],
  ["reservoir levels", "níveis de reservatórios"],
  ["water-use grants", "outorgas de uso da água"],
  ["by station & basin", "por estação e bacia"],
  ["Historical & automatic weather-station data", "Dados históricos e automáticos de estações meteorológicas"],
  ["temperature", "temperatura"],
  ["humidity", "umidade"],
  ["wind", "vento"],
  ["pressure", "pressão"],
  ["forecasts/warnings", "previsões/alertas"],
  ["Embargoed areas", "áreas embargadas"],
  ["fines/infractions", "multas/autuações"],
  ["deforestation authorizations", "autorizações de desmatamento"],
  ["cross-referencable with", "cruzável com"],
  ["from dezenas de produtores", "de dezenas de produtores"],
  ["Geology, relief, biomes, cartography", "Geologia, relevo, biomas, cartografia"],
  ["territorial meshes", "malhas territoriais"],
  ["geodesic network", "rede geodésica"],
  ["base layers for geocoding & maps", "camadas base para geocodificação e mapas"],
  ["national to Census tract", "nacional a setor censitário"],
  ["metadata search for", "busca de metadados para"],
  ["Full municipal GIS", "GIS municipal completo"],
  ["cadastral lots", "lotes cadastrais"],
  ["zoning", "zoneamento"],
  ["IPTU value zones", "zonas de valor do IPTU"],
  ["street network", "malha viária"],
  ["Mortality", "Mortalidade"],
  ["births", "nascimentos"],
  ["notifiable diseases", "doenças de notificação compulsória"],
  ["hospital/ambulatory production", "produção hospitalar/ambulatorial"],
  ["immunization", "imunização"],
  ["by município", "por município"],
  ["Raw historical files", "Arquivos históricos brutos"],
  ["for robust ETL", "para ETL robusto"],
  ["High-speed mirror", "Espelho de alta velocidade"],
  ["parallel sync & transaction logs", "sincronização paralela e logs de transação"],
  ["Every health facility", "Todo estabelecimento de saúde"],
  ["type, beds", "tipo, leitos"],
  ["Core for healthcare-enablement mapping", "Base para mapeamento de infraestrutura de saúde"],
  ["Modern REST endpoints over selected health databases", "Endpoints REST modernos sobre bases selecionadas de saúde"],
  ["without TabNet", "sem TabNet"],
  ["by operator/municipality/plan", "por operadora/município/plano"],
  ["Hub for all INEP microdata", "Hub para todos os microdados do INEP"],
  ["plus dictionaries and questionnaires", "além de dicionários e questionários"],
  ["schools, classes, teachers", "escolas, turmas, professores"],
  ["by school/municipality", "por escola/município"],
  ["ENEM scores/items/questionnaires", "notas/itens/questionários do ENEM"],
  ["courses, faculty, vacancies", "cursos, docentes, vagas"],
  ["targets by network/municipality", "metas por rede/município"],
  ["by program/institution/area", "por programa/instituição/área"],
  ["public metadata for judicial cases", "metadados públicos de processos judiciais"],
  ["movements", "movimentos"],
  ["by court/segment", "por tribunal/segmento"],
  ["some CSV", "alguns CSV"],
  ["search of STF acórdãos", "busca de acórdãos do STF"],
  ["decisions, súmulas, full text", "decisões, súmulas, texto completo"],
  ["panels on distribution/decisions/repercussão geral", "painéis sobre distribuição/decisões/repercussão geral"],
  ["Cases in progress", "processos em tramitação"],
  ["full texts & metadata", "textos integrais e metadados"],
  ["plus jurisdictional & administrative datasets", "além de bases jurisdicionais e administrativas"],
  ["and some state", "e algumas estaduais"],
  ["normative acts", "atos normativos"],
  ["structured search", "busca estruturada"],
  ["candidates & results to polling section", "candidatos e resultados até seção eleitoral"],
  ["donations/expenses", "doações/despesas"],
  ["electorate by municipality/zone", "eleitorado por município/zona"],
  ["ballot-box logs", "logs de urna"],
  ["Senators, legislative matters, votings", "senadores, matérias legislativas, votações"],
  ["plus Siga Brasil budget link", "além do link orçamentário do Siga Brasil"],
  ["by municipality", "por município"],
  ["panel for CadÚnico information management and IVCAD", "painel para gestão da informação do CadÚnico e IVCAD"],
  ["by class/region", "por classe/região"],
  ["biofuels", "biocombustíveis"],
  ["National Energy Balance", "Balanço Energético Nacional"],
  ["generation/load by subsystem", "geração/carga por subsistema"],
  ["planning geodata", "geodados de planejamento"],
  ["by airport/route", "por aeroporto/rota"],
  ["by organ/function/program/action", "por órgão/função/programa/ação"],
  ["by órgão/função/programa/ação", "por órgão/função/programa/ação"],
  ["dataframes", "dataframes"],
  ["employment bond", "vínculo empregatício"],
  ["embargoed area", "área embargada"],
  ["infraction", "infração"],
  ["Modern REST endpoints over selected health datasets", "Endpoints REST modernos sobre bases selecionadas de saúde"],
  ["Modern REST endpoints over selected health bases de dados", "Endpoints REST modernos sobre bases selecionadas de saúde"],
  ["professionals", "profissionais"],
  ["some epidemiology", "algumas bases epidemiológicas"],
  ["Territorial execution of the Aldir Blanc cultural policy", "Execução territorial da política cultural Aldir Blanc"],
  ["transfers & monitoring", "repasses e monitoramento"],
  ["repasses & monitoring", "repasses e monitoramento"],
  ["state / municipality / execution", "estado / município / execução"],
  ["hundreds of datasets", "centenas de bases de dados"],
  ["hundreds of bases de dados", "centenas de bases de dados"],
  ["health, mobility, education, traffic, management", "saúde, mobilidade, educação, trânsito, gestão"],
  ["search/list", "buscar/listar"],
  ["tags across all", "tags em todos os"],
  ["Best single entry point to discover any federal dataset", "Melhor ponto de entrada único para descobrir qualquer base federal"],
  ["public datasets", "bases de dados públicas"],
  ["federal dataset", "base federal"],
  ["datasets", "bases de dados"],
  ["dataset", "base de dados"],
  ["organizations", "órgãos"],
  ["federal bodies", "órgãos federais"],
  ["single entry point", "ponto de entrada único"],
  ["Massively cuts ETL time", "Reduz fortemente o tempo de ETL"],
  ["Accounting & fiscal reports", "Relatórios contábeis e fiscais"],
  ["for all", "para todos os"],
  ["by entity/period", "por entidade/período"],
  ["Budget execution dashboards", "Painéis de execução orçamentária"],
  ["public debt", "dívida pública"],
  ["bond prices/yields", "preços/rendimentos dos títulos"],
  ["federal cost system", "sistema federal de custos"],
  ["fiscal statistics", "estatísticas fiscais"],
  ["PRIORITY lead-mapping city", "cidade PRIORITÁRIA para mapeamento de leads"],
  ["Historic reference prices in public purchases", "Preços históricos de referência em compras públicas"],
  ["official source reported update interruption", "a fonte oficial informou interrupção da atualização"],
  ["use with caution", "use com cautela"],
  ["All IBGE survey tables", "Todas as tabelas de pesquisas do IBGE"],
  ["Census", "Censo"],
  ["population", "população"],
  ["industry/retail/services", "indústria/varejo/serviços"],
  ["Multidimensional filtering", "filtragem multidimensional"],
  ["Administrative divisions & codes", "Divisões administrativas e códigos"],
  ["territorial mesh maps", "malhas territoriais"],
  ["multiple resolutions", "múltiplas resoluções"],
  ["CNAE classification", "classificação CNAE"],
  ["place names", "nomes geográficos"],
  ["census first-names", "nomes próprios do censo"],
  ["Per-municipality dashboards", "Painéis por município"],
  ["in one profile", "em um único perfil"],
  ["ES analytical center", "Centro analítico do ES"],
  ["Some data in Dados ES portal", "Alguns dados ficam no portal Dados ES"],
  ["sectoral value added", "valor adicionado setorial"],
  ["trade indicators", "indicadores comerciais"],
  ["input-output matrices", "matrizes insumo-produto"],
  ["publication indexes", "índices de publicações"],
  ["Physical, economic, social, financial & administrative indicators", "Indicadores físicos, econômicos, sociais, financeiros e administrativos"],
  ["for all 399 PR municipalities", "para todos os 399 municípios do PR"],
  ["credit stock/rates", "estoque/taxas de crédito"],
  ["monetary aggregates", "agregados monetários"],
  ["balance of payments", "balanço de pagamentos"],
  ["numeric series code", "código numérico da série"],
  ["Listed-company filings", "documentos de companhias abertas"],
  ["investment funds daily quotas & portfolios", "cotas diárias e carteiras de fundos de investimento"],
  ["regulated entities", "entidades reguladas"],
  ["Company openings", "aberturas de empresas"],
  ["company openings", "aberturas de empresas"],
  ["closures", "fechamentos"],
  ["time-to-open", "tempo de abertura"],
  ["business environment dynamics", "dinâmica do ambiente de negócios"],
  ["Company registrations", "registros empresariais"],
  ["branches", "filiais"],
  ["nature/sector/location", "natureza/setor/localização"],
  ["new SP businesses", "novas empresas de SP"],
  ["Business registry & digital services", "Registro empresarial e serviços digitais"],
  ["Company opening/alteration/registration of acts", "abertura/alteração/registro de atos empresariais"],
  ["Crop forecasts", "Previsões de safra"],
  ["supply/stocks", "oferta/estoques"],
  ["minimum prices", "preços mínimos"],
  ["production costs", "custos de produção"],
  ["market price series", "séries de preços de mercado"],
  ["Benchmark daily price indicators", "Indicadores diários de preços de referência"],
  ["widely used in contracts", "amplamente usados em contratos"],
  ["Apps, panels, maps & geographic data", "Aplicativos, painéis, mapas e dados geográficos"],
  ["for managing the ES capital", "para gestão da capital do ES"],
  ["Health-plan operators registry & financials", "Cadastro e dados financeiros de operadoras de planos de saúde"],
  ["beneficiary counts", "contagens de beneficiários"],
  ["complaints", "reclamações"],
  ["Higher-Ed Census", "Censo da Educação Superior"],
  ["dictionaries & questionnaires", "dicionários e questionários"],
  ["Enrollments", "matrículas"],
  ["basic-ed infrastructure indicators", "indicadores de infraestrutura da educação básica"],
  ["Grad-program evaluation", "avaliação de programas de pós-graduação"],
  ["theses/dissertations catalog", "catálogo de teses/dissertações"],
  ["scholarships", "bolsas"],
  ["production", "produção"],
  ["judicial cases", "processos judiciais"],
  ["nationwide", "em todo o país"],
  ["class", "classe"],
  ["subject", "assunto"],
  ["excludes sealed cases & party personal data", "exclui processos sigilosos e dados pessoais das partes"],
  ["judiciary performance", "desempenho do Judiciário"],
  ["caseload", "volume de processos"],
  ["clearance", "baixa processual"],
  ["costs", "custos"],
  ["productivity", "produtividade"],
  ["Deputies", "deputados"],
  ["bills", "projetos de lei"],
  ["committees", "comissões"],
  ["speeches", "discursos"],
  ["parliamentary expense quota", "cota parlamentar"],
  ["spending", "gastos"],
  ["coverage", "cobertura"],
  ["beneficiaries & values", "beneficiários e valores"],
  ["SUAS network", "rede SUAS"],
  ["poverty indicators", "indicadores de pobreza"],
  ["information management", "gestão da informação"],
  ["Generation plants", "usinas de geração"],
  ["distributed generation", "geração distribuída"],
  ["tariffs", "tarifas"],
  ["distributors", "distribuidoras"],
  ["consumption", "consumo"],
  ["ombudsman", "ouvidoria"],
  ["Weekly fuel-price survey", "Pesquisa semanal de preços de combustíveis"],
  ["oil & gas production", "produção de petróleo e gás"],
  ["reserves", "reservas"],
  ["derivatives sales", "vendas de derivados"],
  ["incidents", "incidentes"],
  ["Air traffic", "Tráfego aéreo"],
  ["actual flight paths", "trajetos reais de voos"],
  ["on-time performance", "pontualidade"],
  ["dynamic ticket pricing", "precificação dinâmica de passagens"],
  ["registered aircraft", "aeronaves registradas"],
  ["market share", "participação de mercado"],
  ["Road freight", "Transporte rodoviário de cargas"],
  ["passenger", "passageiros"],
  ["toll & traffic", "pedágio e tráfego"],
  ["intercity bus telemetry & ticket sales", "telemetria e venda de passagens de ônibus intermunicipais"],
  ["rail cargo", "carga ferroviária"],
  ["concessions", "concessões"],
  ["enforcement", "fiscalização"],
  ["Federal road network & condition", "Malha rodoviária federal e condição"],
  ["maintenance index", "índice de manutenção"],
  ["surface roughness", "irregularidade do pavimento"],
  ["paving projects", "projetos de pavimentação"],
  ["Patents, trademarks, industrial designs, software registrations", "Patentes, marcas, desenhos industriais e registros de software"],
  ["filing stats", "estatísticas de depósitos"],
  ["per-record search", "busca por registro"],
  ["researcher CVs", "currículos de pesquisadores"],
  ["research groups directory", "diretório de grupos de pesquisa"],
  ["National registry of public bids", "Cadastro nacional de licitações públicas"],
  ["across all government levels", "em todos os níveis de governo"],
  ["Complete registry of all Brazilian companies", "Cadastro completo de todas as empresas brasileiras"],
  ["name, CNAE, address, status, partners", "nome, CNAE, endereço, situação, sócios"],
  ["establishments", "estabelecimentos"],
  ["records", "registros"],
  ["Official exports/imports", "Exportações/importações oficiais"],
  ["FOB value", "valor FOB"],
  ["net kg", "kg líquido"],
  ["quantity", "quantidade"],
  ["partner", "parceiro"],
  ["declaring firm", "empresa declarante"],
  ["customs unit", "unidade aduaneira"],
  ["Official deforestation polygons & rates", "Polígonos e taxas oficiais de desmatamento"],
  ["near-real-time alerts", "alertas quase em tempo real"],
  ["Legal Amazon", "Amazônia Legal"],
  ["Geology, hydrogeology, geophysics, geotechnics", "Geologia, hidrogeologia, geofísica, geotecnia"],
  ["risk/disaster maps", "mapas de risco/desastre"],
  ["official geospatial environment", "ambiente geoespacial oficial"],
  ["Federated catalog of official geospatial layers", "Catálogo federado de camadas geoespaciais oficiais"],
  ["dozens of producers", "dezenas de produtores"],
  ["discovery + OGC services", "descoberta + serviços OGC"],
  ["Official Bahia spatial-data infrastructure catalog", "Catálogo oficial da infraestrutura de dados espaciais da Bahia"],
  ["metadata search", "busca de metadados"],
  ["state geospatial layers", "camadas geoespaciais estaduais"],
  ["Consolidated crime/violence statistics", "Estatísticas consolidadas de crime/violência"],
  ["often filling official gaps", "frequentemente cobrindo lacunas oficiais"],
  ["Federal voluntary transfers", "Transferências voluntárias federais"],
  ["contratos de repasse to states/municipalities/NGOs", "contratos de repasse para estados, municípios e ONGs"],
  ["values, status, executors", "valores, situação e executores"],
  ["catalog of catalogs", "catálogo de catálogos"],
  ["every CNPJ", "cada CNPJ"],
  ["Beyond CNPJ", "Além do CNPJ"],
  ["Simples Nacional/MEI lists", "listas do Simples Nacional/MEI"],
  ["immune/exempt entities", "entidades imunes/isentas"],
  ["customs data", "dados aduaneiros"],
  ["tax-collection stats", "estatísticas de arrecadação tributária"],
  ["rural properties", "imóveis rurais"],
  ["Georeferencing certification of rural properties", "Certificação de georreferenciamento de imóveis rurais"],
  ["parcel coordinates/vertices", "coordenadas/vértices das parcelas"],
  ["certification status", "situação da certificação"],
  ["Query rural property status", "Consulta da situação do imóvel rural"],
  ["by code or owner CPF/CNPJ", "por código ou CPF/CNPJ do proprietário"],
  ["titularity", "titularidade"],
  ["fiscal modules", "módulos fiscais"],
  ["classification", "classificação"],
  ["cleaned", "tratadas"],
  ["cross-joinable", "cruzáveis"],
  ["municipality keys", "chaves municipais"],
  ["time series", "séries temporais"],
  ["state GDP", "PIB estadual"],
  ["municipal GDP", "PIB municipal"],
  ["social series", "séries sociais"],
  ["regional", "regional"],
  ["macro", "macro"],
  ["federal expenses", "despesas federais"],
  ["revenue", "receitas"],
  ["transfers", "transferências"],
  ["servant salaries", "remuneração de servidores"],
  ["sanctioned firms", "empresas sancionadas"],
  ["social benefits", "benefícios sociais"],
  ["corporate cards", "cartões corporativos"],
  ["state & municipal", "estadual e municipal"],
  ["state and municipal", "estadual e municipal"],
  ["accounting and fiscal reports", "relatórios contábeis e fiscais"],
  ["public bids", "licitações públicas"],
  ["contracts", "contratos"],
  ["price records", "atas de preços"],
  ["procurement plans", "planos de contratação"],
  ["company registry", "cadastro de empresas"],
  ["business dynamics", "dinâmica empresarial"],
  ["company services", "serviços empresariais"],
  ["foreign trade", "comércio exterior"],
  ["exports/imports", "exportações/importações"],
  ["stock", "ações"],
  ["derivatives", "derivativos"],
  ["capital markets", "mercado de capitais"],
  ["health facilities", "estabelecimentos de saúde"],
  ["health statistics", "estatísticas de saúde"],
  ["education datasets", "bases educacionais"],
  ["school census", "censo escolar"],
  ["higher education", "ensino superior"],
  ["research", "pesquisa"],
  ["elections", "eleições"],
  ["candidates", "candidatos"],
  ["results", "resultados"],
  ["campaign finance", "financiamento de campanha"],
  ["judicial case metadata", "metadados de processos judiciais"],
  ["legislation and norms", "legislação e normas"],
  ["rural property", "imóvel rural"],
  ["land cover", "cobertura do solo"],
  ["land use", "uso do solo"],
  ["deforestation", "desmatamento"],
  ["fire", "fogo"],
  ["water", "água"],
  ["weather", "tempo"],
  ["climate", "clima"],
  ["transport", "transporte"],
  ["telecom", "telecomunicações"],
  ["connectivity", "conectividade"],
  ["download", "download"],
  ["reports", "relatórios"],
  ["report", "relatório"],
  ["panels", "painéis"],
  ["panel", "painel"],
  ["tables", "tabelas"],
  ["indicators", "indicadores"],
  ["historic", "histórico"],
  ["city", "cidade"],
  ["country", "país"],
  ["company", "empresa"],
  ["business", "empresa"],
  ["source", "fonte"],
  ["course", "curso"],
  ["institution", "instituição"],
  ["scholarship", "bolsa"],
  ["thesis", "tese"],
  ["senator", "senador"],
  ["matter", "matéria"],
  ["deputy", "deputado"],
  ["proposition", "proposição"],
  ["expense", "despesa"],
  ["police", "polícia"],
  ["precinct", "delegacia"],
  ["family", "família"],
  ["territory", "território"],
  ["payments", "pagamentos"],
  ["record", "registro"],
  ["partners", "sócios"],
  ["asset", "ativo"],
  ["tariff", "tarifa"],
  ["tourist", "turístico"],
  ["flows", "fluxos"],
  ["applicant", "depositante"],
  ["filing", "depósito"],
  ["segment", "segmento"],
  ["block", "quadra"],
  ["lot", "lote"],
  ["geographic", "geográfico"],
  ["geological", "geológico"],
  ["hydrological", "hidrológico"],
  ["well", "poço"],
  ["field", "campo"],
  ["plan", "plano"],
  ["system", "sistema"],
  ["dictionaries", "dicionários"],
  ["road", "rodovia"],
  ["carrier", "transportadora"],
  ["flight", "voo"],
  ["crop", "safra"],
  ["commodity", "commodity"],
  ["maps", "mapas"],
  ["layers", "camadas"],
  ["layer", "camada"],
  ["current", "atual"],
  ["continuous", "contínuo"],
  ["varies", "varia"],
  ["national", "nacional"],
  ["state", "estado"],
  ["municipality", "município"],
  ["municipal", "municipal"],
  ["district", "distrito"],
  ["transaction", "transação"],
  ["supplier", "fornecedor"],
  ["servant", "servidor"],
  ["employee", "servidor"],
  ["department", "órgão"],
  ["program", "programa"],
  ["entity", "entidade"],
  ["item", "item"],
  ["tender", "licitação"],
  ["contract", "contrato"],
  ["candidate", "candidato"],
  ["vote", "voto"],
  ["donor", "doador"],
  ["case", "processo"],
  ["decision", "decisão"],
  ["movement", "movimento"],
  ["court", "tribunal"],
  ["law", "lei"],
  ["norm", "norma"],
  ["document", "documento"],
  ["school", "escola"],
  ["teacher", "professor"],
  ["student", "estudante"],
  ["pupil", "aluno"],
  ["hospital", "hospital"],
  ["patient", "paciente"],
  ["individual", "individual"],
  ["establishment", "estabelecimento"],
  ["professional", "profissional"],
  ["equipment", "equipamento"],
  ["product", "produto"],
  ["registration", "registro"],
  ["event", "evento"],
  ["operator", "operadora"],
  ["beneficiary", "beneficiário"],
  ["aggregate", "agregado"],
  ["property", "imóvel"],
  ["parcel", "parcela"],
  ["polygon", "polígono"],
  ["biome", "bioma"],
  ["station", "estação"],
  ["basin", "bacia"],
  ["port", "porto"],
  ["installation", "instalação"],
  ["cargo", "carga"],
  ["vessel", "embarcação"],
  ["route", "rota"],
  ["vehicle", "veículo"],
  ["trip", "viagem"],
  ["airport", "aeroporto"],
  ["aircraft", "aeronave"],
  ["line", "linha"],
  ["series", "série"],
  ["query", "consulta"],
  ["search", "busca"],
  ["catalog", "catálogo"],
  ["registry", "cadastro"],
  ["register", "registro"],
  ["metadata", "metadados"],
  ["microdata", "microdados"],
  ["open", "aberto"],
  ["paid", "pago"],
  ["restricted", "restrito"],
  ["login", "login"],
  ["free", "gratuito"],
  ["token", "token"],
  ["key", "chave"],
  ["none", "nenhum"],
  ["public", "público"],
  ["private", "privado"],
  ["underlying APIs", "APIs subjacentes"],
  ["dynamic tables", "tabelas dinâmicas"],
  ["digital services", "serviços digitais"],
  ["maps", "mapas"],
  ["publications", "publicações"],
  ["services", "serviços"],
  ["service", "serviço"],
  ["files", "arquivos"],
  ["file", "arquivo"],
  ["bulk", "lote"],
  ["web", "web"],
];

function replaceCaseInsensitive(text, from, to) {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = /^[A-Za-z]+$/.test(from) ? `\\b${escaped}\\b` : escaped;
  return text.replace(new RegExp(pattern, "gi"), to);
}

function translateFreeTextPt(value) {
  if (!value || value === "-") return value;
  let translated = value;
  for (const [from, to] of TEXT_REPLACEMENTS_PT.sort((a, b) => b[0].length - a[0].length)) {
    translated = replaceCaseInsensitive(translated, from, to);
  }
  return translated
    .replace(/\bAPI\b/g, "API")
    .replace(/\bCSV\b/g, "CSV")
    .replace(/\bJSON\b/g, "JSON")
    .replace(/\bHTML\b/g, "HTML")
    .replace(/\bXLSX\b/g, "XLSX")
    .replace(/\bPDF\b/g, "PDF")
    .replace(/\s+\/\s+/g, " / ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

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
      docs: "Documentação",
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

function categoryLabel(category, language, t) {
  if (category === "All") return t.filters.all;
  return language === "pt" ? CATEGORY_LABELS_PT[category] ?? translateFreeTextPt(category) : category;
}

function sourceDisplay(source, language) {
  if (language !== "pt") {
    return {
      level: source.level,
      domain: source.domain,
      description: source.description,
      accessMethod: source.accessMethod,
      formats: source.formats.join(", "),
      granularity: source.granularity,
    };
  }

  return {
    level: LEVEL_LABELS_PT[source.level] ?? translateFreeTextPt(source.level),
    domain: DOMAIN_LABELS_PT[source.domain] ?? translateFreeTextPt(source.domain),
    description: translateFreeTextPt(source.description),
    accessMethod: translateFreeTextPt(source.accessMethod),
    formats: translateFreeTextPt(source.formats.join(", ")),
    granularity: translateFreeTextPt(source.granularity),
  };
}

function SourceCard({ source, t, language }) {
  const display = sourceDisplay(source, language);
  const openSource = () => {
    window.open(source.url, "_blank", "noopener,noreferrer");
  };

  const openSourceFromKeyboard = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSource();
    }
  };

  const stopCardClick = (event) => {
    event.stopPropagation();
  };

  return (
    <article
      className="source-card"
      onClick={openSource}
      onKeyDown={openSourceFromKeyboard}
      role="link"
      tabIndex={0}
      aria-label={`${source.name} - ${t.card.source}`}
    >
      <div className="source-card__top">
        <div>
          <div className="source-card__meta">
            <span>{display.level}</span>
            {source.location && source.location !== "-" ? <span>{source.location}</span> : null}
            <span>{display.domain}</span>
          </div>
          <h2>{source.name}</h2>
        </div>
        <span className={`access access--${source.accessType.toLowerCase().replaceAll(" ", "-")}`}>
          {t.accessTypes[source.accessType] ?? source.accessType}
        </span>
      </div>

      <p>{display.description}</p>

      <div className="endpoint">{compactUrl(source.url)}</div>

      <dl className="source-facts">
        <div>
          <dt>{t.card.access}</dt>
          <dd>{display.accessMethod || t.card.notSpecified}</dd>
        </div>
        <div>
          <dt>{t.card.formats}</dt>
          <dd>{display.formats || t.card.notSpecified}</dd>
        </div>
        <div>
          <dt>{t.card.granularity}</dt>
          <dd>{display.granularity || t.card.varies}</dd>
        </div>
      </dl>

      <div className="source-card__footer">
        <span>{t.card.verified} {source.lastVerified}</span>
        <div className="source-card__links">
          {source.docs ? (
            <a href={source.docs} target="_blank" rel="noreferrer" onClick={stopCardClick}>
              {t.card.docs} <ArrowUpRight size={14} />
            </a>
          ) : null}
          <a href={source.url} target="_blank" rel="noreferrer" onClick={stopCardClick}>
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
                <span className="legend-pill legend-pill--open">
                  <strong>{t.accessTypes.Open}</strong>
                  {language === "pt" ? "Acesso público" : "Public access"}
                </span>
                <span className="legend-pill legend-pill--open-api">
                  <strong>{t.accessTypes["Open API"]}</strong>
                  API
                </span>
                <span className="legend-pill legend-pill--free-key">
                  <strong>{t.accessTypes["Free key"]}</strong>
                  {language === "pt" ? "Cadastro rápido" : "Quick signup"}
                </span>
                <span className="legend-pill legend-pill--restricted">
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
                  <span>{categoryLabel(item.name, language, t)}</span>
                  <strong>{item.count}</strong>
                </button>
              ))}
            </div>
          </aside>

          <div className="results">
            <div className="results__header">
              <div>
                <span className="category-heading-dot" />
                <strong>{categoryLabel(category, language, t)}</strong>
              </div>
              <p>{filtered.length} {t.results.sources}</p>
            </div>

            <div className="source-grid">
              {filtered.map((source) => (
                <SourceCard key={source.id} source={source} t={t} language={language} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
