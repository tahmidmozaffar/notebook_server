import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../db';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id?: number;
  declare name: string;
  declare username: string;
  declare password: string; 
  declare email?: string;
};

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
}, {
  tableName: 'users',
  sequelize,
});
