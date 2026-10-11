const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transactions.controller");
const authenticate = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const {
  prepareTransferSchema,
  confirmTransferSchema,
  operationalRequestSchema,
} = require("../validators/transaction.validator");
const { generalLimiter } = require("../middleware/rateLimiter");

router.use(generalLimiter);
router.use(authenticate);

router.post("/prepare", validateRequest(prepareTransferSchema), transactionsController.prepare);
router.post("/confirm", validateRequest(confirmTransferSchema), transactionsController.confirm);
router.get("/me", transactionsController.getMyTransactions);
router.post("/deposit-requests", validateRequest(operationalRequestSchema), transactionsController.createDepositRequest);
router.post("/withdrawal-requests", validateRequest(operationalRequestSchema), transactionsController.createWithdrawalRequest);
router.get("/requests/me", transactionsController.getMyOperationalRequests);
router.get("/:transactionId", transactionsController.getById);
router.post("/:transactionId/cancel", transactionsController.cancel);

module.exports = router;
