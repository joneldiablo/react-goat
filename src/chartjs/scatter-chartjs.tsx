import Chartjs, { ChartjsProps, ChartjsState } from "./_chartjs";

const graph = "Scatter";
/**
 * Renders a scatter chart.
 *
 * @example
 * ```tsx
 * <ScatterChartjs name="points" data={data} />
 * ```
 */
export default class ScatterChartjs<
  TProps extends ChartjsProps<"scatter"> = ChartjsProps<"scatter">,
  TState extends ChartjsState = ChartjsState
> extends Chartjs<TProps> {
  static jsClass = "ScatterChartjs";

  static defaultProps = {
    ...Chartjs.defaultProps,
    graph,
  };

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
  }
}
