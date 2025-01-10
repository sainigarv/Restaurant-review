const jwt = require('jsonwebtoken')

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["token"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN format

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

module.exports = authenticateToken