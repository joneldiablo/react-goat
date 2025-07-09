import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";

import DndListContainer from "../../src/containers/dnd-list-container";

describe("DndListContainer", () => {
  test("reorders items on drag", () => {
    const handle = jest.fn();
    const ref = React.createRef<DndListContainer>();
    render(
      <DndListContainer name="dnd" onChange={handle} ref={ref}>
        <div>one</div>
        <div>two</div>
      </DndListContainer>
    );

    act(() => {
      ref.current!.onDragStart(0)({} as any);
    });
    act(() => {
      ref.current!.onDragOver(1)({ preventDefault: () => {} } as any);
    });
    act(() => {
      ref.current!.onDrop();
    });
    expect(handle).toHaveBeenCalled();
    const [first] = handle.mock.calls[0][0];
    expect((first as any).props.children).toBe("two");
  });
});
