import Chartjs, { ChartjsProps } from "./_chartjs";

/**
 * Renders a doughnut chart.
 *
 * @example
 * ```tsx
 * <DoughnutChartjs name="stats" data={data} />
 * ```
 */
export default class DoughnutChartjs<TProps extends ChartjsProps = ChartjsProps> extends Chartjs<TProps> {
  static jsClass = "DoughnutChartjs";

  static defaultProps = {
    ...Chartjs.defaultProps,
    graph: "Doughnut",
  };
}

