const { verifyToken } = require("../security/token");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const { USER_STATUS } = require("../config/constants");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(ApiError.unauthorized("Authorization token missing or malformed", "AUTH_TOKEN_MISSING"));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return next(ApiError.unauthorized("Invalid or expired authentication token", "AUTH_TOKEN_INVALID"));
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(ApiError.unauthorized("User account no longer exists", "AUTH_USER_NOT_FOUND"));
    }

    if (user.accountStatus === USER_STATUS.BLOCKED) {
      return next(ApiError.forbidden("Account has been blocked. Please contact support.", "ACCOUNT_BLOCKED"));
    }

    if (user.accountStatus === USER_STATUS.REJECTED) {
      return next(ApiError.forbidden("Account application was rejected.", "ACCOUNT_REJECTED"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(ApiError.unauthorized("Authentication failed", "AUTH_FAILED"));
  }
}

module.exports = authenticate;
