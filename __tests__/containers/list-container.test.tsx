import React from "react";
import { render } from "@testing-library/react";
import ListContainer from "../../src/containers/list-container";

describe("ListContainer", () => {
  test("renders li for each child", () => {
    const { container } = render(
      <ListContainer name="list" liClasses="li">
        <div>1</div>
        <div>2</div>
      </ListContainer>
    );
    expect(container.querySelectorAll("li").length).toBe(2);
  });
});
