import React from "react";

import Icons from "./icons";

const SvgsImported: Record<string, React.FC<any>> = {};

/**
 * Adds SVG components to the imported collection.
 * @param svgs - An object containing SVG components.
 */
export function addSvgs(svgs: Record<string, React.FC<any>>): void {
  Object.assign(SvgsImported, svgs);
}

export interface SvgImportsProps {
  id?: string;
  name?: string;
  classes?: string | string[];
  className?: string;
  class?: string;
  svg?: string;
  style?: React.CSSProperties;
  title?: string;
}

const SvgImports: React.FC<SvgImportsProps> = ({
  id,
  name,
  classes,
  className,
  class: _class,
  svg,
  style,
  title,
}) => {
  const Svg = svg ? SvgsImported[svg] : undefined;
  const cn = [
    Svg ? [name, `${name}-SvgImports`] : "",
    classes,
    className,
    _class,
  ];

  return Svg ? (
    <Svg
      id={id}
      className={cn.flat().filter(Boolean).join(" ")}
      style={style}
      title={title}
    />
  ) : (
    <Icons
      icon="src-error"
      inline={false}
      className={cn.flat().filter(Boolean).join(" ")}
      style={style}
      title={title}
    />
  );
};

export default SvgImports;
