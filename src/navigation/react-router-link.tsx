import React from "react";
import { Link as ReactRouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import Component, { ComponentProps } from "../component";

export interface LinkProps extends ComponentProps, RouterLinkProps {
  ariaCurrent?: string;
  _component?: React.ReactNode;
}

export default class Link extends Component<LinkProps> {
  static jsClass = "Link";

  protected tag: any = ReactRouterLink;

  protected get componentProps(): Record<string, any> {
    const { to, replace, ref, target, _component } = this.props;

    return {
      to,
      replace,
      ref,
      target,
      component: _component,
    };
  }
}
