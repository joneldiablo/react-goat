import Chartjs, { ChartjsProps, ChartjsState } from "./_chartjs";

const graph = "Bar";

/**
 * Renders a bar chart using Chart.js.
 *
 * @example
 * ```tsx
 * <BarChartjs name="sales" data={data} />
 * ```
 */
export default class BarChartjs<
  TProps extends ChartjsProps<"bar"> = ChartjsProps<"bar">,
  TState extends ChartjsState = ChartjsState
> extends Chartjs<TProps> {
  static jsClass = "BarChartjs";

  static defaultProps = {
    ...Chartjs.defaultProps,
    graph,
  };

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
  }
}
