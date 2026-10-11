const ApiError = require("../utils/ApiError");

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Authentication required", "AUTH_REQUIRED"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access restricted: requires one of [${allowedRoles.join(", ")}] roles`,
          "ROLE_UNAUTHORIZED"
        )
      );
    }

    next();
  };
}

module.exports = requireRole;
