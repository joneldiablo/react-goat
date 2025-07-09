import React from "react";
import { render } from "@testing-library/react";
import Video from "../src/media/video";

describe("Video", () => {
  test("renders video tag", () => {
    const { container } = render(<Video name="v" src="test.mp4" />);
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
  });
});
