import { addComponents } from "./components";
import Container from "./containers/container";
import GoatContainer from "./containers/goat-container";

const CONTAINERS: Record<string, typeof Container> = {
  Container,
  GoatContainer
};

export const addContainers = (containers: Record<string, typeof Container>) => {
  Object.assign(CONTAINERS, containers);
  addComponents(containers as any);
}

export default CONTAINERS;