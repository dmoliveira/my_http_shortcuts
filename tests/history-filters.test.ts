import { describe, expect, it } from "vitest";
import { DEFAULT_HISTORY_FILTERS, readHistoryFilters, resetHistoryFilters } from "../src/options/history-filters";

function makeSelect(value: string): HTMLSelectElement {
  return { value, innerHTML: "", append: () => undefined } as unknown as HTMLSelectElement;
}

function makeInput(value: string): HTMLInputElement {
  return { value } as unknown as HTMLInputElement;
}

describe("history filters", () => {
  it("reads current filter values", () => {
    const source = makeSelect("popup");

    const result = makeSelect("error");

    const query = makeInput("abc");

    const sort = makeSelect("slowest");

    const maxItems = makeSelect("10");

    const minDurationMs = makeInput("25");

    const values = readHistoryFilters({ source, result, query, sort, maxItems, minDurationMs });
    expect(values).toEqual({
      source: "popup",
      result: "error",
      query: "abc",
      sort: "slowest",
      maxItems: 10,
      minDurationMs: 25
    });
  });

  it("falls back to defaults for invalid numeric values", () => {
    const source = makeSelect("all");

    const result = makeSelect("all");

    const query = makeInput("");

    const sort = makeSelect("newest");

    const maxItems = makeSelect("-2");

    const minDurationMs = makeInput("bad");

    const values = readHistoryFilters({ source, result, query, sort, maxItems, minDurationMs });
    expect(values.maxItems).toBe(Number(DEFAULT_HISTORY_FILTERS.maxItems));
    expect(values.minDurationMs).toBe(Number(DEFAULT_HISTORY_FILTERS.minDurationMs));
  });

  it("resets controls to defaults", () => {
    const source = makeSelect("popup");

    const result = makeSelect("error");

    const query = makeInput("x");

    const sort = makeSelect("slowest");

    const maxItems = makeSelect("50");

    const minDurationMs = makeInput("100");

    resetHistoryFilters({ source, result, query, sort, maxItems, minDurationMs });

    expect(source.value).toBe(DEFAULT_HISTORY_FILTERS.source);
    expect(result.value).toBe(DEFAULT_HISTORY_FILTERS.result);
    expect(query.value).toBe(DEFAULT_HISTORY_FILTERS.query);
    expect(sort.value).toBe(DEFAULT_HISTORY_FILTERS.sort);
    expect(maxItems.value).toBe(DEFAULT_HISTORY_FILTERS.maxItems);
    expect(minDurationMs.value).toBe(DEFAULT_HISTORY_FILTERS.minDurationMs);
  });
});
