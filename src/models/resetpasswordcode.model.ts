import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { db } from '../db';

export class ResetPasswordCodes extends Model<InferAttributes<ResetPasswordCodes>, InferCreationAttributes<ResetPasswordCodes>> {
  declare id?: string;
  declare userId: number;
  declare code: number;
};


export const initResetPasswordCodesModel = () => {
  const sequelize = db.initSequelize();

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
  
}
