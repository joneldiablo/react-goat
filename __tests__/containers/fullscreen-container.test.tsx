import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import FullscreenContainer from "../../src/containers/fullscreen-container";

describe("FullscreenContainer", () => {
  test("applies height from gutter", () => {
    const { container } = render(
      <FullscreenContainer name="fs" gutter={20}>x</FullscreenContainer>
    );
    const div = container.querySelector("div");
    expect(div).toHaveStyle({ height: "calc(100vh - 20px)" });
  });
});
