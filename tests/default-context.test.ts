import { describe, expect, it } from "vitest";
import { readDefaultContextSelection, renderDefaultContextOptions } from "../src/options/default-context";

describe("default context selector", () => {
  it("renders options with selected shortcut", () => {
    const select = document.createElement("select");
    renderDefaultContextOptions(
      select,
      [
        {
          id: "a",
          name: "A",
          method: "GET",
          url: "https://example.com",
          headers: {},
          bodyTemplate: "",
          preScript: "",
          postScript: ""
        }
      ],
      "a"
    );

    expect(select.value).toBe("a");
  });

  it("returns null when no value is selected", () => {
    const select = document.createElement("select");
    select.value = "";
    expect(readDefaultContextSelection(select)).toBeNull();
  });
});
