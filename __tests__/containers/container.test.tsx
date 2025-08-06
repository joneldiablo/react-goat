import React from "react";
import { render, act } from "@testing-library/react";

jest.mock("dbl-utils/event-handler", () => ({ dispatch: jest.fn(), subscribe: jest.fn(), unsubscribe: jest.fn() }));

import Container from "../../src/containers/container";

test("updates classes on resize and calls callback", () => {
  jest.useFakeTimers();
  const onResize = jest.fn();
  const ref = React.createRef<Container>();
  render(
    <Container name="c" ref={ref} onResize={onResize}>
      <span>child</span>
    </Container>
  );
  const el = (ref.current as any).ref.current as HTMLDivElement;
  Object.defineProperties(el, {
    offsetWidth: { value: 800 },
    offsetHeight: { value: 600 },
  });
  onResize.mockClear();
  act(() => {
    (ref.current as any).onResize(true);
    jest.runAllTimers();
  });
  expect(onResize).toHaveBeenCalledWith(
    expect.objectContaining({ breakpoint: "md" })
  );
  expect((ref.current as any).state.localClasses).toContain("md");
  jest.useRealTimers();
});
