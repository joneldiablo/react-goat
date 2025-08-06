import React from "react";
import { render, screen, act } from "@testing-library/react";

const eventHandler = require("dbl-utils/event-handler").default;
eventHandler.subscribe = jest.fn();
eventHandler.unsubscribe = jest.fn();
eventHandler.dispatch = jest.fn();

jest.mock("../src/media/icons", () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="icon" {...props} />,
}));

const Chartjs = require("../src/chartjs/_chartjs").default;
const BarChartjs = require("../src/chartjs/bar-chartjs").default;

test("renders specified graph", () => {
  const ref = React.createRef<Chartjs>();
  render(<Chartjs name="c" data={{}} graph="Bar" ref={ref} />);
  act(() => {
    (ref.current as any).onResize({ width: 100, height: 100 });
  });
  expect(screen.getByTestId("bar")).toBeInTheDocument();
});

test("bar chart uses bar graph by default", () => {
  const ref = React.createRef<BarChartjs>();
  render(<BarChartjs name="b" data={{}} ref={ref} />);
  act(() => {
    (ref.current as any).onResize({ width: 100, height: 100 });
  });
  expect(screen.getByTestId("bar")).toBeInTheDocument();
});

