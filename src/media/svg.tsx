import React from "react";

export interface SvgProps extends React.SVGProps<SVGSVGElement> {
  classes?: string | string[];
  href?: string;
  inline?: boolean;
}

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

    // Construcción de clases CSS
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
