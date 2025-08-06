import "@testing-library/jest-dom";

import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

jest.mock("dbl-utils/event-handler", () => ({
  __esModule: true,
  default: {
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    dispatch: jest.fn(),
  },
}));

jest.mock("react-chartjs-2", () => {
  const React = require("react");
  return {
    Bar: (props: any) => React.createElement("div", { ...props, "data-testid": "bar" }),
    Doughnut: (props: any) => React.createElement("div", { ...props, "data-testid": "doughnut" }),
    Line: (props: any) => React.createElement("div", { ...props, "data-testid": "line" }),
    Scatter: (props: any) => React.createElement("div", { ...props, "data-testid": "scatter" }),
  };
}, { virtual: true });

