const express = require("express");
const router = express.Router();
const accountsController = require("../controllers/accounts.controller");
const authenticate = require("../middleware/auth");
const { generalLimiter } = require("../middleware/rateLimiter");

router.use(generalLimiter);
router.use(authenticate);

router.get("/me", accountsController.getMyAccount);
router.get("/me/balance", accountsController.getMyBalance);
router.get("/me/transactions", accountsController.getMyTransactions);

module.exports = router;
