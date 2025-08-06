import React from "react";
import IcoMoon, { IcoMoonProps, iconList } from "react-icomoon";

import { splitAndFlat } from "dbl-utils/utils";

import defaultIcons from "../app-icons-v1.0/selection.json";

let is = JSON.parse(JSON.stringify(defaultIcons));

/**
 * Props for {@link Icons}.
 */
export interface IconsProps {
  /** Additional class name(s) for the wrapper. */
  className?: string | string[];
  /** Additional class name(s) for the icon element. */
  classes?: string | string[];
  /** Icon height. */
  height?: number | string;
  /** Icon name inside the IcoMoon set. */
  icon?: string | null;
  /** When `true`, the icon is rendered inline. */
  inline?: boolean;
  /** Icon size. */
  size?: number | string;
  /** Custom CSS styles. */
  style?: React.CSSProperties;
  /** Accessible title. */
  title?: string;
  /** Icon width. */
  width?: number | string;
}

/**
 * Renders icons from the configurable IcoMoon set.
 *
 * @example
 * ```tsx
 * import Icons from "./media/icons";
 *
 * export const Demo = () => <Icons icon="home" />;
 * ```
 */
export default class Icons extends React.Component<IconsProps> {
  /** Component identifier. */
  static jsClass = "Icons";
  static defaultProps: Partial<IconsProps> = {
    inline: true,
    className: "",
    icon: null,
    style: {},
  };

  render() {
    let { inline, icon, classes, className, style, width, height, title, size } =
      this.props;
    icon = searchIcon(icon) ? icon : "src-error";

    const cn: any[] = [Icons.jsClass, icon];
    if (className) cn.push(className);
    if (classes) cn.push(classes);
    if (inline) {
      cn.push("icon-inline");
    } else {
      style = { ...style, display: "block" };
    }

    const props: IcoMoonProps = {
      icon: icon!,
      iconSet: is,
      className: splitAndFlat(cn, " ").join(" "),
      style,
      width,
      height,
      title,
      size,
    };

    return <IcoMoon {...props} />;
  }
}

/**
 * Replaces the current icon set.
 *
 * @param isIn - New icon set data.
 */
export const setIconSet = (isIn: typeof is): void => {
  is = isIn;
};

/**
 * Adds icons to the existing set.
 *
 * @param newSet - Icon set containing icons to merge.
 */
export const addIcons = (newSet: { icons: any[] }): void => {
  is.icons.push(...newSet.icons);
};

/**
 * Searches for an icon name in the current set.
 *
 * @param icon - Icon name to search.
 * @returns The matching icon name, if found.
 */
export const searchIcon = (icon?: string | null): string | undefined => {
  if (!icon) return undefined;
  const list = iconList(is);
  return list.find((iconName) =>
    iconName.split(/[, ]+/).some((i) => i === icon)
  );
};

