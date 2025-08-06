import React from "react";
import { render } from "@testing-library/react";
import useEventHandler from "../src/hooks/use-event-handler";

const subscribe = jest.fn();
const unsubscribe = jest.fn();
jest.mock("dbl-utils/event-handler", () => ({
  subscribe: (...args: any[]) => subscribe(...args),
  unsubscribe: (...args: any[]) => unsubscribe(...args),
  dispatch: jest.fn(),
}));

test("subscribes and unsubscribes events", () => {
  const events: [string, () => void][] = [["ready.test", () => {}]];
  const Test = () => {
    useEventHandler(events, "id1");
    return null;
  };
  const { unmount } = render(<Test />);
  expect(subscribe).toHaveBeenCalledWith("ready.test", events[0][1], "id1");
  unmount();
  expect(unsubscribe).toHaveBeenCalledWith("ready.test", "id1");
});
