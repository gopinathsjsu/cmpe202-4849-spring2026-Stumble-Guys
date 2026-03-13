import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * 12 rounds is a good balance between security and speed (~250 ms per hash).
 * Never go below 10 in production; never store or log the plain password.
 */
const SALT_ROUNDS = 12;

// ─── Password Helpers ─────────────────────────────────────────────────────────

/** Hash a plain-text password. Call this before saving to DB. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a stored hash.
 * Returns true if they match, false otherwise.
 * bcrypt.compare is timing-safe — always use it instead of ===.
 */
export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ─── JWT Helpers ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string;  // user id
  role: string;
}

/** Sign a short-lived access token (1 h). */
export function signToken(payload: JwtPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment");
  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

/** Verify and decode a token. Throws if invalid or expired. */
export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in environment");
  return jwt.verify(token, secret) as JwtPayload;
}
