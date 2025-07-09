import React from "react";
import { render } from "@testing-library/react";
import GridContainer from "../../src/containers/grid-container";

const Child = ({ text }: { text: string }) => <div>{text}</div>;

describe("GridContainer", () => {
  test("wraps children in grid columns", () => {
    const { container } = render(
      <GridContainer name="grid" colClasses="col">
        <Child text="one" />
        <Child text="two" />
      </GridContainer>
    );
    const cols = container.querySelectorAll(".col");
    expect(cols.length).toBe(2);
  });
});
