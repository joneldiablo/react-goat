import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";
import Container from "./containers/container";
import DetailsContainer from "./containers/details-container";
import FloatingContainer from "./containers/floating-container";
import FormContainer from "./containers/form-container";
import GoatContainer from "./containers/goat-container";
import GridContainer from "./containers/grid-container";
//import HeroContainer from "./containers/hero-container";
import ListContainer from "./containers/list-container";
import ProportionalContainer from "./containers/proportional-container";
import ScrollContainer from "./containers/scroll-container";
//import SlideContainer from "./containers/slide-container";

const CONTAINERS: Record<string, typeof Container<any, any> | React.FC<ComponentProps> | typeof Component<any, any>> = {
  Container,
  FloatingContainer,
  GoatContainer,
  DetailsContainer,
  FormContainer,
  GridContainer,
  //HeroContainer,
  ListContainer,
  ProportionalContainer,
  ScrollContainer,
  //SlideContainer
};

export const addContainers = (containers: Record<string, typeof Container> | React.FC<ComponentProps>) => {
  Object.assign(CONTAINERS, containers);
  addComponents(containers as Record<string, typeof Component<any, any>>);
}

export default CONTAINERS;