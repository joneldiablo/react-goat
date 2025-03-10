import React from "react";


import containers from "./containers";
import Component from "./component";
import Icons from "./media/icons";

const COMPONENTS: Record<string, React.FC<any> | typeof React.Component<any, any>> = {
  Component,
  Icons,
  ...containers
};

export const addComponents = (components: Record<string, React.FC<any> | typeof React.Component | {} | false>) => {
  if (!components) return;
  Object.assign(COMPONENTS, components);
}

export default COMPONENTS;