import React from "react";

import Component from "./component";
import GoatComponent from "./goat-component";
import containers from "./containers";
import fields from "./fields";
import mediaComponents from "./media";
import navigationComponents from "./navigation";
import chartjsComponents from "./chartjs";
import Route from "./react-router-schema/route";

export * from "./component";
export * from "./goat-component";
export * from "./containers";
export * from "./fields";
export * from "./media";
export * from "./navigation";
export * from "./chartjs";
export * from "./react-router-schema/route";

/**
 * Registry of available React components used by `Goat`.
 */
const COMPONENTS: Record<
  string,
  React.FC<any> | typeof React.Component<any, any>
> = {
  Component,
  GoatComponent,
  ...containers,
  ...fields,
  ...mediaComponents,
  ...navigationComponents,
  ...chartjsComponents,
  Route,
};

/**
 * Extends the components registry with custom components.
 *
 * @example
 * ```ts
 * addComponents({ Custom: MyComponent });
 * ```
 */
export const addComponents = (
  components: Record<
    string,
    React.FC<any> | typeof React.Component | {} | false
  >
): boolean => {
  if (!components) return false;
  Object.assign(COMPONENTS, components);
  return true;
};

export default COMPONENTS;
