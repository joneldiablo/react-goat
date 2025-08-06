# react goat

## Changes

- Documented and tested the media component registry, allowing custom media components to be registered through `addMediaComponents`.
- Added typedoc and unit tests for base components, Goat container, Title controller and custom hooks.
- Converted Chart.js components to TypeScript with documentation and tests.
- Documented Goat utility and application controller with accompanying tests.
- Added internationalization helpers and a `SelectLanguage` component with default flag options.
- Synced media components (Icons, Image, SvgImports, Svg, Video and YoutubeVideoComponent) with documentation and tests.
- Documented React Router helpers (Link, NavLink, Route, SchemaController and withRouteWrapper) and added unit tests.
- Documented controller registry and base Controller, syncing rerender logic on navigation and adding registry extension tests.
- Synced core containers (Container, AutoResponsiveContainer, DetailsContainer, FetchContainer, FlexContainer and GridContainer) with documentation and tests.

## TODO

- [ ] Sort breakpoints in `ComplexResponsiveComponent` and sync with Sass `$container-max-widths`.
- [ ] Implement data encryption in `AppGoatController.stringify`.
- [ ] Implement data decryption in `AppGoatController.parse`.
- [ ] Render flag icons inside `SelectLanguage` options.
- [ ] Split `FetchContainer` into a template renderer and a service-backed variant.


