import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";

export type Tables = Record<string, typeof Component | React.FC<ComponentProps> | any>;

const TABLES: Tables = {
};

export const addContainers = (tables: Tables) => {
  Object.assign(TABLES, tables);
  addComponents(tables as Record<string, typeof Component<any, any>>);
}

export default TABLES;