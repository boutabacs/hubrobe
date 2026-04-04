const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        console.error("JWT Verify Error:", err.message);
        return res.status(403).json(`Token is not valid: ${err.message}`);
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    const paramId = req.params.id ?? req.params.userId;
    if (String(req.user.id) === String(paramId) || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that (Auth/Admin check failed)!");
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json(`You are not allowed to do that (isAdmin is ${req.user.isAdmin})!`);
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
