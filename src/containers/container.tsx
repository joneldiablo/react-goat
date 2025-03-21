import React, { createRef, ReactNode, RefObject } from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";

import eventHandler from "dbl-utils/event-handler";

import Component, { ComponentProps, ComponentState } from "../component";
import Icons from "../media/icons";

export interface Breakpoints {
  [key: string]: number;
}

export interface ContainerProps extends ComponentProps {
  fluid?: boolean;
  fullWidth?: boolean;
  breakpoints?: Breakpoints;
  xsClasses?: string | string[];
  smClasses?: string | string[];
  mdClasses?: string | string[];
  lgClasses?: string | string[];
  xlClasses?: string | string[];
  xxlClasses?: string | string[];
  onResize?: (resp: ResizeResponse) => void;
}

export interface ResizeResponse {
  width: number;
  height: number;
  breakpoint: string | undefined;
  orientation: "landscape" | "portrait";
}

export interface ContainerState extends ComponentState {

}

export default class Container<
  TProps extends ContainerProps = ContainerProps,
  TState extends ContainerState = ContainerState
> extends Component<TProps, TState> {
  static jsClass = "Container";

  static defaultProps: Partial<ContainerProps> = {
    ...Component.defaultProps,
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

  updateSize() {
    const localClasses = new Set(this.state.localClasses.split(" "));

    Object.keys(this.props.breakpoints ?? {}).forEach((br) => localClasses.delete(br));
    [this.breakpoint, "animate"].forEach((c) => c && localClasses.add(c));

    this.setState({
      localClasses: Array.from(localClasses).join(" "),
    });

    const classesKey = (this.breakpoint ?? "") + "Classes" as keyof ContainerProps;
    if (!this.addClasses(this.props[classesKey] as string | null)) {
      this.setState({
        localClasses: this.state.localClasses,
      });
    }
  }

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

  componentDidMount() {
    if (this.ref.current) {
      this.resizeSensor = new ResizeSensor(this.ref.current, this.onResize);
    }
    this.onResize(true);
  }

  componentWillUnmount() {
    clearTimeout(this.onResizeTimeout);
    this.resizeSensor?.detach();
  }

  content(children: ReactNode = this.props.children) {
    return this.breakpoint ? children : this.waitBreakpoint;
  }

}
