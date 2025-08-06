import React from "react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import { randomS4 } from "dbl-utils/utils";
import Component, { ComponentProps, ComponentState } from "../component";

export interface AutoResponsiveContainerProps extends ComponentProps {
  /** Additional CSS classes. */
  className?: string;
  /** Optional id for the wrapper. If omitted a random one is generated. */
  id?: string;
  /**
   * Callback fired on resize. If not provided a `resize` DOM event is
   * dispatched from the wrapper element.
   */
  onResize?: (size: { width: number; height: number }) => void;
}

export interface AutoResponsiveContainerState extends ComponentState {
  /** DOM id for the wrapper element. */
  id: string;
}

export default class AutoResponsiveContainer<TProps extends AutoResponsiveContainerProps = AutoResponsiveContainerProps>
  extends Component<TProps, AutoResponsiveContainerState> {
  static jsClass = "AutoResponsiveContainer";

  protected wrapper = React.createRef<HTMLDivElement>();
  protected resizeSensor?: ResizeSensor;
  protected onResizeTimeout?: NodeJS.Timeout;

  constructor(props: TProps) {
    super(props);
    this.state = { ...this.state, id: props.id || `arc-${randomS4()}` };
    this.onResize = this.onResize.bind(this);
  }

  /**
   * Handles size changes and forwards them to the callback or as a DOM
   * `resize` event on the wrapper element.
   */
  onResize() {
    clearTimeout(this.onResizeTimeout);
    this.onResizeTimeout = setTimeout(() => {
      if (!this.wrapper.current) return;
      const { offsetWidth: width, offsetHeight: height } = this.wrapper.current;
      if (typeof this.props.onResize === "function") {
        this.props.onResize({ width, height });
      } else {
        this.wrapper.current.dispatchEvent(
          new CustomEvent("resize", { detail: { width, height } })
        );
      }
    }, 300);
  }

  componentDidMount() {
    if (this.wrapper.current) {
      this.resizeSensor = new ResizeSensor(this.wrapper.current, this.onResize);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.onResizeTimeout);
    this.resizeSensor?.detach();
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
