const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ message: "No token, access denied" });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1]; // "Bearer TOKEN"

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Normalize and attach user identity to request
    const userId = decoded.userId || decoded._id || decoded.id;
    if (!userId) {
      return res.status(401).send({ message: "Invalid token payload" });
    }

    req.userId = userId;
    req.user = decoded;

    // 5. Continue
    next();

  } catch (err) {
    res.status(401).send({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;