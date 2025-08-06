import React from "react";
import { render, act } from "@testing-library/react";

const mockDetach = jest.fn();
const sensorMock: any = jest.fn().mockImplementation((_el, cb) => {
  sensorMock.cb = cb;
  return { detach: mockDetach };
});
jest.mock("css-element-queries/src/ResizeSensor", () => sensorMock);

import AutoResponsiveContainer from "../../src/containers/auto-responsive-container";

test("fires onResize with wrapper size", () => {
  jest.useFakeTimers();
  const onResize = jest.fn();
  const ref = React.createRef<AutoResponsiveContainer>();
  render(
    <AutoResponsiveContainer name="arc" onResize={onResize} ref={ref} />
  );
  const wrapper = (ref.current as any).wrapper.current as HTMLDivElement;
  Object.defineProperties(wrapper, {
    offsetWidth: { value: 100 },
    offsetHeight: { value: 50 },
  });
  act(() => {
    sensorMock.cb();
    jest.runAllTimers();
  });
  expect(onResize).toHaveBeenCalledWith({ width: 100, height: 50 });
  jest.useRealTimers();
});
