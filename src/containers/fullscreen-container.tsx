import React from "react";
import Component, { ComponentProps, ComponentState } from "../component";

export interface FullscreenContainerProps extends ComponentProps {
  overflow?: string;
  gutter?: number;
}

export interface FullscreenContainerState extends ComponentState {}

export default class FullscreenContainer<
  TProps extends FullscreenContainerProps = FullscreenContainerProps,
  TState extends FullscreenContainerState = FullscreenContainerState
> extends Component<TProps, TState> {
  static jsClass = "FullscreenContainer";

  static defaultProps: Partial<FullscreenContainerProps> = {
    ...Component.defaultProps,
    overflow: "hidden",
    gutter: 0,
  };

  protected style: React.CSSProperties = {};

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
  }

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
