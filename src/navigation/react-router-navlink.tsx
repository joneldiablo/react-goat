import React from "react";
import {
  NavLink as ReactRouterNavLink,
  NavLinkProps as RouterNavLinkProps,
} from "react-router-dom";
import Component, { ComponentProps } from "../component";

/**
 * Props for {@link NavLink} combining base component props with React Router
 * navigation options.
 */
export interface NavLinkProps extends ComponentProps, RouterNavLinkProps {
  /** Value for the `aria-current` attribute. */
  ariaCurrent?: string;
  /** Custom component injected into the underlying link. */
  _component?: React.ReactNode;
}

/**
 * Wrapper over React Router's {@link ReactRouterNavLink}.
 *
 * @example
 * ```tsx
 * <NavLink to="/home" end>Home</NavLink>
 * ```
 */
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
