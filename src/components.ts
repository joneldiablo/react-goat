import React from "react";

import Component from "./component";
import GoatComponent from "./goat-component";
import containers from "./containers";
import fields from "./fields";
import mediaComponents from "./media";
import navigationComponents from "./navigation";
import chartjsComponents from "./chartjs";
import Route from "./react-router-schema/route";

/**
 * Registry of available React components used by `Goat`.
 */
const COMPONENTS: Record<string, React.FC<any> | typeof React.Component<any, any>> = {
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
export const addComponents = (components: Record<string, React.FC<any> | typeof React.Component | {} | false>): void => {
  if (!components) return;
  Object.assign(COMPONENTS, components);
};

export default COMPONENTS;