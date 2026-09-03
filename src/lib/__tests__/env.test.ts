import { describe, expect, it } from "vitest";
import { env } from "../env";

describe("Environment Configuration (env)", () => {
  it("should provide a valid API_BASE_URL with protocol", () => {
    expect(env.API_BASE_URL).toBeDefined();
    expect(env.API_BASE_URL).toMatch(/^https?:\/\//);
  });

  it("should provide a valid APP_URL with protocol", () => {
    expect(env.APP_URL).toBeDefined();
    expect(env.APP_URL).toMatch(/^https?:\/\//);
  });

  it("should export standard default client configuration", () => {
    expect(env.NEXT_PUBLIC_APP_NAME).toBe("Shopwus");
    expect(env.NEXT_PUBLIC_SITE_DOMAIN).toBe("shopwus.com");
    expect(typeof env.NEXT_PUBLIC_USE_MOCK_API).toBe("boolean");
  });
});
