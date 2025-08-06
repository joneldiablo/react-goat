import React from "react";
import { render, act, screen } from "@testing-library/react";

jest.mock("dbl-utils/event-handler", () => ({ dispatch: jest.fn(), subscribe: jest.fn(), unsubscribe: jest.fn() }));

import GridContainer from "../../src/containers/grid-container";

test("applies row class and wraps children", () => {
  const ref = React.createRef<GridContainer>();
  render(
    <GridContainer name="grid" ref={ref}>
      <div>A</div>
      <div>B</div>
    </GridContainer>
  );
  act(() => {
    (ref.current as any).onResize({ width: 800, height: 600 });
  });
  const wrapper = (ref.current as any).ref.current as HTMLDivElement;
  expect(wrapper.className).toContain("row");
  expect(screen.getByText("A").parentElement).toHaveClass("col-num-0");
});
