import { describe, expect, it } from "vitest";
import { requireElement } from "../src/utils/dom/required-element";

describe("requireElement", () => {
  it("returns element when present", () => {
    const fake = { id: "status", textContent: "" } as unknown as HTMLElement;
    const originalDocument = globalThis.document;
    const globalWithDocument = globalThis as unknown as {
      document?: { getElementById: (id: string) => HTMLElement | null };
    };
    globalWithDocument.document = {
      getElementById: (id: string) => (id === "status" ? fake : null)
    };

    try {
      expect(requireElement<HTMLElement>("status")).toBe(fake);
    } finally {
      (globalThis as unknown as { document?: unknown }).document = originalDocument;
    }
  });

  it("throws when missing", () => {
    const originalDocument = globalThis.document;
    const globalWithDocument = globalThis as unknown as {
      document?: { getElementById: (_id: string) => null };
    };
    globalWithDocument.document = {
      getElementById: () => null
    };

    try {
      expect(() => requireElement<HTMLElement>("missing")).toThrowError("Missing required element: #missing");
    } finally {
      (globalThis as unknown as { document?: unknown }).document = originalDocument;
    }
  });
});
