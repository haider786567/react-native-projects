import assert from "node:assert/strict";
import test from "node:test";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation.js";

test("normalizes email addresses", () => {
  const result = loginSchema.parse({ email: "  USER@Example.COM ", password: "password123" });
  assert.equal(result.email, "user@example.com");
});

test("rejects mismatched registration passwords", () => {
  const result = registerSchema.safeParse({
    name: "User",
    email: "user@example.com",
    password: "password123",
    confirmPassword: "different123",
  });
  assert.equal(result.success, false);
});

test("validates refresh and forgot-password requests", () => {
  assert.equal(refreshTokenSchema.safeParse({ refreshToken: "" }).success, false);
  assert.equal(forgotPasswordSchema.safeParse({ email: "invalid" }).success, false);
});

test("reset validation removes confirmPassword", () => {
  const token = "a".repeat(64);
  const result = resetPasswordSchema.parse({ token, password: "password123", confirmPassword: "password123" });
  assert.deepEqual(result, { token, password: "password123" });
});
