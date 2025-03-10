import React from "react";

import { eventHandler, splitAndFlat } from "dbl-utils";

import Component, { ComponentProps, ComponentState } from "../component";

export interface DetailsContainerProps extends ComponentProps {
  open?: boolean;
  label?: React.ReactNode;
  containerClasses?: string | string[];
  labelClasses?: string | string[];
  id?: string;
  data?: any;
}

export interface DetailsContainerState extends ComponentState {
  open: boolean;
}

export default class DetailsContainer<
  TProps extends DetailsContainerProps = DetailsContainerProps,
  TState extends DetailsContainerState = DetailsContainerState
> extends Component<TProps, TState> {
  static jsClass = 'DetailsContainer';

  protected events: [string, (event: any) => void][] = [];
  protected ref = React.createRef<HTMLDetailsElement>();

  constructor(props: TProps) {
    super(props);
    this.tag = "details";
    Object.assign(this.state, {
      open: !!props.open,
    });
    this.onToggle = this.onToggle.bind(this);
    this.events.push(
      ["update." + props.name, this.onUpdate.bind(this),]
    );
    this.eventHandlers.onToggle = this.onToggle;
  }

  get componentProps() {
    return { open: this.state.open, ...this.props._props };
  }

  componentDidMount() {
    this.events.forEach(([evt, handler]) => eventHandler.subscribe(evt, handler, this.props.name));
  }

  componentWillUnmount() {
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt, this.props.name));
  }

  onUpdate = ({ open }: { open?: boolean }) => {
    if (typeof open === "boolean") {
      this.setState({ open });
    }
  };

  onToggle(evt: Event) {
    const open = (evt.target as HTMLDetailsElement).open;
    this.setState({ open });
    eventHandler.dispatch(this.props.name, {
      [this.props.name]: open ? "open" : "closed",
      id: this.props.id,
      data: this.props.data,
    });
  }

  content(children: React.ReactNode = this.props.children) {
    const { containerClasses, labelClasses } = this.props;
    const cnl = Array.isArray(labelClasses) ? labelClasses : [labelClasses];
    const cnc = Array.isArray(containerClasses) ? containerClasses : [containerClasses];
    return (
      <>
        <summary className={splitAndFlat(cnl, ' ').join(" ")}>{this.props.label}</summary>
        {this.state.open && <div className={splitAndFlat(cnc, ' ').join(" ")}>{children}</div>}
      </>
    );
  }
}
