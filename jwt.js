import jwt from "jsonwebtoken"; // Importing jsonwebtoken for JWT operations

// Generate generic token
const generateToken = async ({ payload, secret, expiresIn }) => {
  if (!secret) throw new Error("JWT secret missing");

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) return reject(new Error("Failed to generate token"));
      resolve(token);
    });
  });
};

// Verify generic token
const verifyToken = async ({ token, secret }) => {
  if (!secret) throw new Error("JWT secret missing");

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(new Error("Invalid or expired token"));
      resolve(decoded);
    });
  });
};

// Generate both tokens together
const generateAuthTokens = async ({ payload }) => {
  const accessToken = await generateToken({
    payload,
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

  const refreshToken = await generateToken({
    payload,
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

  return { accessToken, refreshToken };
};

export { generateToken, verifyToken, generateAuthTokens };
