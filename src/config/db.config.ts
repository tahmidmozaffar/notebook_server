import fs from "fs";

const env = process.env.ENVIRONMENT!;

let config;
try {  
  const jsonString = fs.readFileSync("src/config/db_config.json");
  config = JSON.parse(jsonString.toString());
} catch (err) {
  console.log(err);
}

export default {
  HOST: config[env].host,
  USER: config[env].user,
  PASSWORD: config[env].password,
  DB: config[env].database,
  PORT: config[env].port,
  dialect: config[env].dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
