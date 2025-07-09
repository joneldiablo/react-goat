import React from "react";
import { render, waitFor } from "@testing-library/react";
import FetchContainer from "../../src/containers/fetch-container";

global.fetch = jest.fn(() => Promise.resolve({ text: () => Promise.resolve("ok") })) as any;

describe("FetchContainer", () => {
  test("fetches and renders content", async () => {
    const { container } = render(<FetchContainer name="f" url="/" />);
    await waitFor(() => {
      expect(container.innerHTML).toContain("ok");
    });
  });
});
