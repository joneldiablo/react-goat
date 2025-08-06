import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import FetchContainer from "../../src/containers/fetch-container";

test("fetches html and renders it", async () => {
  global.fetch = jest.fn().mockResolvedValue({ text: () => Promise.resolve("<p>Hi</p>") }) as any;
  render(
    <FetchContainer name="fc" url="/test" />
  );
  await waitFor(() => expect(screen.getByText("Hi")).toBeInTheDocument());
});
