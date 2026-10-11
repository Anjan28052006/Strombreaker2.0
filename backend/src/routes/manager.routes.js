const express = require("express");
const router = express.Router();
const managerController = require("../controllers/manager.controller");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../config/constants");
const { generalLimiter } = require("../middleware/rateLimiter");

router.use(generalLimiter);
router.use(authenticate);
router.use(requireRole(ROLES.MANAGER));

router.get("/registrations", managerController.getRegistrations);
router.post("/registrations/:userId/decision", managerController.decideRegistration);
router.get("/loans", managerController.getLoans);
router.post("/loans/:loanId/decision", managerController.decideLoan);
router.get("/users", managerController.getUsers);
router.get("/bankers", managerController.getBankers);
router.get("/security-events", managerController.getSecurityEvents);

module.exports = router;
