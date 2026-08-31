import { describe, expect, it } from "vitest";
import { isValidJwt, isValidSession } from "../proxy";

function createMockJwt(
  payload: Record<string, unknown>,
  header: Record<string, unknown> = { alg: "HS256", typ: "JWT" }
): string {
  const enc = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  return `${enc(header)}.${enc(payload)}.mock_signature_bytes_12345`;
}

describe("Edge Auth Proxy Validation Tests", () => {
  describe("isValidJwt", () => {
    it("accepts valid, unexpired JWT token with userId claim", () => {
      const token = createMockJwt({
        userId: "usr_123",
        role: "OWNER",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      });

      expect(isValidJwt(token)).toBe(true);
    });

    it("rejects expired JWT token", () => {
      const expiredToken = createMockJwt({
        userId: "usr_123",
        exp: Math.floor(Date.now() / 1000) - 100, // expired 100 seconds ago
      });

      expect(isValidJwt(expiredToken)).toBe(false);
    });

    it("rejects JWT without user identifier claim", () => {
      const invalidToken = createMockJwt({
        role: "OWNER",
        exp: Math.floor(Date.now() / 1000) + 3600,
      });

      expect(isValidJwt(invalidToken)).toBe(false);
    });

    it("rejects malformed token strings", () => {
      expect(isValidJwt("not.a.valid.jwt.token")).toBe(false);
      expect(isValidJwt("random_garbage_string")).toBe(false);
      expect(isValidJwt("")).toBe(false);
      expect(isValidJwt(undefined)).toBe(false);
    });
  });

  describe("isValidSession", () => {
    it("validates session JSON cookie with valid id and email", () => {
      const sessionJson = JSON.stringify({
        id: "usr_123",
        name: "Claire Bennett",
        email: "claire@atelierforma.com",
        role: "OWNER",
      });

      expect(isValidSession(encodeURIComponent(sessionJson))).toBe(true);
    });

    it("rejects empty or malformed session cookie", () => {
      expect(isValidSession("")).toBe(false);
      expect(isValidSession("{invalid_json")).toBe(false);
      expect(isValidSession(encodeURIComponent(JSON.stringify({ id: "" })))).toBe(false);
    });
  });
});
