import React, { createRef } from "react";
import { Doughnut, Bar, Bubble, Chart, Line, Pie, PolarArea, Radar, Scatter } from "react-chartjs-2";

import eventHandler from "dbl-utils/event-handler";

import ProportionalContainer, { ProportionalContainerProps } from "../containers/proportional-container";
import Icons from "../media/icons";

const graphs: Record<string, React.ComponentType<any>> = {
  Doughnut, Bar, Bubble, Chart, Line, Pie, PolarArea, Radar, Scatter,
};

/**
 * Extends the available graph components for `Chartjs`.
 *
 * @example
 * ```ts
 * addGraphs({ Custom: CustomGraph });
 * ```
 */
export const addGraphs = (moreGraphs: Record<string, React.ComponentType<any>>): void => {
  Object.assign(graphs, moreGraphs);
};

export interface ChartjsProps extends ProportionalContainerProps {
  /** Data set for the graph. */
  data: any[] | Record<string, any>;
  /** Aspect ratio for the chart. */
  ratio?: number | Record<string, number>;
  /** Chart.js options object. */
  options?: Record<string, any>;
  /** List of Chart.js plugins. */
  plugins?: any[];
  /** Key to identify datasets. */
  datasetIdKey?: string;
  /** React node to display while loading. */
  fallbackContent?: React.ReactNode;
  /** Update mode passed to Chart.js. */
  updateMode?: "active" | "hide" | "none" | "normal" | "reset" | "resize" | "show";
  /** Graph component name to render. */
  graph?: string;
}

/**
 * Responsive container that renders a Chart.js graph.
 *
 * @example
 * ```tsx
 * <Chartjs name="sales" data={data} graph="Bar" />
 * ```
 */
export default class Chartjs<TProps extends ChartjsProps = ChartjsProps> extends ProportionalContainer<TProps> {
  static jsClass = "Chartjs";

  static defaultProps: Partial<ChartjsProps> = {
    ...ProportionalContainer.defaultProps,
    ratio: 1,
    options: {},
    plugins: [],
    datasetIdKey: "label",
    fallbackContent: null,
    graph: "Bar",
  };

  private refChart = createRef<any>();
  private events: Array<[string, (...args: any[]) => void]> = [];

  constructor(props: TProps) {
    super(props);
    this.events.push(
      ["ready." + this.props.name, this.onReadyElement.bind(this)],
      ["resize." + this.props.name, this.onResizeElement.bind(this)],
    );
  }

  componentDidMount(): void {
    this.events.forEach(([e, cb]) => eventHandler.subscribe(e, cb, this.name));
    super.componentDidMount();
  }

  componentWillUnmount(): void {
    super.componentWillUnmount();
    this.events.forEach(([e]) => eventHandler.unsubscribe(e, this.name));
  }

  protected onReadyElement(_obj: any): void {}

  protected onResizeElement(_resize: any): void {
    this.refChart.current?.update();
  }

  content(children: React.ReactNode = this.props.children): React.ReactNode {
    if (!this.breakpoint) return this.waitBreakpoint;

    const options = { ...(this.props.options || {}) };
    const ratioValue = typeof this.props.ratio === "object" ? this.props.ratio[this.breakpoint] : this.props.ratio;
    if (ratioValue) options.aspectRatio = 1 / ratioValue;
    const attribs = {
      data: this.props.data,
      options,
      plugins: this.props.plugins,
      redraw: false,
      datasetIdKey: this.props.datasetIdKey,
      fallbackContent: this.props.fallbackContent,
      updateMode: this.props.updateMode,
      ref: (ref: any) => {
        this.refChart.current = ref;
        if ((this.props as any).ref) (this.props as any).ref.current = ref;
      },
    };
    const Graph = graphs[this.props.graph ?? "Bar"];
    return super.content(
      <>
        {!this.props.loading ? <Graph {...attribs} /> : <Icons icon="spinner" classes="spinner" />}
        {children}
      </>,
    );
  }
}

