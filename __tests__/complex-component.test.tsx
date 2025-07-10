import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import ComplexComponent from "../src/complex-component";

const schema = {
  view: { name: "hello", component: "Component", content: "Hola" },
  definitions: {},
};

describe("ComplexComponent", () => {
  test("renders json based content", () => {
    render(<ComplexComponent name="cc" schema={schema} />);
    expect(screen.getByText("Hola")).toBeInTheDocument();
  });

  test("renders children when childrenIn is false", () => {
    const { container } = render(
      <ComplexComponent name="cc" schema={schema}>child</ComplexComponent>
    );
    expect(container.innerHTML).toContain("child");
  });
});
