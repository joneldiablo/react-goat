import React from "react";
import Container, { ContainerProps } from "./container";

export interface ListContainerProps extends ContainerProps {
  liClasses?: string | string[];
}

export default class ListContainer<TProps extends ListContainerProps = ListContainerProps> extends Container<TProps> {
  static jsClass = "ListContainer";

  static defaultProps = {
    ...Container.defaultProps,
    liClasses: [],
    fullWidth: true,
    tag: "ul",
  };

  li(children = this.props.children, extraClasses?: string | string[]) {
    const { liClasses } = this.props;

    return (
      Array.isArray(children) &&
      children
        .map((child, i) => {
          if (!child) return null;

          let licn = [i % 2 ? "even" : "odd", `li-num-${i}`];

          const theChildConf = (
            child.props?.style?.["--component-name"] ? child.props.children : child
          )?.props;

          const childLiClasses = theChildConf?.liClasses;
          if (childLiClasses) licn.push(childLiClasses);

          if (typeof liClasses === "string") licn.push(liClasses);
          else if (Array.isArray(liClasses)) {
            licn.push(liClasses[i] ?? liClasses[liClasses.length - 1]);
          }

          if (typeof extraClasses === "string") licn.push(extraClasses);
          else if (Array.isArray(extraClasses)) {
            licn.push(extraClasses[i] ?? extraClasses[extraClasses.length - 1]);
          }

          return (
            <li className={licn.flat().join(" ")} key={i}>
              {child}
            </li>
          );
        })
        .filter(Boolean)
    );
  }

  content(children = this.props.children) {
    return super.content(this.li(children));
  }
}
