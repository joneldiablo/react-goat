import React from "react";
import { render } from "@testing-library/react";

import Icons, { addIcons, searchIcon } from "../src/media/icons";
import Image from "../src/media/image";
import SvgImports, { addSvgs } from "../src/media/svg-imports";
import Svg from "../src/media/svg";
import Video from "../src/media/video";
import YoutubeVideoComponent from "../src/media/youtube-video";

jest.mock("react-youtube", () => (props: any) => <div data-testid="youtube" {...props} />);

describe("media components", () => {
  it("renders fallback icon when name is missing", () => {
    const { container } = render(<Icons icon="unknown" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("src-error");
  });

  it("searches icons after adding them", () => {
    addIcons({ icons: [{ properties: { name: "extra" }, icon: {} as any }] });
    expect(searchIcon("extra")).toBe("extra");
  });

  it("renders responsive sources and wrapper classes in Image", () => {
    const { container } = render(
      <Image src={{ 768: "large.png", default: "small.png" }} alt="demo" />
    );
    expect(container.querySelector("figure")?.className).toContain("position-relative");
    expect(container.querySelectorAll("source").length).toBe(1);
  });

  it("renders registered SVGs and falls back to Icons", () => {
    const Dummy: React.FC = () => <svg data-testid="dummy" />;
    addSvgs({ Dummy });
    const { getByTestId, container } = render(
      <>
        <SvgImports svg="Dummy" name="dummy" />
        <SvgImports svg="Missing" name="missing" />
      </>
    );
    expect(getByTestId("dummy")).toBeInTheDocument();
    expect(container.querySelector(".src-error")).toBeTruthy();
  });

  it("renders SVG with use element", () => {
    const { container } = render(<Svg href="#icon" />);
    expect(container.querySelector("use")?.getAttribute("href")).toBe("#icon");
  });

  it("renders sources when no direct src in Video", () => {
    const { container } = render(<Video sources={[{ src: "a.mp4" }, { src: "b.mp4" }]} />);
    expect(container.querySelectorAll("source").length).toBe(2);
  });

  it("embeds YouTube video inside container", () => {
    const { getByTestId } = render(<YoutubeVideoComponent videoId="abc" name="vid" />);
    expect(getByTestId("youtube")).toBeInTheDocument();
  });
});

