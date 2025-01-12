import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

class Contest_Problems extends Model { }

Contest_Problems.init(
    {
        contestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        problemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Contest_Problems',
        timestamps: false,
    }
);

export default Contest_Problems;