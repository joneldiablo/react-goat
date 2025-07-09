import React from "react";
import Component, { ComponentProps } from "../component";

export interface FullscreenContainerProps extends ComponentProps {
  overflow?: string;
  gutter?: number;
}

export default class FullscreenContainer<TProps extends FullscreenContainerProps = FullscreenContainerProps>
  extends Component<TProps> {
  static jsClass = "FullscreenContainer";

  static defaultProps: Partial<FullscreenContainerProps> = {
    ...Component.defaultProps,
    overflow: "hidden",
    gutter: 0,
  };

  protected style: React.CSSProperties = {};

  protected content(children = this.props.children): React.ReactNode {
    const { overflow, gutter } = this.props;
    this.style = {
      ...this.style,
      overflow,
      height: gutter ? `calc(100vh - ${gutter}px)` : "100vh",
    };
    return children;
  }
}
