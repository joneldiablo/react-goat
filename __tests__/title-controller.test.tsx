import React from "react";
import { render, screen, act } from "@testing-library/react";

jest.mock("dbl-utils/event-handler", () => ({
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  dispatch: jest.fn(),
}));

import TitleController from "../src/controllers/title-controller";

test("renders heading and children", () => {
  const ref = React.createRef<TitleController>();
  render(
    <TitleController
      name="title"
      label="Hello"
      labelClasses="cls"
      view={{ component: "Component", name: "content", content: "" }}
      ref={ref}
    >
      Body
    </TitleController>
  );
  act(() => {
    (ref.current as any).onResize({ width: 800, height: 600 });
  });
  expect(screen.getByRole("heading", { level: 1 })).toHaveClass("cls");
  expect(screen.getByText("Body")).toBeInTheDocument();
});
