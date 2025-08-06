import React from "react";

import Container, { ContainerProps, ContainerState } from "./container";

export interface ProportionalContainerProps extends ContainerProps {
  ratio?: string | Record<string, string | number> | number;
  overflow?: string;
  innerClasses?: string | string[];
}

export interface ProportionalContainerState extends ContainerState {}

export default class ProportionalContainer<
  TProps extends ProportionalContainerProps = ProportionalContainerProps,
  TState extends ProportionalContainerState = ProportionalContainerState
> extends Container<TProps, TState> {
  static jsClass = "ProportionalContainer";

  static defaultProps = {
    ...Container.defaultProps,
    ratio: "100%",
    overflow: "hidden",
    fullWidth: true,
  } as Partial<ProportionalContainer>;

  private ratioResponsive?: string | number;

  protected style: React.CSSProperties = {
    position: "relative",
  };

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
  }

  content(children: React.ReactNode = this.props.children) {
    if (!this.breakpoint) return this.waitBreakpoint;

    const { ratio, overflow, innerClasses } = this.props;
    this.ratioResponsive =
      typeof ratio === "object" ? ratio[this.breakpoint] : ratio;

    const paddingBottom =
      typeof this.ratioResponsive === "number"
        ? `${this.ratioResponsive * 100}%`
        : this.ratioResponsive;

    const st = {
      overflow,
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    };

    return (
      <>
        <div className="space" style={{ paddingBottom }} />
        <div className={["inner", innerClasses].flat().join(" ")} style={st}>
          {children}
        </div>
      </>
    );
  }
}
