import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";

export type Fields = Record<string, typeof Component | React.FC<ComponentProps> | any>;

const FIELDS: Fields = {

};

export const addFields = (fields: Fields) => {
  Object.assign(FIELDS, fields);
  addComponents(fields as Record<string, typeof Component<any, any>>);
}

export default FIELDS;