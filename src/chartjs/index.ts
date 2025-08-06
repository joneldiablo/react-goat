import Chartjs, { addGraphs } from "./_chartjs";
import BarChartjs from "./bar-chartjs";
import DoughnutChartjs from "./doughnut-chartjs";
import LineChartjs from "./line-chartjs";
import ScatterChartjs from "./scatter-chartjs";

const chartjsComponents = {
  Chartjs,
  BarChartjs,
  DoughnutChartjs,
  LineChartjs,
  ScatterChartjs,
};

export { Chartjs, BarChartjs, DoughnutChartjs, LineChartjs, ScatterChartjs, addGraphs };
export default chartjsComponents;
