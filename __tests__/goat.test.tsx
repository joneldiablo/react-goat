import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("dbl-utils/object-mutation", () => ({ deepMerge: (t: any, ...s: any[]) => Object.assign(t, ...s) }));
jest.mock("dbl-utils/i18n", () => ({ __esModule: true, default: (s: string) => s }));
jest.mock("dbl-utils/format-value", () => ({ __esModule: true, default: (v: any) => v }));
jest.mock("dbl-utils/utils", () => ({ hash: (s: string) => s }));

import Goat, { addWrapperExclusions } from "../src/goat";

function buildSection(name: string, content: string) {
  const goat = new Goat({ name: "root" });
  return goat.buildContent({ name, component: "Component", content });
}

test("wraps sections by default", () => {
  const node = buildSection("a", "Hello");
  render(<>{node}</>);
  const text = screen.getByText("Hello");
  expect(text.parentElement?.tagName).toBe("SECTION");
});

test("allows excluding components from wrapper", () => {
  addWrapperExclusions("Component");
  const node = buildSection("b", "Hi");
  render(<>{node}</>);
  const text = screen.getByText("Hi");
  expect(text.parentElement?.tagName).not.toBe("SECTION");
});

