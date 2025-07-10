import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";

import Container from "./containers/container";
import DetailsContainer from "./containers/details-container";
import FormContainer from "./containers/form-container";
import GoatContainer from "./containers/goat-container";
import GridContainer from "./containers/grid-container";
import ListContainer from "./containers/list-container";
import AutoResponsiveContainer from "./containers/auto-responsive-container";
import FullscreenContainer from "./containers/fullscreen-container";
import DndListContainer from "./containers/dnd-list-container";
import ProportionalContainer from "./containers/proportional-container";
import ScrollContainer from "./containers/scroll-container";

const CONTAINERS: Record<string, typeof Container<any, any> | React.FC<ComponentProps> | typeof Component<any, any>> = {
  Container,
  DetailsContainer,
  FormContainer,
  GoatContainer,
  GridContainer,
  ListContainer,
  AutoResponsiveContainer,
  FullscreenContainer,
  DndListContainer,
  ProportionalContainer,
  ScrollContainer
};

export const addContainers = (containers: Record<string, typeof Container> | React.FC<ComponentProps>) => {
  Object.assign(CONTAINERS, containers);
  addComponents(containers as Record<string, typeof Component<any, any>>);
}

export default CONTAINERS;