# TODO

**Origin:** `js/media/svg.js` in `dbl-components`.
**Destination:** `js/media/svg.js` in `react-goat`.
**Existing TS:** Yes, already exists in `react-goat` at `media/svg.tsx`.
Review the existing TypeScript file and the original JS file. Merge any updates from the JS version into the TS version, ensuring that both implementations stay synchronized.
This file does not depend on Bootstrap, so it belongs in `react-goat`.
Add comprehensive TypeScript typings and typedoc. Keep all names and comments in English.
Write unit tests for the component, mocking all external dependencies (including any imports from `dbl-utils` or related files). Ensure that behavior matches the original JS implementation.
Document any props, state variables and events.