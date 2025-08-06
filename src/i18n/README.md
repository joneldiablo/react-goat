# Internationalization utilities

This module exposes helpers built on top of `dbl-utils/i18n` and a `SelectLanguage` component to switch the active locale.

```tsx
import { SelectLanguage, t, n, cur, setDictionary } from "@farm-js/react-goat";

setDictionary({
  es_MX: { hello: "Hola" },
  en_US: { hello: "Hello" }
});

<SelectLanguage />;
```
