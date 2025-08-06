/// <reference path="./node_modules/@splidejs/react-splide/dist/types/index.d.ts" />

/**
 * Global module declarations used across the project.
 *
 * @example
 * import flag from "./i18n/flags/mx.svg";
 */
declare module "@splidejs/react-splide";

declare module "*.svg" {
  const content: string;
  export default content;
}
