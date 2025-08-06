import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
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

  test("manages classes through helpers", () => {
    class TestComp extends Component {
      exposeAdd(c: string) { this.addClasses(c); }
      exposeDel(c: string) { this.deleteClasses(c); }
      exposeToggle(c: string) { this.toggleClasses(c); }
    }
    const ref = React.createRef<TestComp>();
    render(<TestComp name="cls" ref={ref} />);
    const el = (ref.current as any).ref.current as HTMLElement;
    act(() => ref.current!.exposeAdd("a b"));
    expect(el.className).toContain("a");
    expect(el.className).toContain("b");
    act(() => ref.current!.exposeDel("a"));
    expect(el.className).not.toContain("a");
    act(() => ref.current!.exposeToggle("b c"));
    expect(el.className).toContain("c");
    expect(el.className).not.toContain("b");
  });


});
