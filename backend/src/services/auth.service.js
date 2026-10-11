const User = require("../models/User");
const Account = require("../models/Account");
const { hashPassword, verifyPassword } = require("../security/password");
const { generateToken } = require("../security/token");
const ApiError = require("../utils/ApiError");
const { ROLES, USER_STATUS } = require("../config/constants");
const { logAudit } = require("./audit.service");
const { createNotification } = require("./notification.service");

async function register({ fullName, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  // Check duplicate
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw ApiError.conflict("An account with this email address already exists", "EMAIL_EXISTS");
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
    role: ROLES.CUSTOMER,
    accountStatus: USER_STATUS.PENDING,
    maliciousAttemptCount: 0,
    warningCount: 0,
  });

  await logAudit({
    actorUserId: user._id,
    action: "USER_REGISTERED",
    resourceType: "USER",
    resourceId: user._id.toString(),
    metadata: { email: user.email },
  });

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
    },
    message: "Registration submitted successfully. Your account is pending manager approval.",
  };
}

async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
  }

  if (user.accountStatus === USER_STATUS.PENDING) {
    throw ApiError.forbidden(
      "Your registration is pending manager approval. Please check back soon.",
      "ACCOUNT_PENDING"
    );
  }

  if (user.accountStatus === USER_STATUS.BLOCKED) {
    throw ApiError.forbidden("Your account is blocked. Please contact bank administration.", "ACCOUNT_BLOCKED");
  }

  if (user.accountStatus === USER_STATUS.REJECTED) {
    throw ApiError.forbidden("Your registration application was rejected.", "ACCOUNT_REJECTED");
  }

  // Issue token
  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  await logAudit({
    actorUserId: user._id,
    action: "USER_LOGIN",
    resourceType: "USER",
    resourceId: user._id.toString(),
  });

  // Get associated primary account if active customer
  let account = null;
  if (user.role === ROLES.CUSTOMER) {
    account = await Account.findOne({ userId: user._id });
  }

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      maliciousAttemptCount: user.maliciousAttemptCount,
      warningCount: user.warningCount,
      accountNumber: account ? account.accountNumber : null,
    },
  };
}

async function getMe(user) {
  let account = null;
  if (user.role === ROLES.CUSTOMER) {
    account = await Account.findOne({ userId: user._id });
  }

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    accountStatus: user.accountStatus,
    maliciousAttemptCount: user.maliciousAttemptCount,
    warningCount: user.warningCount,
    account: account
      ? {
          accountNumber: account.accountNumber,
          balancePaise: account.balancePaise,
          balanceRupees: account.balancePaise / 100,
          currency: account.currency,
          status: account.status,
          accountType: account.accountType,
        }
      : null,
  };
}

module.exports = {
  register,
  login,
  getMe,
};
