const express = require("express");
const cors = require("cors");
const { PORT, NODE_ENV } = require("./src/config/env");
const { connectDB } = require("./src/config/db");
const corsOptions = require("./src/config/cors");
const errorHandler = require("./src/middleware/errorHandler");
const notFound = require("./src/middleware/notFound");
const { startExpireTransactionsJob } = require("./src/jobs/expireTransactions");
const { startExpireMoneyRequestsJob } = require("./src/jobs/expireMoneyRequests");


const authRoutes = require("./src/routes/auth.routes");
const accountsRoutes = require("./src/routes/accounts.routes");
const transactionsRoutes = require("./src/routes/transactions.routes");
const requestsRoutes = require("./src/routes/requests.routes");
const loansRoutes = require("./src/routes/loans.routes");
const firewallRoutes = require("./src/routes/firewall.routes");
const chatRoutes = require("./src/routes/chat.routes");
const bankerRoutes = require("./src/routes/banker.routes");
const managerRoutes = require("./src/routes/manager.routes");
const notificationsRoutes = require("./src/routes/notifications.routes");

const app = express();

// Security and middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    application: "BANKISM",
    version: "1.0.0",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Mount API v1 routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accountsRoutes);
app.use("/api/v1/transactions", transactionsRoutes);
app.use("/api/v1/requests", requestsRoutes);
app.use("/api/v1/loans", loansRoutes);
app.use("/api/v1/firewall", firewallRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/banker", bankerRoutes);
app.use("/api/v1/manager", managerRoutes);
app.use("/api/v1/notifications", notificationsRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Server bootstrap
let server = null;
if (NODE_ENV !== "test") {
  connectDB()
    .then(() => {
      server = app.listen(PORT, () => {
        console.log(`[BANKISM Server] Running on http://localhost:${PORT} in ${NODE_ENV} mode`);
        startExpireTransactionsJob();
        startExpireMoneyRequestsJob();
      });
    })
    .catch((err) => {
      console.error("[BANKISM Server] Startup error:", err.message);
      process.exit(1);
    });
}

module.exports = app;
