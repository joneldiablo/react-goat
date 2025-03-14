import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import Component from "../src/component";

describe("Component", () => {
  test("renders with default props", () => {
    render(<Component name="test-component" />);
    const div = document.querySelector("body>div>div");
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('test-component-Component');
  });

  test("renders without tag", () => {
    render(<Component name="test-component" tag={false}>hello-test</Component>);
    const div = document.querySelector("body>div");
    expect(div).toHaveTextContent('hello-test');
  });

  test("applies additional class names", () => {
    render(<Component name="test-component" classes="extra-class" />);
    const div = document.querySelector(".test-component-Component");
    expect(div).toHaveClass("extra-class");
  });

  test("renders children correctly", () => {
    render(<Component name="test-component">Hello World</Component>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  test("does not render when active is false", () => {
    render(<Component name="test-component" active={false} />);
    expect(screen.queryByText("test-component-Component")).not.toBeInTheDocument();
  });


});
