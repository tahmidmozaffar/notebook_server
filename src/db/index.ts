import dbConfig from "../config/db.config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(dbConfig.DB!, dbConfig.USER!, dbConfig.PASSWORD!, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  logging: process.env.ENVIRONMENT === 'DEVELOPMENT'
});
