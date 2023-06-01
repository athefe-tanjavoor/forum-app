import { config } from "dotenv";
config();
console.log(`\u001b[35m\u{1F4E6} \u001b[0m\u001b[1mEnv loaded\u001b[0m`);
export default {
  allowedOrigins: ["http://localhost:5500"],
  PORT: Number(process.env.PORT),
  DB_URI: process.env.DB_URI as string,
  GMAIL_EMAIL: process.env.GMAIL_EMAIL as string,
  GMAIL_PASS: process.env.GMAIL_PASS as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
  PUBLIC_URL: process.env.PUBLIC_URL as string,
  NODE_ENV: process.env.NODE_ENV as string,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as string,
  REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY as string,
  COOKIE_SECRET: process.env.COOKIE_SECRET as string,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  session_expiry: process.env.session_expiry as string,
  PREFIX: "/api",
};
