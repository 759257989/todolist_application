const jwt = require("jsonwebtoken");

/**
 * JWT Authentication Middleware
 * This middleware checks for the presence of a valid JWT token in the Authorization header.
 * If the token is valid, it attaches the decoded user payload to `req.user` and allows the request to proceed. If invalid or missing, it returns a 401 or 403 error response.
 * 
 * Expected Authorization header format:
 * Authorization: Bearer <token>
 * @param {*} req Express request object
 * @param {*} res Express response object
 * @param {*} next Callback to pass control to the next middleware
 * @returns Sends error response or calls next()
 */
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

