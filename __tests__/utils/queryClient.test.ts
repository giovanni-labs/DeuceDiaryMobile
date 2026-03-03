import { queryClient } from "../../lib/queryClient";

describe("queryClient", () => {
  it("is a QueryClient instance", () => {
    expect(queryClient).toBeDefined();
    expect(queryClient.getDefaultOptions).toBeDefined();
  });

  it("has 5-minute stale time default", () => {
    const opts = queryClient.getDefaultOptions();
    expect(opts.queries?.staleTime).toBe(1000 * 60 * 5);
  });

  it("retries 2 times by default", () => {
    const opts = queryClient.getDefaultOptions();
    expect(opts.queries?.retry).toBe(2);
  });
});
