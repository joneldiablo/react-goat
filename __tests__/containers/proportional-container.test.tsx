import React from "react";
import { render } from "@testing-library/react";
import ProportionalContainer from "../../src/containers/proportional-container";

describe("ProportionalContainer", () => {
  test("applies padding based on ratio", () => {
    const { container } = render(
      <ProportionalContainer name="p" ratio={0.5}>x</ProportionalContainer>
    );
    const space = container.querySelector(".space") as HTMLElement;
    expect(space.style.paddingBottom).toBe("50%");
  });
});
