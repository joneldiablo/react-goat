import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import GoatComponent from "../src/goat-component";

const view = {
  name: "hello",
  component: "Component",
  content: "Hola"
};

describe("GoatComponent", () => {
  test("renders json based content", () => {
    render(<GoatComponent name="gc" view={view} />);
    expect(screen.getByText("Hola")).toBeInTheDocument();
  });

  test("renders children when childrenIn is false", () => {
    const { container } = render(
      <GoatComponent name="gc" view={view}>child</GoatComponent>
    );
    expect(container.innerHTML).toContain("child");
  });
});
