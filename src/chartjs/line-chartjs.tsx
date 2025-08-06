import Chartjs, { ChartjsProps, ChartjsState } from "./_chartjs";

const graph = "Line";

/**
 * Renders a line chart.
 *
 * @example
 * ```tsx
 * <LineChartjs name="trend" data={data} />
 * ```
 */
export default class LineChartjs<
  TProps extends ChartjsProps<"line"> = ChartjsProps<"line">,
  TState extends ChartjsState = ChartjsState
> extends Chartjs<TProps> {
  static jsClass = "LineChartjs";

  static defaultProps = {
    ...Chartjs.defaultProps,
    graph,
  };

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
  }
}
