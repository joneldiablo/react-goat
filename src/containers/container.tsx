import React, { createRef, ReactNode, RefObject } from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";

import eventHandler from "dbl-utils/event-handler";

import Component, { ComponentProps, ComponentState } from "../component";
import Icons from "../media/icons";

/**
 * Mapping of breakpoint names to their minimum pixel width.
 */
export interface Breakpoints {
  [key: string]: number;
}

export interface ContainerProps extends ComponentProps {
  /**
   * Adds the `container-fluid` class when not using `fullWidth`.
   */
  fluid?: boolean;
  /**
   * Avoids adding bootstrap container classes when `true`.
   */
  fullWidth?: boolean;
  /**
   * Custom breakpoint map. The keys represent breakpoint names
   * and the values the minimum width to activate them.
   */
  breakpoints?: Breakpoints;
  xsClasses?: string | string[];
  smClasses?: string | string[];
  mdClasses?: string | string[];
  lgClasses?: string | string[];
  xlClasses?: string | string[];
  xxlClasses?: string | string[];
  /**
   * Callback fired after every resize with the new dimensions.
   */
  onResize?: (resp: ResizeResponse) => void;
}

/**
 * Information emitted on each resize event.
 */
export interface ResizeResponse {
  width: number;
  height: number;
  breakpoint: string | undefined;
  orientation: "landscape" | "portrait";
}

export interface ContainerState extends ComponentState {

}

/**
 * Responsive wrapper that applies Bootstrap container classes based on the
 * current width and exposes resize information through callbacks and events.
 */
export default class Container<
  TProps extends ContainerProps = ContainerProps,
  TState extends ContainerState = ContainerState
> extends Component<TProps, TState> {
  static jsClass = "Container";

  static defaultProps: Partial<ContainerProps> = {
    ...Component.defaultProps,
    fluid: true,
    fullWidth: false,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  };

  protected breakpoint: string | undefined = undefined;
  protected orientation: "landscape" | "portrait" | undefined;
  protected width = 0;
  protected height = 0;
  protected waitBreakpoint = <Icons icon="spinner" classes="spinner" />;
  protected resizeSensor?: ResizeSensor;
  protected onResizeTimeout?: NodeJS.Timeout;

  constructor(props: TProps) {
    super(props);
    this.ref = createRef<HTMLDivElement>();
    this.onResize = this.onResize.bind(this);
  }

  get componentProps() {
    return {
      id: this.props.name,
      ...this.props._props,
    };
  }

  /**
   * Updates the container class list according to the active breakpoint
   * and Bootstrap container type.
   */
  updateSize() {
    const { fluid, fullWidth } = this.props;
    const containerType = !fullWidth ? (fluid ? "container-fluid" : "container") : "";

    const baseClasses = new Set(this.state.localClasses.split(" "));

    Object.keys(this.props.breakpoints ?? {}).forEach((br) => baseClasses.delete(br));
    [containerType, this.breakpoint, "animate"].forEach((c) => c && baseClasses.add(c));

    const classesKey = (this.breakpoint ?? "") + "Classes" as keyof ContainerProps;
    this.addClasses(this.props[classesKey] as string | null);

    this.setState({
      localClasses: Array.from(baseClasses).join(" "),
    });
  }

  /**
   * Handles size changes, computing the new breakpoint and dispatching
   * resize information to listeners.
   */
  onResize(firstTime?: boolean | { width: number; height: number }) {
    const resizingFunc = () => {
      if (!this.ref.current) return;

      let width: number, height: number;
      if (firstTime === true) {
        ({ offsetWidth: width, offsetHeight: height } = this.ref.current);
      } else if (typeof firstTime === "object") {
        ({ width, height } = firstTime);
      } else {
        return;
      }

      this.breakpoint = Object.keys(this.props.breakpoints ?? {})
        .filter((br) => width >= (this.props.breakpoints?.[br] ?? 0))
        .pop();
      this.orientation = width >= height ? "landscape" : "portrait";
      this.width = width;
      this.height = height;

      const resp: ResizeResponse = {
        width,
        height,
        breakpoint: this.breakpoint,
        orientation: this.orientation,
      };

      if (typeof this.props.onResize === "function") {
        this.props.onResize(resp);
      }

      eventHandler.dispatch(`resize.${this.props.name}`, resp);
      this.updateSize();
    };

    if (firstTime === true) {
      resizingFunc();
      eventHandler.dispatch(`ready.${this.props.name}`);
    } else {
      clearTimeout(this.onResizeTimeout);
      this.onResizeTimeout = setTimeout(resizingFunc, 200);
    }
  }

  /**
   * Re-evaluates classes when container type flags change.
   */
  componentDidUpdate(prevProps: TProps) {
    if (prevProps.fluid !== this.props.fluid || prevProps.fullWidth !== this.props.fullWidth) {
      this.updateSize();
    }
  }

  /**
   * Starts listening for resize events once the element is mounted.
   */
  componentDidMount() {
    if (this.ref.current) {
      this.resizeSensor = new ResizeSensor(this.ref.current, this.onResize);
    }
    this.onResize(true);
  }

  /**
   * Cleans up any pending timers and sensors.
   */
  componentWillUnmount() {
    clearTimeout(this.onResizeTimeout);
    this.resizeSensor?.detach();
  }

  /**
   * Renders children once a breakpoint has been computed, otherwise a
   * loading spinner is displayed while the size is unknown.
   */
  content(children: ReactNode = this.props.children) {
    return this.breakpoint ? children : this.waitBreakpoint;
  }

}
