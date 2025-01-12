// models/User.js
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model { }

User.init(
  {
    username: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);



export default User;
