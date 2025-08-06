import React from "react";

import eventHandler from "dbl-utils/event-handler";
import { splitAndFlat } from "dbl-utils/utils";

import Component, { ComponentProps, ComponentState } from "../component";

export interface DetailsContainerProps extends ComponentProps {
  /** Whether the details element should start opened. */
  open?: boolean;
  /** Text or element displayed in the summary. */
  label?: React.ReactNode;
  /** Classes applied to the content wrapper. */
  containerClasses?: string | string[];
  /** Classes applied to the summary label. */
  labelClasses?: string | string[];
  id?: string;
  data?: any;
}

export interface DetailsContainerState extends ComponentState {
  open: boolean;
}

/**
 * Thin wrapper around the native `<details>` element that syncs its state
 * through the component system and dispatches toggle events.
 */
export default class DetailsContainer<
  TProps extends DetailsContainerProps = DetailsContainerProps,
  TState extends DetailsContainerState = DetailsContainerState
> extends Component<TProps, TState> {
  static jsClass = "DetailsContainer";

  protected events: [string, (event: any) => void][] = [];
  protected ref = React.createRef<HTMLDetailsElement>();

  constructor(props: TProps) {
    super(props);
    this.tag = "details";
    Object.assign(this.state, {
      open: !!props.open,
    });
    this.onToggle = this.onToggle.bind(this);
    this.events.push(["update." + props.name, this.onUpdate.bind(this)]);
  }

  get componentProps() {
    return { open: this.state.open, ...this.props._props };
  }

  /**
   * Subscribes to update events and attaches the native `toggle` listener.
   */
  componentDidMount() {
    this.ref.current?.addEventListener("toggle", this.onToggle);
    this.events.forEach(([evt, handler]) =>
      eventHandler.subscribe(evt, handler, this.props.name)
    );
  }

  /**
   * Cleans up subscriptions and DOM listeners.
   */
  componentWillUnmount() {
    this.ref.current?.removeEventListener("toggle", this.onToggle);
    this.events.forEach(([evt]) => eventHandler.unsubscribe(evt, this.props.name));
  }

  /**
   * Updates the open state when an external event is received.
   */
  onUpdate = ({ open }: { open?: boolean }) => {
    if (typeof open === "boolean") {
      this.setState({ open });
    }
  };

  /**
   * Synchronizes internal state when the user toggles the details element and
   * dispatches an event with the new state.
   */
  onToggle(evt: Event) {
    const open = (evt.target as HTMLDetailsElement).open;
    this.setState({ open });
    eventHandler.dispatch(this.props.name, {
      [this.props.name]: open ? "open" : "closed",
      id: this.props.id,
      data: this.props.data,
    });
  }

  /**
   * Renders the summary label and conditionally the inner content when open.
   */
  content(children: React.ReactNode = this.props.children) {
    const { containerClasses, labelClasses } = this.props;
    const cnl = Array.isArray(labelClasses) ? labelClasses : [labelClasses];
    const cnc = Array.isArray(containerClasses) ? containerClasses : [containerClasses];
    return (
      <>
        <summary className={splitAndFlat(cnl, " ").join(" ")}>
          {this.props.label}
        </summary>
        {this.state.open && (
          <div className={splitAndFlat(cnc, " ").join(" ")}>{children}</div>
        )}
      </>
    );
  }
}
