const express = require("express");
const router = express.Router();
const loansController = require("../controllers/loans.controller");
const authenticate = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");
const { loanDraftSchema } = require("../validators/loan.validator");
const { generalLimiter } = require("../middleware/rateLimiter");

router.use(generalLimiter);
router.use(authenticate);

router.post("/draft", validateRequest(loanDraftSchema), loansController.createDraft);
router.patch("/:loanId/draft", loansController.updateDraft);
router.get("/me", loansController.getMyLoans);
router.get("/:loanId", loansController.getById);
router.post("/:loanId/submit", loansController.submit);

module.exports = router;
