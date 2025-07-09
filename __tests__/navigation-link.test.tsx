import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Link from "../src/navigation/react-router-link";
import NavLink from "../src/navigation/react-router-navlink";

describe("Navigation components", () => {
  test("Link forwards props", () => {
    const { container } = render(
      <MemoryRouter>
        <Link name="l1" to="/test">go</Link>
      </MemoryRouter>
    );
    const a = container.querySelector("a");
    expect(a).toHaveAttribute("href", "/test");
  });

  test("NavLink forwards props and aria-current", () => {
    const { container } = render(
      <MemoryRouter>
        <NavLink name="n1" to="/" ariaCurrent="page" end>
          home
        </NavLink>
      </MemoryRouter>
    );
    const a = container.querySelector("a");
    expect(a).toHaveAttribute("aria-current", "page");
  });
});
