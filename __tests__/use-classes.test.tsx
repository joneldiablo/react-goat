import React from "react";
import { render, act } from "@testing-library/react";
import useClasses from "../src/hooks/use-classes";

test("adds, deletes and toggles classes", () => {
  let api: any;
  const Test = () => {
    api = useClasses({ initialClasses: "a" });
    return <div data-testid="el" className={api.classes}></div>;
  };
  const { getByTestId } = render(<Test />);
  expect(getByTestId("el")).toHaveClass("a");
  act(() => api.addClasses("b"));
  expect(getByTestId("el")).toHaveClass("a b");
  act(() => api.deleteClasses("a"));
  expect(getByTestId("el")).toHaveClass("b");
  act(() => api.toggleClasses("b c"));
  expect(getByTestId("el")).toHaveClass("c");
});
