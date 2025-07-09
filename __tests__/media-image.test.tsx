import React from "react";
import { render } from "@testing-library/react";
import Image from "../src/media/image";

describe("Image", () => {
  test("renders img tag", () => {
    const { container } = render(<Image name="img" src="pic.jpg" />);
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
  });
});
