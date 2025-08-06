import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import Controller from "../src/controllers/controller";

describe("Controller", () => {
  test("toggles test wrapper class", () => {
    const { rerender } = render(<Controller name="ctrl" test content={{}} />);
    const article = document.querySelector("article");
    expect(article).toHaveClass("test-view-wrapper");

    rerender(<Controller name="ctrl" test={false} />);
    expect(article).not.toHaveClass("test-view-wrapper");
  });

  test("forces update when location changes", () => {
    const ref = React.createRef<Controller>();
    const { rerender } = render(
      <Controller name="ctrl" location={{ pathname: "/a" }} ref={ref} content={{}} />
    );
    const spy = jest.spyOn(ref.current as Controller, "forceUpdate");

    rerender(<Controller name="ctrl" location={{ pathname: "/b" }} ref={ref} content={{}} />);
    expect(spy).toHaveBeenCalled();
  });
});
