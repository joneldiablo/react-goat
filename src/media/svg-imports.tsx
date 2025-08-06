import React from "react";
import Icons from "./icons";

const SvgsImported: Record<string, React.FC<any>> = {};

/**
 * Adds SVG components to the imported collection.
 *
 * @param svgs - An object containing SVG components keyed by name.
 * @example
 * ```tsx
 * import { addSvgs } from "./media/svg-imports";
 * import Logo from "./logo.svg";
 * addSvgs({ Logo });
 * ```
 */
export function addSvgs(svgs: Record<string, React.FC<any>>): void {
  Object.assign(SvgsImported, svgs);
}

/**
 * Props for {@link SvgImports}.
 */
export interface SvgImportsProps {
  /** Element identifier. */
  id?: string;
  /** Base class name for the SVG. */
  name?: string;
  /** Additional classes applied to the SVG. */
  classes?: string | string[];
  /** Wrapper class name. */
  className?: string;
  /** Alias for `className`. */
  class?: string;
  /** Key of the SVG component to render. */
  svg?: string;
  /** Inline styles. */
  style?: React.CSSProperties;
  /** Accessible title. */
  title?: string;
}

/**
 * Renders a previously registered SVG or falls back to the `Icons` component.
 *
 * @example
 * ```tsx
 * <SvgImports name="logo" svg="Logo" />
 * ```
 */
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
      id={id}
      icon="src-error"
      inline={false}
      className={cn.flat().filter(Boolean).join(" ")}
      style={style}
      title={title}
    />
  );
};

export default SvgImports;
