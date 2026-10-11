const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notifications.controller");
const authenticate = require("../middleware/auth");
const { generalLimiter } = require("../middleware/rateLimiter");

router.use(generalLimiter);
router.use(authenticate);

router.get("/", notificationsController.getNotifications);
router.patch("/read-all", notificationsController.markAllAsRead);
router.patch("/:notificationId/read", notificationsController.markAsRead);

module.exports = router;
