import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  ArrowRightLeft,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Info,
  Clock,
  Filter,
} from "lucide-react";
import { api } from "../services/api";
import { formatDate } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";

export const NotificationsPage: React.FC = () => {
  const { refreshNotifications } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "SECURITY" | "FINANCIAL">("ALL");
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications(1, 50);
      if (res && res.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Failed to load notifications" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await api.markNotificationAsRead(id);
      if (res) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        refreshNotifications();
      }
    } catch (err: any) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAll(true);
      const res = await api.markAllNotificationsAsRead();
      if (res) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setAlert({ type: "success", message: "All notifications marked as read." });
        refreshNotifications();
      }
    } catch (err: any) {
      setAlert({ type: "error", message: err.message || "Failed to mark all as read" });
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SECURITY_ALERT":
      case "FIREWALL_BLOCK":
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case "TRANSFER_PREPARED":
      case "TRANSFER_CONFIRMED":
      case "TRANSFER_EXECUTED":
      case "MONEY_RECEIVED":
        return <ArrowRightLeft className="w-5 h-5 text-emerald-400" />;
      case "LOAN_DECISION":
      case "LOAN_APPROVED":
        return <FileCheck className="w-5 h-5 text-purple-400" />;
      case "WARNING":
      case "RESTRICTION":
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    if (filter === "SECURITY")
      return (
        n.type?.includes("SECURITY") ||
        n.type?.includes("FIREWALL") ||
        n.type?.includes("WARNING") ||
        n.type?.includes("RESTRICTION")
      );
    if (filter === "FINANCIAL")
      return (
        n.type?.includes("TRANSFER") ||
        n.type?.includes("TRANSACTION") ||
        n.type?.includes("MONEY") ||
        n.type?.includes("LOAN")
      );
    return true;
  });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="teal">
                    {unreadCount} Unread
                  </Badge>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Security alerts, transaction receipts, loan updates, and system notices.
              </p>
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            className="flex items-center gap-2 border-teal-200 bg-white/80 text-teal-800 hover:bg-white shadow-sm"
          >
            <CheckCheck className="w-4 h-4 text-teal-600" />
            Mark All as Read
          </Button>
        )}
      </div>

      {alert && (
        <div className="mb-6">
          <Alert
            variant={alert.type === "success" ? "success" : "destructive"}
            onClose={() => setAlert(null)}
          >
            <div className="font-semibold">{alert.type === "success" ? "Updated" : "Error"}</div>
            <div>{alert.message}</div>
          </Alert>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-teal-200/60 pb-3 mb-6 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === "ALL"
              ? "bg-teal-600 text-white font-bold shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === "UNREAD"
              ? "bg-teal-600 text-white font-bold shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("FINANCIAL")}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === "FINANCIAL"
              ? "bg-teal-600 text-white font-bold shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Financial
        </button>
        <button
          onClick={() => setFilter("SECURITY")}
          className={`px-3.5 py-1.5 rounded-lg transition-all ${
            filter === "SECURITY"
              ? "bg-teal-600 text-white font-bold shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Security & Audits
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          Loading notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="p-12 text-center border-teal-200 bg-white/85 backdrop-blur-xl shadow-md">
          <Bell className="w-12 h-12 text-teal-300 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No Notifications</h3>
          <p className="text-xs text-slate-500">
            {filter === "UNREAD"
              ? "You're all caught up! No unread notifications."
              : "No notifications found in this category."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <motion.div
              key={notif._id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border transition-all ${
                notif.isRead
                  ? "border-teal-100 bg-white/80 hover:bg-white shadow-sm"
                  : "border-teal-300 bg-teal-50/80 hover:bg-teal-100/80 shadow-md shadow-teal-900/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-teal-50 border border-teal-200 shrink-0 text-teal-700">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-slate-900">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                      )}
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {notif.type || "INFO"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 font-mono">
                      <Clock className="w-3 h-3" />
                      {formatDate(notif.createdAt)}
                    </div>
                  </div>
                </div>

                {!notif.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(notif._id)}
                    className="text-xs text-teal-700 hover:text-teal-900 hover:bg-teal-100 shrink-0 font-medium"
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
