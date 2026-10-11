const express = require("express");
const router = express.Router();
const bankerController = require("../controllers/banker.controller");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { ROLES } = require("../config/constants");
const { generalLimiter } = require("../middleware/rateLimiter");

router.use(generalLimiter);
router.use(authenticate);
router.use(requireRole(ROLES.BANKER, ROLES.MANAGER));

router.get("/customers", bankerController.getCustomers);
router.get("/customers/:accountNumber", bankerController.getCustomerByAccount);
router.get("/security-events", bankerController.getSecurityEvents);
router.get("/customers/:customerId/security-events", bankerController.getCustomerSecurityEvents);
router.post("/customers/:customerId/warnings", bankerController.issueWarning);
router.get("/operational-requests", bankerController.getOperationalRequests);
router.post("/operational-requests/:requestId/decision", bankerController.decideOperationalRequest);
router.post("/customers/:customerId/restrictions", bankerController.setRestriction);

module.exports = router;
