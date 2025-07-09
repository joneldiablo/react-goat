import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("swiper/react", () => ({
  Swiper: (p: any) => <div>{p.children}</div>,
  SwiperSlide: (p: any) => <div className="swiper-slide">{p.children}</div>,
}));
jest.mock("swiper/modules", () => ({ Autoplay: {} }));
jest.mock("@floating-ui/react", () => ({}));

import Goat from "../src/goat";

const mockMutations = jest.fn((name, data) => data);

describe("Goat Component", () => {
  it("should render simple text content correctly", () => {
    const goat = new Goat({}, mockMutations);
    const content = "Hello, World!";
    const builtContent = goat.buildContent(content);

    const { getByText } = render(<>{builtContent}</>);

    expect(getByText("Hello, World!")).toBeInTheDocument();
  });

  it("should render a dynamic component with content", () => {
    const goat = new Goat({}, mockMutations);
    const content = {
      name: "dynamic-component",
      component: "Component",
      content: "Dynamic Content"
    };

    const builtContent = goat.buildContent(content);

    const { getByText } = render(<>{builtContent}</>);

    expect(getByText("Dynamic Content")).toBeInTheDocument();
  });

  it("should wrap components inside a section by default", () => {
    const goat = new Goat({}, mockMutations);
    const content = {
      name: "wrapped-component",
      component: "Component",
      content: "Wrapped Content"
    };

    const builtContent = goat.buildContent(content);

    const { container } = render(<>{builtContent}</>);

    expect(container.querySelector("section")).toBeTruthy();
  });

  it("should exclude certain components from being wrapped", () => {
    const goat = new Goat({}, mockMutations);
    const content = {
      name: "NavLink",
      component: "NavLink",
      content: "Excluded Content"
    };

    const builtContent = goat.buildContent(content);

    const { getByText } = render(<MemoryRouter>{builtContent}</MemoryRouter>);
    expect(getByText("Excluded Content").closest("section")).toBeNull();
  });

  it("should apply mutations correctly", () => {
    const mockMutation = jest.fn((name, data) => ({
      ...data,
      style: { color: "red" }
    }));
    const goat = new Goat({}, mockMutation);
    const content = {
      name: "mutated-component",
      component: "Component",
      content: "Mutated Content"
    };

    const builtContent = goat.buildContent(content);

    const { getByText } = render(<>{builtContent}</>);
    expect(getByText("Mutated Content")).toBeInTheDocument();
  });
});
