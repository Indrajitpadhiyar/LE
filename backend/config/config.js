import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'LuckyElectrical_FallbackSecret_2026',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@luckyelectrical.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  ADMIN_NAME: process.env.ADMIN_NAME || 'Admin',
};