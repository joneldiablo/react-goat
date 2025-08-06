import Chartjs, { ChartjsProps, ChartjsState } from "./_chartjs";

const graph = "Doughnut";

/**
 * Renders a doughnut chart.
 *
 * @example
 * ```tsx
 * <DoughnutChartjs name="stats" data={data} />
 * ```
 */
export default class DoughnutChartjs<
  TProps extends ChartjsProps<"doughnut"> = ChartjsProps<"doughnut">,
  TState extends ChartjsState = ChartjsState
> extends Chartjs<TProps> {
  static jsClass = "DoughnutChartjs";

  static defaultProps = {
    ...Chartjs.defaultProps,
    graph,
  };

  constructor(props: TProps) {
    super(props);
    this.state = this.state as TState;
  }
}
