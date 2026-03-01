import { describe, expect, it } from "vitest";
import { DEFAULT_HISTORY_FILTERS, readHistoryFilters, resetHistoryFilters } from "../src/options/history-filters";

describe("history filters", () => {
  it("reads current filter values", () => {
    const source = document.createElement("select");
    source.innerHTML = '<option value="popup">Popup</option>';
    source.value = "popup";

    const result = document.createElement("select");
    result.innerHTML = '<option value="error">Error</option>';
    result.value = "error";

    const query = document.createElement("input");
    query.value = "abc";

    const sort = document.createElement("select");
    sort.innerHTML = '<option value="slowest">Slowest</option>';
    sort.value = "slowest";

    const maxItems = document.createElement("select");
    maxItems.innerHTML = '<option value="10">10</option>';
    maxItems.value = "10";

    const minDurationMs = document.createElement("input");
    minDurationMs.value = "25";

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
    const source = document.createElement("select");
    source.innerHTML = '<option value="all">All</option>';
    source.value = "all";

    const result = document.createElement("select");
    result.innerHTML = '<option value="all">All</option>';
    result.value = "all";

    const query = document.createElement("input");
    query.value = "";

    const sort = document.createElement("select");
    sort.innerHTML = '<option value="newest">Newest</option>';
    sort.value = "newest";

    const maxItems = document.createElement("select");
    maxItems.innerHTML = '<option value="20">20</option>';
    maxItems.value = "-2";

    const minDurationMs = document.createElement("input");
    minDurationMs.value = "bad";

    const values = readHistoryFilters({ source, result, query, sort, maxItems, minDurationMs });
    expect(values.maxItems).toBe(Number(DEFAULT_HISTORY_FILTERS.maxItems));
    expect(values.minDurationMs).toBe(Number(DEFAULT_HISTORY_FILTERS.minDurationMs));
  });

  it("resets controls to defaults", () => {
    const source = document.createElement("select");
    source.innerHTML = '<option value="all">All</option>';
    source.value = "popup";

    const result = document.createElement("select");
    result.innerHTML = '<option value="all">All</option>';
    result.value = "error";

    const query = document.createElement("input");
    query.value = "x";

    const sort = document.createElement("select");
    sort.innerHTML = '<option value="newest">Newest</option>';
    sort.value = "slowest";

    const maxItems = document.createElement("select");
    maxItems.innerHTML = '<option value="20">20</option>';
    maxItems.value = "50";

    const minDurationMs = document.createElement("input");
    minDurationMs.value = "100";

    resetHistoryFilters({ source, result, query, sort, maxItems, minDurationMs });

    expect(source.value).toBe(DEFAULT_HISTORY_FILTERS.source);
    expect(result.value).toBe(DEFAULT_HISTORY_FILTERS.result);
    expect(query.value).toBe(DEFAULT_HISTORY_FILTERS.query);
    expect(sort.value).toBe(DEFAULT_HISTORY_FILTERS.sort);
    expect(maxItems.value).toBe(DEFAULT_HISTORY_FILTERS.maxItems);
    expect(minDurationMs.value).toBe(DEFAULT_HISTORY_FILTERS.minDurationMs);
  });
});
