import React from "react";
import { render, screen } from "@testing-library/react";

import FlexContainer from "../../src/containers/flex-container";

test("wraps children in columns", () => {
  render(
    <FlexContainer colClassNames={["a", "b"]}>
      <span>1</span>
      <span>2</span>
    </FlexContainer>
  );
  const cols = screen.getAllByText(/[12]/).map((el) => el.parentElement);
  expect(cols[0]).toHaveClass("a");
  expect(cols[1]).toHaveClass("b");
});
