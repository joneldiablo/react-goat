import React, { JSX } from "react";
import Container, { ContainerProps } from "./container";

export interface GridContainerProps extends ContainerProps {
  colClasses?: string | string[];
  colTag?: keyof JSX.IntrinsicElements;
}

export default class GridContainer<TProps extends GridContainerProps = GridContainerProps> extends Container<TProps> {
  static jsClass = "GridContainer";

  static defaultProps = {
    ...Container.defaultProps,
    colClasses: [],
    colTag: "div"
  };

  grid(children = this.props.children, extraClasses?: string | string[]) {
    const { colClasses, colTag } = this.props;
    return (
      Array.isArray(children) &&
      children
        .map((child: any, i: number) => {
          if (!child) return null;

          let colcn = [i % 2 ? "even" : "odd", "col-num-" + i];

          const childProps = (
            child.props?.style?.["--component-name"] ? child.props.children : child
          )?.props;

          const childColClasses = childProps?.colClasses;
          if (childColClasses) colcn.push(childColClasses);

          if (typeof colClasses === "string") colcn.push(colClasses);
          else if (Array.isArray(colClasses)) {
            colcn.push(colClasses[i] ?? colClasses[colClasses.length - 1]);
          }

          if (typeof extraClasses === "string") colcn.push(extraClasses);
          else if (Array.isArray(extraClasses)) {
            colcn.push(extraClasses[i] ?? extraClasses[extraClasses.length - 1]);
          }

          const ColTag = childProps?.colTag || colTag;
          return React.createElement(
            ColTag,
            { className: colcn.flat().join(" "), key: i },
            child
          );
        })
        .filter(Boolean)
    );
  }

  content(children = this.props.children) {
    return super.content(this.grid(children));
  }
}
