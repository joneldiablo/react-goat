import Chartjs, { ChartjsProps } from "./_chartjs";

/**
 * Renders a line chart.
 *
 * @example
 * ```tsx
 * <LineChartjs name="trend" data={data} />
 * ```
 */
export default class LineChartjs<TProps extends ChartjsProps = ChartjsProps> extends Chartjs<TProps> {
  static jsClass = "LineChartjs";

  static defaultProps = {
    ...Chartjs.defaultProps,
    graph: "Line",
  };
}

