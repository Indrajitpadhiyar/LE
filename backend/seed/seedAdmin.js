import mongoose from "mongoose";
import dns from "dns";
import { config } from "../config/config.js";
import User from "../model/User.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ═══════════════════════════════════════════════
//  CONFIGURE YOUR ADMIN CREDENTIALS HERE
// ═══════════════════════════════════════════════
const ADMIN_NAME = config.ADMIN_NAME;
const ADMIN_EMAIL = config.ADMIN_EMAIL;
const ADMIN_PASSWORD = config.ADMIN_PASSWORD;
// ═══════════════════════════════════════════════

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`⚠️  Admin with email "${ADMIN_EMAIL}" already exists.`);
      console.log(`   Role: ${existingAdmin.role}`);

      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log(`✅ Updated role to "admin".`);
      }
    } else {
      const admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(`✅ Admin user created successfully!`);
      console.log(`   Name:  ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role:  ${admin.role}`);
    }

    console.log("\n🔐 Admin Credentials:");
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log("\n⚠️  Change the password after first login!");

    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();
