import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../db';

export class Note extends Model<InferAttributes<Note>, InferCreationAttributes<Note>> {
  declare id?: number;
  declare title: string;
  declare description: string;
  declare tasks?: Object[];
  declare isDeleted?: number;
};

Note.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  tasks: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  isDeleted: {
    type: DataTypes.INTEGER,
  }  
}, {
  tableName: 'notes',
  sequelize,
});
