import Chartjs, { ChartjsProps } from "./_chartjs";

/**
 * Renders a bar chart using Chart.js.
 *
 * @example
 * ```tsx
 * <BarChartjs name="sales" data={data} />
 * ```
 */
export default class BarChartjs<TProps extends ChartjsProps = ChartjsProps> extends Chartjs<TProps> {
  static jsClass = "BarChartjs";

  static defaultProps = {
    ...Chartjs.defaultProps,
    graph: "Bar",
  };
}

