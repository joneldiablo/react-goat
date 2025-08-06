import React from "react";
import { render, screen, act } from "@testing-library/react";

jest.mock("dbl-utils/event-handler", () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  dispatch: jest.fn(),
}));

import GoatContainer from "../../src/containers/goat-container";

test("renders view content", () => {
  const ref = React.createRef<GoatContainer>();
  render(
    <GoatContainer
      name="gc"
      view={{ component: "Component", name: "inner", content: "Hi" }}
      ref={ref}
    />
  );
  act(() => {
    (ref.current as any).onResize({ width: 800, height: 600 });
  });
  expect(screen.getByText("Hi")).toBeInTheDocument();
});
