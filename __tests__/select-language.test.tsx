import { fireEvent, render } from "@testing-library/react";
import SelectLanguage from "../src/i18n/select-language";

describe("SelectLanguage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("dispatches translate event and stores language", () => {
    const handler = jest.fn();
    document.addEventListener("translate", handler);
    const { getByRole } = render(<SelectLanguage />);
    fireEvent.change(getByRole("combobox"), { target: { value: "en_US" } });
    expect(localStorage.getItem("lang")).toBe("en_US");
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ detail: "en_US" }));
    document.removeEventListener("translate", handler);
  });
});
