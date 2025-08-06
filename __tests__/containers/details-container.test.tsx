import React from "react";
import { render, act } from "@testing-library/react";

jest.mock("dbl-utils/event-handler", () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  dispatch: jest.fn(),
}));

import DetailsContainer from "../../src/containers/details-container";
import eventHandler from "dbl-utils/event-handler";

test("toggles and dispatches event", () => {
  const ref = React.createRef<DetailsContainer>();
  render(
    <DetailsContainer name="dc" label="title" ref={ref}>
      <span>Hi</span>
    </DetailsContainer>
  );
  act(() => {
    (ref.current as any).onToggle({ target: { open: true } } as any);
  });
  expect((ref.current as any).state.open).toBe(true);
  expect(eventHandler.dispatch).toHaveBeenCalledWith("dc", expect.any(Object));
});
