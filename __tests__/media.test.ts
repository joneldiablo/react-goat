import MEDIA_COMPONENTS, { addMediaComponents } from "../src/media";
import { addComponents } from "../src/components";

jest.mock("../src/components", () => ({
  addComponents: jest.fn(),
}));

describe("media module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete (MEDIA_COMPONENTS as any).Extra;
  });

  it("exposes default media components", () => {
    expect(MEDIA_COMPONENTS).toEqual(
      expect.objectContaining({
        Icons: expect.any(Function),
        Image: expect.any(Function),
        Svg: expect.any(Function),
        SvgImports: expect.any(Function),
        Video: expect.any(Function),
      })
    );
  });

  it("adds new media components and registers them", () => {
    const Extra = () => null;
    addMediaComponents({ Extra });
    expect(MEDIA_COMPONENTS.Extra).toBe(Extra);
    expect(addComponents).toHaveBeenCalledWith({ Extra });
  });
});

