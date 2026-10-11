const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");

async function createNotification({
  recipientUserId,
  type = "GENERAL",
  title,
  message,
  resourceType = "NONE",
  resourceId = "",
}) {
  try {
    const notification = await Notification.create({
      recipientUserId,
      type,
      title,
      message,
      resourceType,
      resourceId,
    });
    return notification;
  } catch (error) {
    console.error("[Notification Error]", error.message);
    return null;
  }
}

async function getUserNotifications(userId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ recipientUserId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ recipientUserId: userId }),
    Notification.countDocuments({ recipientUserId: userId, readAt: null }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      unreadCount,
    },
  };
}

async function markNotificationAsRead(userId, notificationId) {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipientUserId: userId,
  });

  if (!notification) {
    throw ApiError.notFound("Notification not found", "NOTIFICATION_NOT_FOUND");
  }

  notification.readAt = new Date();
  await notification.save();

  return notification;
}

async function markAllAsRead(userId) {
  await Notification.updateMany(
    { recipientUserId: userId, readAt: null },
    { $set: { readAt: new Date() } }
  );
  return { success: true };
}

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
};
