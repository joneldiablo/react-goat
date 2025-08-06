import React from "react";
import { Link as ReactRouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import Component, { ComponentProps } from "../component";

/**
 * Props for {@link Link} combining base component props with React Router link
 * options.
 */
export interface LinkProps extends ComponentProps, RouterLinkProps {
  /** Value for the `aria-current` attribute. */
  ariaCurrent?: string;
  /** Custom component injected into the underlying link. */
  _component?: React.ReactNode;
}
/**
 * Wrapper over React Router's {@link ReactRouterLink}.
 *
 * @example
 * ```tsx
 * <Link to="/about">About</Link>
 * ```
 */
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
