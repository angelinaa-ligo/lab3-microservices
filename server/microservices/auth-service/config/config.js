import dotenv from 'dotenv';
dotenv.config();
export const config = {
  db: process.env.AUTH_MONGO_URI || 'mongodb://localhost:27017/lab3authDB',  
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',  
  port: process.env.AUTH_PORT || 4001,  
};

if (process.env.NODE_ENV !== 'production') {
  console.log(`🔐 JWT_SECRET in auth-service config: ${config.JWT_SECRET}`);
  console.log(`🚀 Auth Microservice running on port: ${config.port}`);
}