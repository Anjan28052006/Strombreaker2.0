const express = require("express");
const router = express.Router();
const firewallController = require("../controllers/firewall.controller");
const validateRequest = require("../middleware/validateRequest");
const { firewallCheckSchema } = require("../validators/firewall.validator");
const { generalLimiter } = require("../middleware/rateLimiter");
const { verifyToken } = require("../security/token");
const User = require("../models/User");

// Optional auth helper for firewall check
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const decoded = verifyToken(authHeader.split(" ")[1]);
      if (decoded && decoded.userId) {
        req.user = await User.findById(decoded.userId);
      }
    } catch (_) {}
  }
  next();
}

router.post("/check", generalLimiter, optionalAuth, validateRequest(firewallCheckSchema), firewallController.check);

module.exports = router;
