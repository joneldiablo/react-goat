import { AppGoatController } from "../src/app-controller";

jest.mock("dbl-utils/event-handler", () => ({
  dispatch: jest.fn(),
}));

jest.mock("url-join", () => ({
  __esModule: true,
  default: (...args: string[]) => args.join("/"),
}));

const controller = new AppGoatController();

test("stores and retrieves values", () => {
  controller.set("foo", "bar", { storage: null });
  expect(controller.get("foo")).toBe("bar");
});

test("removes stored values", () => {
  controller.set("baz", 1, { storage: null });
  controller.remove("baz", { storage: null });
  expect(controller.get("baz")).toBeUndefined();
});

