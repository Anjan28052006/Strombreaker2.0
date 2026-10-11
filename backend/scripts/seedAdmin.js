const { connectDB, disconnectDB } = require("../src/config/db");
const User = require("../src/models/User");
const { hashPassword } = require("../src/security/password");
const { ROLES, USER_STATUS } = require("../src/config/constants");

async function seedAdmin() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "manager@bankism.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Manager@1234";

  let admin = await User.findOne({ email: adminEmail });
  if (admin) {
    console.log(`[Seed Admin] Manager with email ${adminEmail} already exists.`);
  } else {
    const passwordHash = await hashPassword(adminPassword);
    admin = await User.create({
      fullName: "Chief Risk Manager",
      email: adminEmail,
      passwordHash,
      role: ROLES.MANAGER,
      accountStatus: USER_STATUS.ACTIVE,
    });
    console.log(`[Seed Admin] Created default manager: ${adminEmail}`);
  }

  await disconnectDB();
}

seedAdmin().catch((err) => {
  console.error("[Seed Admin Error]", err.message);
  process.exit(1);
});
