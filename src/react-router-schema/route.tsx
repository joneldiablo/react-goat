import React from "react";
import { Route as RouteRR, RouteProps as RoutePropsRR } from "react-router-dom";

import Component, { ComponentProps } from "../component";

export interface RouteProps extends ComponentProps, Omit<RoutePropsRR, 'children'> {
  component: string;
  routes: Record<string, RouteProps> | RouteProps[];
  test?: boolean;
}

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

    return active ? <RouteRR key={name} {...props} /> : <React.Fragment>{false}</React.Fragment>;
  }
}
