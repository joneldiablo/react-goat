import React from "react";
import { render } from "@testing-library/react";
import Icons from "../src/media/icons";

describe("Icons", () => {
  test("renders icon element", () => {
    const { container } = render(<Icons icon="src-error" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
