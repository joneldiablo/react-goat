import React from "react";
import { randomS4 } from "dbl-utils/utils";
import Component, { ComponentProps, ComponentState } from "../component";

export interface AutoResponsiveContainerProps extends ComponentProps {
  className?: string;
}

export interface AutoResponsiveContainerState extends ComponentState {
  id: string;
}

export default class AutoResponsiveContainer<
  TProps extends AutoResponsiveContainerProps = AutoResponsiveContainerProps,
  TState extends AutoResponsiveContainerState = AutoResponsiveContainerState
> extends Component<TProps, TState> {
  static jsClass = "AutoResponsiveContainer";

  protected wrapper = React.createRef<HTMLDivElement>();

  constructor(props: TProps) {
    super(props);
    this.state = { ...this.state, id: `arc-${randomS4()}` } as TState;
  }

  render() {
    const { className, style, children } = this.props;
    const { id } = this.state;
    const cn = [AutoResponsiveContainer.jsClass, className]
      .filter(Boolean)
      .join(" ");
    return (
      <div id={id} ref={this.wrapper} className={cn} style={style}>
        {children}
      </div>
    );
  }
}
