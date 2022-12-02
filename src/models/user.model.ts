import { Model, InferAttributes, InferCreationAttributes, DataTypes } from 'sequelize';
import { sequelize } from '../db';
import { Note } from './note.model';
import { ResetPasswordCodes } from './resetpasswordcode.model';

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

User.hasMany(Note, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Note.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasOne(ResetPasswordCodes, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
ResetPasswordCodes.belongsTo(User, { foreignKey: "userId", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
