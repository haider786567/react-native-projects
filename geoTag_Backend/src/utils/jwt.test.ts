import assert from "node:assert/strict";
import test from "node:test";
import { genrateAccessToken, genrateRefreshToken, verifyAccessToken, verifyRefreshToken } from "./jwt.js";

process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-long-enough";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-that-is-long-enough";

const payload = { id: "user-id", email: "user@example.com" };

test("creates and verifies access tokens", () => {
  const decoded = verifyAccessToken(genrateAccessToken(payload));
  assert.equal(typeof decoded, "object");
  if (typeof decoded !== "string") assert.equal(decoded.id, payload.id);
});

test("creates and verifies refresh tokens", () => {
  const decoded = verifyRefreshToken(genrateRefreshToken(payload));
  assert.equal(decoded.email, payload.email);
});

test("rejects a token signed with the wrong secret", () => {
  const token = genrateAccessToken(payload);
  process.env.JWT_ACCESS_SECRET = "a-different-test-access-secret";
  assert.throws(() => verifyAccessToken(token));
  process.env.JWT_ACCESS_SECRET = "test-access-secret-that-is-long-enough";
});
