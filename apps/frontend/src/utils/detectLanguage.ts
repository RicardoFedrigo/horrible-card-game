export type GameLanguage = "en" | "pt-br";

const PORTUGUESE_COUNTRIES = new Set([
  "BR",
  "PT",
  "AO",
  "MZ",
  "CV",
  "GW",
  "ST",
  "TL",
  "GQ",
]);

const isPortugueseLanguage = (language?: string): boolean => {
  const normalized = (language ?? "").trim().toLowerCase();
  return [
    "pt-br",
    "pt_br",
    "ptbr",
    "pt",
    "portuguese",
    "português",
  ].includes(normalized);
};

export const normalizeLanguage = (language?: string): GameLanguage =>
  isPortugueseLanguage(language) ? "pt-br" : "en";

export const getLocaleLanguage = (): GameLanguage => {
  const locale = (navigator.language ?? "").toLowerCase();
  return locale.startsWith("pt") ? "pt-br" : "en";
};

const detectCountry = async (): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const response = await fetch("https://ipwho.is/", {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!response.ok) return null;

    const data = (await response.json()) as { country_code?: string };
    return data.country_code?.toUpperCase() ?? null;
  } catch {
    return null;
  }
};

export const detectLanguage = async (): Promise<GameLanguage> => {
  const country = await detectCountry();
  if (country && PORTUGUESE_COUNTRIES.has(country)) {
    return "pt-br";
  }
  return getLocaleLanguage();
};
