import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Problems extends Model { }

Problems.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        difficulty: {
            type: DataTypes.ENUM('easy', 'medium', 'hard'),
            allowNull: false,
        },
        input_format: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        output_format: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        constraints: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        time_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        memory_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Problems',
    }
);

export default Problems;