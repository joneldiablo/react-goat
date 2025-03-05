import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Goat from "../src/goat";

const mockMutations = jest.fn((name, data) => data);

describe("Goat Component", () => {
  it("should render simple text content correctly", () => {
    const goat = new Goat({}, mockMutations);
    const content = "Hello, World!";
    const builtContent = goat.buildContent(content);

    const { getByText } = render(<>{builtContent}</>);

    expect(getByText("Hello, World!")).toBeInTheDocument();
  });

  it("should render a dynamic component with content", () => {
    const goat = new Goat({}, mockMutations);
    const content = {
      name: "dynamic-component",
      component: "Component",
      content: "Dynamic Content"
    };

    const builtContent = goat.buildContent(content);

    const { getByText } = render(<>{builtContent}</>);

    expect(getByText("Dynamic Content")).toBeInTheDocument();
  });

  it("should wrap components inside a section by default", () => {
    const goat = new Goat({}, mockMutations);
    const content = {
      name: "wrapped-component",
      component: "Component",
      content: "Wrapped Content"
    };

    const builtContent = goat.buildContent(content);

    const { container } = render(<>{builtContent}</>);

    expect(container.querySelector("section")).toBeTruthy();
  });

  it("should exclude certain components from being wrapped", () => {
    const goat = new Goat({}, mockMutations);
    const content = {
      name: "NavLink",
      component: "NavLink",
      content: "Excluded Content"
    };

    const builtContent = goat.buildContent(content);

    const { getByText } = render(<>{builtContent}</>);

    expect(getByText("Excluded Content").closest("section")).toBeNull();
  });

  it("should apply mutations correctly", () => {
    const mockMutation = jest.fn((name, data) => ({
      ...data,
      style: { color: "red" }
    }));
    const goat = new Goat({}, mockMutation);
    const content = {
      name: "mutated-component",
      component: "Component",
      content: "Mutated Content"
    };

    const builtContent = goat.buildContent(content);

    const { getByText } = render(<>{builtContent}</>);
    expect(getByText("Mutated Content")).toBeInTheDocument();
  });
});
