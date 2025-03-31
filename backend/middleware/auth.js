const jwt = require("jsonwebtoken");

// checks if the request has a valid JWT token in header.
module.exports = (req, res, next) => {
  // retrive token from the header
  const token = req.headers.authorization?.split(" ")[1];
  // if token is not present, return 401 Unauthorized
  if (!token) return res.sendStatus(401);

  try {
    // check if the token is still valid and correct jwt secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user information to the request object, to used in subsequent middleware or route handlers
    req.user = decoded;
    // move on to the protected route 
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(403).json({ error: "Invalid token" });
  }
};

