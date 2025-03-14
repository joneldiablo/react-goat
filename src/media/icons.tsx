import React from "react";
import IcoMoon, { IcoMoonProps, iconList } from "react-icomoon";

import { splitAndFlat } from "dbl-utils/utils";

import defaultIcons from "../app-icons-v1.0/selection.json";

let is = JSON.parse(JSON.stringify(defaultIcons));

export interface IconsProps {
  className?: string | string[];
  classes?: string | string[];
  height?: number | string;
  icon?: string | null;
  inline?: boolean;
  size?: number | string;
  style?: React.CSSProperties;
  title?: string;
  width?: number | string;
}

export default class Icons extends React.Component<IconsProps> {
  static jsClass = "Icons";
  static defaultProps: Partial<IconsProps> = {
    inline: true,
    className: "",
    icon: null,
    style: {}
  };

  render() {
    let { inline, icon, classes, className, style, width, height, title, size } = this.props;
    icon = searchIcon(icon) ? icon : "src-error";

    let cn: any[] = [Icons.jsClass, icon];
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
      size
    };

    return <IcoMoon {...props} />;
  }
}

export const setIconSet = (isIn: typeof is) => {
  is = isIn;
};

export const addIcons = (newSet: { icons: any[] }) => {
  is.icons.push(...newSet.icons);
};

export const searchIcon = (icon?: string | null): string | undefined => {
  if (!icon) return undefined;
  let list = iconList(is);
  return list.find(iconName =>
    iconName.split(/[, ]+/).some(i => i === icon)
  );
};
