import React from "react";

/**
 * Props for {@link Svg}.
 */
export interface SvgProps extends React.SVGProps<SVGSVGElement> {
  /** Additional class name(s) for the SVG element. */
  className?: string | string[];
  /** Additional class name(s) merged with `className`. */
  classes?: string | string[];
  /** Reference to the symbol to use. */
  href?: string;
  /** When `true`, applies the `icon-inline` class. */
  inline?: boolean;
}

/**
 * Minimal SVG wrapper using `<use>` for external symbols.
 *
 * @example
 * ```tsx
 * <Svg href="#icon" />
 * ```
 */
export default class Svg extends React.Component<SvgProps> {
  static jsClass = "Svg";

  static defaultProps: Partial<SvgProps> = {
    className: "",
    classes: "",
    href: "",
    inline: true,
    style: {},
  };

  render() {
    const { style, href, className, classes, inline, ...props } = this.props;

    // Build CSS classes
    const cn: string[] = [Svg.jsClass];
    if (className) cn.push(...(Array.isArray(className) ? className : [className]));
    if (classes) cn.push(...(Array.isArray(classes) ? classes : [classes]));
    if (inline) cn.push("icon-inline");

    return (
      <svg className={cn.filter(Boolean).join(" ")} style={style} {...props}>
        <use href={href} />
      </svg>
    );
  }
}
