import { describe, expect, it } from "vitest";
import { readDefaultContextSelection, renderDefaultContextOptions } from "../src/options/default-context";

describe("default context selector", () => {
  it("renders options with selected shortcut", () => {
    const select = {
      value: "",
      innerHTML: "",
      append: () => undefined
    } as unknown as HTMLSelectElement;

    const globalWithDocument = globalThis as unknown as { document?: unknown };
    const originalDocument = globalWithDocument.document;
    globalWithDocument.document = {
      createElement: () => ({ value: "", textContent: "" })
    };

    try {
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
    } finally {
      globalWithDocument.document = originalDocument;
    }

    expect(select.value).toBe("a");
  });

  it("returns null when no value is selected", () => {
    const select = { value: "" } as unknown as HTMLSelectElement;
    select.value = "";
    expect(readDefaultContextSelection(select)).toBeNull();
  });
});
