import t, { addDictionary, formatCurrency, formatNumber } from "dbl-utils/i18n";
import SelectLanguage from "./select-language";

/**
 * Internationalization helpers powered by `dbl-utils/i18n`.
 *
 * @example
 * ```ts
 * import { t, n, cur, setDictionary } from "@farm-js/react-goat";
 * setDictionary({ es_MX: { hello: "Hola" } });
 * t("hello");
 * n(1234);
 * cur(10, "USD");
 * ```
 */
export const setDictionary = addDictionary;
/** Returns the given value as plain text. */
export const p = (value: any): string => (Array.isArray(value) ? value.join(" ") : String(value));
/** Formats numbers according to the active locale. */
export const n = (value: number): string => formatNumber(value);
/** Formats currency values using the provided ISO code. */
export const cur = (value: number, code: string): string => formatCurrency(value, code);
/** Resolves a localized resource URL. */
export const src = (value: string): string => value;

export { t, SelectLanguage };
