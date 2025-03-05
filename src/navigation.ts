import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";
import Container from "./containers/container";
import FloatingContainer from "./containers/floating-container";
import GoatContainer from "./containers/goat-container";

const CONTAINERS: Record<string, typeof Container | React.FC<ComponentProps>> = {
  Container,
  FloatingContainer,
  GoatContainer
};

export const addContainers = (containers: Record<string, typeof Container> | React.FC<ComponentProps>) => {
  Object.assign(CONTAINERS, containers);
  addComponents(containers as Record<string, typeof Component<any, any>>);
}

export default CONTAINERS;