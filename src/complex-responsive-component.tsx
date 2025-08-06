import ResizeSensor from "css-element-queries/src/ResizeSensor";

import { eventHandler } from "dbl-utils";

import ComplexComponent, {
  ComplexComponentProps,
  ComplexComponentState,
} from "./complex-component";

/**
 * Props for {@link ComplexResponsiveComponent}.
 */
export interface ComplexResponsiveComponentProps extends ComplexComponentProps {
  /** Breakpoints map used to assign responsive classes. */
  breakpoints?: Record<string, number>;
  /** Callback executed on resize events. */
  onResize?: (size: { width: number; height: number }) => void;
}

/**
 * Extension of {@link ComplexComponent} that reacts to size changes and
 * dispatches a `resize` event with breakpoint information.
 */
export default class ComplexResponsiveComponent<
  TProps extends ComplexResponsiveComponentProps = ComplexResponsiveComponentProps,
  TState extends ComplexComponentState = ComplexComponentState
> extends ComplexComponent<TProps, TState> {
  static jsClass = "ComplexResponsive";
  static defaultProps: Partial<ComplexResponsiveComponentProps> = {
    ...ComplexComponent.defaultProps,
    breakpoints: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  };

  protected resizeSensor?: ResizeSensor;
  protected onResizeTimeout?: NodeJS.Timeout;
  protected breakpoint?: string;

  componentDidMount(): void {
    super.componentDidMount();
    if (this.ref)
      this.resizeSensor = new ResizeSensor(this.ref.current!, this.onResize);
    this.onResize();
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    clearTimeout(this.onResizeTimeout);
    this.resizeSensor?.detach();
  }

  /**
   * Handles element resize and updates breakpoint state.
   */
  onResize = (): void => {
    clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
      if (!this.ref.current) return;
      const { offsetWidth: width, offsetHeight: height } = this.ref.current;
      if (typeof this.props.onResize === "function") {
        this.props.onResize({ width, height });
      }
      this.breakpoint = Object.keys(this.props.breakpoints ?? {})
        .filter((br) => width >= (this.props.breakpoints?.[br] ?? 0))
        .pop();
      eventHandler.dispatch(`resize.${this.props.name}`, {
        width,
        height,
        breakpoint: this.breakpoint,
      });
      this.setState({
        localClasses: [this.breakpoint, "animate"].flat().join(" "),
      });
    }, 200);
  };
}
