import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import AutoResponsiveContainer from "../../src/containers/auto-responsive-container";

describe("AutoResponsiveContainer", () => {
  test("renders with unique id and class", () => {
    const { container } = render(
      <AutoResponsiveContainer name="arc">child</AutoResponsiveContainer>
    );
    const div = container.querySelector("div");
    expect(div?.id).toMatch(/^arc-/);
    expect(div).toHaveClass("AutoResponsiveContainer");
  });
});
