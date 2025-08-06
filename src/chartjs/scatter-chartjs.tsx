import Chartjs, { ChartjsProps } from "./_chartjs";

/**
 * Renders a scatter chart.
 *
 * @example
 * ```tsx
 * <ScatterChartjs name="points" data={data} />
 * ```
 */
export default class ScatterChartjs<TProps extends ChartjsProps = ChartjsProps> extends Chartjs<TProps> {
  static jsClass = "ScatterChartjs";

  static defaultProps = {
    ...Chartjs.defaultProps,
    graph: "Scatter",
  };
}

