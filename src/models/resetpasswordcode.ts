import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { sequelize } from '../db';

export class ResetPasswordCodes extends Model<InferAttributes<ResetPasswordCodes>, InferCreationAttributes<ResetPasswordCodes>> {
  declare id?: string;
  declare userId: number;
  declare code: number;
};

ResetPasswordCodes.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  code: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'resetpasswordcodes',
  sequelize,
});
