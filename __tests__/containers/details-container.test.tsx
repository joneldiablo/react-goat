import React from "react";
import { fireEvent, render } from "@testing-library/react";
import DetailsContainer from "../../src/containers/details-container";

describe("DetailsContainer", () => {
  test("toggles open state", () => {
    const { getByText } = render(
      <DetailsContainer name="det" label="label">content</DetailsContainer>
    );
    const summary = getByText("label");
    fireEvent.click(summary);
    expect((summary.parentElement as HTMLDetailsElement).open).toBe(true);
    fireEvent.click(summary);
    expect((summary.parentElement as HTMLDetailsElement).open).toBe(false);
  });
});
