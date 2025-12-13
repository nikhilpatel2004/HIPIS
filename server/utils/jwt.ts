import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }
  return secret;
}

export function generateToken(payload: TokenPayload): string {
  const secret = getSecret();
  return jwt.sign(payload, secret, {
    expiresIn: "1h",
    issuer: "hipis",
    audience: "hipis-app",
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = getSecret();
    return jwt.verify(token, secret, {
      issuer: "hipis",
      audience: "hipis-app",
    }) as TokenPayload;
  } catch (error) {
    return null;
  }
}
