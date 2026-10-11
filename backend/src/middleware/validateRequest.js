const ApiError = require("../utils/ApiError");

function validateRequest(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!parsed.success) {
        const errorDetails = parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        return next(
          ApiError.badRequest("Invalid request data", "VALIDATION_ERROR", errorDetails)
        );
      }

      // update req with parsed/sanitized data if needed
      if (parsed.data.body) req.body = parsed.data.body;
      if (parsed.data.query) req.query = parsed.data.query;
      if (parsed.data.params) req.params = parsed.data.params;

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validateRequest;
