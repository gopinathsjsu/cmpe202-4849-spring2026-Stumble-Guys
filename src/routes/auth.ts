import { Router, Request, Response } from "express";
import { z } from "zod";
import { PrismaClient, Prisma } from "../generated/prisma";
import { hashPassword, verifyPassword, signToken } from "../lib/auth";

const router = Router();
const prisma = new PrismaClient();

// ─── Validation Schemas (Zod) ─────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"), // bcrypt limit
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────

router.post("/register", async (req: Request, res: Response) => {
  // 1. Validate request body
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, email, password } = parsed.data;

  try {
    // 2. Hash password before touching the DB
    const passwordHash = await hashPassword(password);

    // 3. Create user — Prisma enforces the unique email constraint
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    // Prisma unique constraint violation (P2002)
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({ error: "Email already in use" });
    }

    console.error("[register]", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

router.post("/login", async (req: Request, res: Response) => {
  // 1. Validate request body
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsed.data;

  try {
    // 2. Look up the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    // 3. Use a constant-time comparison — never reveal whether email exists
    const passwordOk =
      user !== null && (await verifyPassword(password, user.passwordHash));

    if (!user || !passwordOk) {
      // Intentionally vague: don't leak whether the email exists
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 4. Issue JWT
    const token = signToken({ sub: user.id, role: user.role });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("[login]", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
