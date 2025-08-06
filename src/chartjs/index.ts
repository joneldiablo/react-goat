import React from "react";

import { addComponents } from "../components";

import Chartjs from "./_chartjs";
import BarChartjs from "./bar-chartjs";
import DoughnutChartjs from "./doughnut-chartjs";
import LineChartjs from "./line-chartjs";
import ScatterChartjs from "./scatter-chartjs";

export * from "./_chartjs";
export * from "./bar-chartjs";
export * from "./doughnut-chartjs";
export * from "./line-chartjs";
export * from "./scatter-chartjs";

const chartComponents = {
  Chartjs,
  BarChartjs,
  DoughnutChartjs,
  LineChartjs,
  ScatterChartjs,
};

export const addChartComponents = (
  components: Record<string, React.FC | typeof React.Component>
) => {
  if (!components) return false;
  Object.assign(chartComponents, components);
  addComponents(chartComponents);
  return true;
};

export default chartComponents;
