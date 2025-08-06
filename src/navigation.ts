import Component, { ComponentProps } from "./component";
import { addComponents } from "./components";
import Link from "./navigation/react-router-link";
import NavLink from "./navigation/react-router-navlink";

export type NavigationComponents = Record<
  string,
  typeof Component | React.FC<ComponentProps> | any
>;

const NAVIGATION_COMPONENTS: NavigationComponents = {
  Link,
  NavLink,
};

export const addNavigationComponents = (
  navigationComponents: NavigationComponents
) => {
  if (!navigationComponents) return false;
  Object.assign(NAVIGATION_COMPONENTS, navigationComponents);
  addComponents(navigationComponents);
  return true;
};

export default NAVIGATION_COMPONENTS;
