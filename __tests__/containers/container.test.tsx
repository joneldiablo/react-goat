import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import Container from "../../src/containers/container";

function setup(props: any = {}) {
  const ref = React.createRef<Container>();
  render(<Container name="test" ref={ref} {...props}>content</Container>);
  return ref;
}

describe("Container", () => {
  test("applies container-fluid by default", async () => {
    const ref = setup();
    act(() => {
      ref.current!.onResize({ width: 800, height: 600 });
    });
    await waitFor(() => {
      const div = (ref.current as any).ref.current as HTMLElement;
      expect(div.className).toContain("container-fluid");
    });
  });

  test("applies container when fluid is false", async () => {
    const ref = setup({ fluid: false });
    act(() => {
      ref.current!.onResize({ width: 800, height: 600 });
    });
    await waitFor(() => {
      const div = (ref.current as any).ref.current as HTMLElement;
      expect(div.className).toContain("container");
    });
  });

  test("no container classes when fullWidth", async () => {
    const ref = setup({ fullWidth: true });
    act(() => {
      ref.current!.onResize({ width: 800, height: 600 });
    });
    await waitFor(() => {
      const div = (ref.current as any).ref.current as HTMLElement;
      expect(div.className).not.toContain("container");
      expect(div.className).not.toContain("container-fluid");
    });
  });
});
