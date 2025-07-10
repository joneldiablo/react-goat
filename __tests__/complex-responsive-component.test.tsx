import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import ComplexResponsiveComponent from "../src/complex-responsive-component";

const schema = {
  view: { name: "hello", component: "Component", content: "Hola" },
  definitions: {},
};

describe("ComplexResponsiveComponent", () => {
  test("updates classes on resize", async () => {
    jest.useFakeTimers();
    const ref = React.createRef<ComplexResponsiveComponent>();
    render(<ComplexResponsiveComponent name="crc" schema={schema} ref={ref} />);

    const div = (ref.current as any).ref.current as HTMLElement;
    Object.defineProperty(div, "offsetWidth", { value: 800, configurable: true });
    Object.defineProperty(div, "offsetHeight", { value: 600, configurable: true });

    act(() => {
      ref.current!.onResize();
      jest.advanceTimersByTime(201);
    });

    await waitFor(() => {
      expect(div.className).toContain("md");
    });
    jest.useRealTimers();
  });
});
