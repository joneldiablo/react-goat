import React from "react";
import { NavLink as ReactRouterNavLink, NavLinkProps as RouterNavLinkProps } from "react-router-dom";
import Component, { ComponentProps } from "../component";

export interface NavLinkProps extends ComponentProps, RouterNavLinkProps {
  ariaCurrent?: string;
  _component?: React.ReactNode;
}

export default class NavLink extends Component<NavLinkProps> {
  static jsClass = "NavLink";

  protected tag: any = ReactRouterNavLink;

  protected get componentProps(): Record<string, any> {
    const { ariaCurrent, to, replace, ref, end, _component } = this.props;

    return {
      "aria-current": ariaCurrent,
      to,
      replace,
      ref,
      end,
      component: _component,
    };
  }
}
