import React from "react";
import { Route as RouteRR, RouteProps as RoutePropsRR } from "react-router-dom";

import Component, { ComponentProps } from "../component";

/**
 * Props for {@link Route} extending the underlying React Router options.
 */
export interface RouteProps
  extends ComponentProps,
    Omit<RoutePropsRR, "children"> {
  /** Controller name to render for this route. */
  component: string;
  /** Nested routes definitions. */
  routes: Record<string, RouteProps> | RouteProps[];
  /** Enable test mode for the route. */
  test?: boolean;
}

/**
 * Wrapper over React Router's {@link Route} that only renders when the route is
 * marked as active.
 *
 * @example
 * ```tsx
 * <Route active path="/" name="home">
 *   <Home />
 * </Route>
 * ```
 */
export default class Route extends Component<RouteProps> {
  static jsClass = "Route";
  static wrapper = false;

  render() {
    const {
      active,
      name,
      path,
      index,
      action,
      caseSensitive,
      Component,
      ErrorBoundary,
      errorElement,
      handle,
      hasErrorBoundary,
      HydrateFallback,
      hydrateFallbackElement,
      id,
      lazy,
      loader,
      shouldRevalidate,
      children,
    } = this.props as RouteProps;

    const props: any = {
      path,
      index,
      action,
      caseSensitive,
      Component,
      ErrorBoundary,
      errorElement,
      handle,
      hasErrorBoundary,
      HydrateFallback,
      hydrateFallbackElement,
      id,
      lazy,
      loader,
      shouldRevalidate,
      element: children,
    };

    return active ? (
      <RouteRR key={name} {...props} />
    ) : (
      <React.Fragment>{false}</React.Fragment>
    );
  }
}
