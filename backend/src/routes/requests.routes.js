const express = require("express");
const router = express.Router();
const requestsController = require("../controllers/requests.controller");
const authenticate = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { moneyRequestSchema } = require("../validators/transaction.validator");
const { generalLimiter } = require("../middleware/rateLimiter");

router.use(generalLimiter);
router.use(authenticate);

router.post("/money", validateRequest(moneyRequestSchema), requestsController.create);
router.get("/money/me", requestsController.getMyRequests);
router.get("/money/:requestId", requestsController.getById);
router.post("/money/:requestId/respond", requestsController.respond);
router.post("/money/:requestId/cancel", requestsController.cancel);

module.exports = router;
