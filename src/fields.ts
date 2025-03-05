import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";

const FIELDS: Record<string, typeof Component | React.FC<ComponentProps>> = {

};

export const addFields = (fields: Record<string, typeof Component> | React.FC<ComponentProps>) => {
  Object.assign(FIELDS, fields);
  addComponents(fields as Record<string, typeof Component<any, any>>);
}

export default FIELDS;