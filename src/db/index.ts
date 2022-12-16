import { Dialect, Sequelize } from "sequelize";

let sequelize: Sequelize;

const initSequelize = (): Sequelize => {

  if (sequelize) {
    return sequelize;
  }

  sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    dialect: process.env.DB_DIALECT as Dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.ENVIRONMENT === 'DEVELOPMENT'
  });

  return sequelize;
}

export const db = {
  initSequelize
}

