const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, validateRequest(registerSchema), authController.register);
router.post("/login", authLimiter, validateRequest(loginSchema), authController.login);
router.get("/me", authenticate, authController.getMe);

module.exports = router;
