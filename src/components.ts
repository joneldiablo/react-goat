import React from "react";

import Component from "./component";
import GoatComponent from "./goat-component";
import containers from "./containers";
import fields from "./fields";
import mediaComponents from "./media";
import navigationComponents from "./navigation";
import Route from "./react-router-schema/route";

const COMPONENTS: Record<string, React.FC<any> | typeof React.Component<any, any>> = {
  Component,
  GoatComponent,
  ...containers,
  ...fields,
  ...mediaComponents,
  ...navigationComponents,
  Route
};

export const addComponents = (components: Record<string, React.FC<any> | typeof React.Component | {} | false>) => {
  if (!components) return;
  Object.assign(COMPONENTS, components);
}

export default COMPONENTS;