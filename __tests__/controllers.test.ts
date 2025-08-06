import controllers, { addControllers } from "../src/controllers";
import Controller from "../src/controllers/controller";

describe("controllers registry", () => {
  afterEach(() => {
    delete (controllers as any).Custom;
  });

  test("exposes default controllers", () => {
    expect(controllers.Controller).toBe(Controller);
  });

  test("allows adding controllers", () => {
    class Custom extends Controller {}
    addControllers({ Custom });
    expect(controllers.Custom).toBe(Custom);
  });
});
