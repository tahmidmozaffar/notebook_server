import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from "sequelize";
import { db } from "../db";

export class Note extends Model<
  InferAttributes<Note>,
  InferCreationAttributes<Note>
> {
  declare id?: number;
  declare userId: number;
  declare folderId: number;
  declare title: string;
  declare description: string;
  declare tasks?: object[];
  declare isDeleted?: number;
}

export const initNoteModel = () => {
  const sequelize = db.initSequelize();

  Note.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      folderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      },
    },
    {
      tableName: "notes",
      sequelize,
    }
  );
};
