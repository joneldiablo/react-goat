import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { eventHandler } from "dbl-utils";

import Component from "../src/component";

// 🔹 Mock de eventHandler.dispatch
jest.mock("dbl-utils", () => ({
  eventHandler: {
    dispatch: jest.fn(), // Mockea el método dispatch
    subscribe: jest.fn() // Mockea subscribe en caso de ser necesario
  },
}));

describe("Component", () => {
  test("renders with default props", () => {
    render(<Component name="test-component" />);
    const div = document.querySelector("body>div>div");
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('test-component-Component');
  });

  test("renders without tag", () => {
    render(<Component name="test-component" tag={false}>hello-test</Component>);
    const div = document.querySelector("body>div");
    expect(div).toHaveTextContent('hello-test');
  });

  test("applies additional class names", () => {
    render(<Component name="test-component" classes="extra-class" />);
    const div = document.querySelector(".test-component-Component");
    expect(div).toHaveClass("extra-class");
  });

  test("renders children correctly", () => {
    render(<Component name="test-component">Hello World</Component>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  test("does not render when active is false", () => {
    render(<Component name="test-component" active={false} />);
    expect(screen.queryByText("test-component-Component")).not.toBeInTheDocument();
  });

  test("handles event dispatch on click", () => {
    let eventTriggered = false;


    render(<Component name="test-component" />);
    const div = document.querySelector(".test-component-Component");

    fireEvent.click(div!);


    // 🔹 Verificar que eventHandler.dispatch fue llamado con el evento correcto
    expect(eventHandler.dispatch).toHaveBeenCalledWith(
      "click.test-component",
      expect.any(Object) // Puedes validar los datos enviados si es necesario
    );

    // 🔹 Verificar que dispatch fue llamado al menos una vez
    expect(eventHandler.dispatch).toHaveBeenCalledTimes(1);
  });
});
