import React, { useEffect, useRef, useState } from "react";
import mxFlag from "./flags/mx.svg";
import usFlag from "./flags/us.svg";

export interface SelectLanguageOption {
  /** Language code such as `es_MX` or `en_US`. */
  value: string;
  /** Human readable label displayed in the dropdown. */
  label: string;
  /** Optional path to a flag icon. */
  flag?: string;
}

export interface SelectLanguageProps {
  /** Initial language value. Defaults to the first option. */
  value?: string;
  /** Available language options. */
  options?: SelectLanguageOption[];
  /** Callback invoked whenever the language changes. */
  onChange?: (lang: string) => void;
}

/**
 * Language selector that stores the choice in `localStorage` and dispatches
 * a `translate` event so other components can react to the change.
 *
 * @example
 * ```tsx
 * <SelectLanguage onChange={(lang) => console.log(lang)} />
 * ```
 */
export default function SelectLanguage({
  value,
  options = [
    { value: "es_MX", label: "Espa\u00f1ol", flag: mxFlag },
    { value: "en_US", label: "English", flag: usFlag },
  ],
  onChange,
}: SelectLanguageProps) {
  const [lang, setLang] = useState<string>(() => localStorage.getItem("lang") || value || options[0].value);
  const triggered = useRef(false);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    triggered.current = true;
    document.dispatchEvent(new CustomEvent("translate", { detail: lang }));
  }, [lang]);

  useEffect(() => {
    const handler = (e: Event) => {
      if (triggered.current) {
        triggered.current = false;
        return;
      }
      const detail = (e as CustomEvent<string>).detail;
      setLang(detail);
      onChange?.(detail);
    };
    document.addEventListener("translate", handler);
    return () => document.removeEventListener("translate", handler);
  }, [onChange]);

  return (
    <select
      value={lang}
      onChange={(e) => {
        setLang(e.target.value);
        onChange?.(e.target.value);
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
