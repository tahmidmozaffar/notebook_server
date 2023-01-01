import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
} from "sequelize";
import { db } from "../db";

export class Folder extends Model<
  InferAttributes<Folder>,
  InferCreationAttributes<Folder>
> {
  declare id?: number;
  declare userId: number;
  declare name: string;
}

export const initFolderModel = () => {
  const sequelize = db.initSequelize();

  Folder.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "folders",
      sequelize,
    }
  );
};
